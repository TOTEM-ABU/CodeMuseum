import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreatePostDto,
  CreateAnonymousPostDto,
  UpdatePostDto,
  CreateReactionDto,
  CreateCommentDto,
} from './dto';
import { isUUID } from 'validator';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Convert categoryName to uppercase
    const categoryName = createPostDto.categoryName.toUpperCase();

    // Find existing category
    const category = await this.prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      throw new BadRequestException(
        `Category '${categoryName}' does not exist. Please create the category first or use an existing category name.`,
      );
    }

    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        code: createPostDto.code,
        userId: userId,
        PostCategory: {
          create: {
            categoryId: category.id,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            githubURL: true,
          },
        },
        PostCategory: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        reactions: true,
      },
    });

    return {
      message: 'Post created successfully',
      data: post,
    };
  }

  async createAnonymous(createAnonymousPostDto: CreateAnonymousPostDto) {
    // Convert categoryName to uppercase
    const categoryName = createAnonymousPostDto.categoryName.toUpperCase();

    // Find existing category
    const category = await this.prisma.category.findFirst({
      where: { name: categoryName },
    });

    if (!category) {
      throw new BadRequestException(
        `Category '${categoryName}' does not exist. Please create the category first or use an existing category name.`,
      );
    }

    // Create or find anonymous user
    let anonymousUser = await this.prisma.user.findFirst({
      where: {
        username: 'anonymous',
        email: 'anonymous@gmail.com',
      },
    });

    if (!anonymousUser) {
      anonymousUser = await this.prisma.user.create({
        data: {
          username: 'anonymous',
          email: 'anonymous@gmail.com',
          password: 'anonymous_password', // This won't be used for authentication
        },
      });
    }

    const post = await this.prisma.post.create({
      data: {
        title: createAnonymousPostDto.title,
        code: createAnonymousPostDto.code,
        userId: anonymousUser.id,
        PostCategory: {
          create: {
            categoryId: category.id,
          },
        },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            githubURL: true,
          },
        },
        PostCategory: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        reactions: true,
      },
    });

    return {
      message: 'Anonymous post created successfully',
      data: post,
    };
  }

  async findAll(
    page = 1,
    limit = 10,
    categoryId?: string,
    categoryName?: string | string[],
  ) {
    const skip = (page - 1) * limit;
    let where: any = {};

    if (categoryId) {
      where.PostCategory = { some: { categoryId } };
    }
    if (categoryName) {
      where.PostCategory = {
        some: {
          category: {
            name: Array.isArray(categoryName)
              ? { in: categoryName }
              : { contains: categoryName, mode: 'insensitive' },
          },
        },
      };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, username: true, githubURL: true } },
          PostCategory: {
            include: {
              category: {
                select: { id: true, name: true },
              },
            },
          },
          comments: {
            include: { user: { select: { id: true, username: true } } },
          },
          reactions: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      message: 'Posts retrieved successfully',
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            githubURL: true,
          },
        },
        PostCategory: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
        reactions: true,
      },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      message: 'Post retrieved successfully',
      data: post,
    };
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    if (!id) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user owns the post
    if (post.userId !== userId) {
      throw new BadRequestException('You can only update your own posts');
    }

    // Handle categoryName if provided
    let categoryId: string | undefined = undefined;
    if (updatePostDto.categoryName) {
      // Convert categoryName to uppercase
      const categoryName = updatePostDto.categoryName.toUpperCase();

      // Find existing category
      const category = await this.prisma.category.findFirst({
        where: { name: categoryName },
      });

      if (!category) {
        throw new BadRequestException(
          `Category '${categoryName}' does not exist. Please create the category first or use an existing category name.`,
        );
      }

      categoryId = category.id;
    }

    const updateData: any = {};
    if (updatePostDto.title) updateData.title = updatePostDto.title;
    if (updatePostDto.code) updateData.code = updatePostDto.code;

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            githubURL: true,
          },
        },
        PostCategory: {
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
              },
            },
          },
        },
        reactions: true,
      },
    });

    // Update PostCategory if categoryId is provided
    if (categoryId) {
      // Delete existing PostCategory relations
      await this.prisma.postCategory.deleteMany({
        where: { postId: id },
      });

      // Create new PostCategory relation
      await this.prisma.postCategory.create({
        data: {
          postId: id,
          categoryId: categoryId,
        },
      });
    }

    return {
      message: 'Post updated successfully',
      data: updatedPost,
    };
  }

  async remove(id: string, userId: string) {
    if (!id) {
      throw new BadRequestException('Invalid post ID');
    }

    const post = await this.prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // Check if user owns the post
    if (post.userId !== userId) {
      throw new BadRequestException('You can only delete your own posts');
    }

    await this.prisma.post.delete({
      where: { id },
    });

    return {
      message: 'Post deleted successfully',
    };
  }

  async findByUser(userId: string, page = 1, limit = 10) {
    if (!isUUID(userId)) throw new BadRequestException('Invalid user ID');

    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, username: true, githubURL: true } },
          PostCategory: { select: { id: true } },
          comments: {
            include: { user: { select: { id: true, username: true } } },
          },
          reactions: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where: { userId } }),
    ]);

    return {
      message: 'User posts retrieved successfully',
      data: posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async addReaction(
    postId: string,
    userId: string,
    createReactionDto: CreateReactionDto,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existingReaction = await this.prisma.reaction.findFirst({
      where: { postId, userId },
    });
    const likeValue = createReactionDto.type === 'like' ? 1 : 0;
    const dislikeValue = createReactionDto.type === 'dislike' ? 1 : 0;

    const reaction = existingReaction
      ? await this.prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { like: likeValue, dislike: dislikeValue },
          include: { User: { select: { id: true, username: true } } },
        })
      : await this.prisma.reaction.create({
          data: { like: likeValue, dislike: dislikeValue, userId, postId },
          include: { User: { select: { id: true, username: true } } },
        });

    return {
      message: `${createReactionDto.type} updated successfully`,
      data: reaction,
    };
  }

  async addComment(
    postId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const comment = await this.prisma.comment.create({
      data: { 
        message: createCommentDto.message, 
        userId: userId, 
        postId: postId 
      },
      include: { user: { select: { id: true, username: true } } },
    });

    return { message: 'Comment added successfully', data: comment };
  }

  async getCommentsByPostId(postId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { postId },
        skip,
        take: limit,
        include: { user: { select: { id: true, username: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.comment.count({ where: { postId } }),
    ]);

    return {
      message: 'Comments retrieved successfully',
      data: comments,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async getReactionsByPostId(postId: string) {
    const reactions = await this.prisma.reaction.findMany({
      where: { postId },
      include: { User: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const totalLikes = reactions.filter((r) => r.like === 1).length;
    const totalDislikes = reactions.filter((r) => r.dislike === 1).length;

    return {
      message: 'Reactions retrieved successfully',
      data: {
        reactions,
        summary: {
          totalLikes,
          totalDislikes,
          totalReactions: reactions.length,
        },
      },
    };
  }
}
