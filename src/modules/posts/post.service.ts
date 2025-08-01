import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import {
  CreatePostDto,
  UpdatePostDto,
  CreateReactionDto,
  CreateCommentDto,
} from './dto';
import { isUUID } from 'validator';
import { ProgrammingLanguage } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const categoryName = createPostDto.categoryName.toUpperCase();
    if (!Object.values(ProgrammingLanguage).includes(categoryName as ProgrammingLanguage)) {
      throw new BadRequestException(
        `Invalid category name. Must be one of: ${Object.values(ProgrammingLanguage).join(', ')}`,
      );
    }

    let category = await this.prisma.category.findFirst({ where: { name: categoryName } });
    if (!category) {
      category = await this.prisma.category.create({ data: { name: categoryName } });
    }

    const post = await this.prisma.post.create({
      data: {
        title: createPostDto.title,
        code: createPostDto.code,
        userId,
        PostCategory: {
          create: { categoryId: category.id },
        },
      },
      include: {
        user: { select: { id: true, username: true, githubURL: true } },
        PostCategory: { include: { category: true } },
        comments: { include: { user: { select: { id: true, username: true } } } },
        likes: true,
      },
    });

    return { message: 'Post created successfully', data: post };
  }

  async findAll(page = 1, limit = 10, categoryId?: number, categoryName?: string | string[]) {
    const skip = (page - 1) * limit;
    let where: any = {};

    if (categoryId) {
      where.PostCategory = { some: { categoryId } };
    }
    if (categoryName) {
      where.category = {
        name: Array.isArray(categoryName)
          ? { in: categoryName }
          : { contains: categoryName, mode: 'insensitive' },
      };
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, username: true, githubURL: true } },
          PostCategory: { select: { id: true } },
          comments: { include: { user: { select: { id: true, username: true } } } },
          likes: true,
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
        category: {
          select: {
            id: true,
            name: true,
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
        likes: true,
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

      // Validate that categoryName is in ProgrammingLanguage enum
      if (!Object.values(ProgrammingLanguage).includes(categoryName as ProgrammingLanguage)) {
        throw new BadRequestException(`Invalid category name. Must be one of: ${Object.values(ProgrammingLanguage).join(', ')}`);
      }

      // Find or create category
      let category = await this.prisma.category.findFirst({
        where: { name: categoryName },
      });

      if (!category) {
        // Create the category if it doesn't exist
        category = await this.prisma.category.create({
          data: {
            name: categoryName,
          },
        });
      }

      categoryId = category.id;
    }

    const updateData: any = {};
    if (updatePostDto.title) updateData.title = updatePostDto.title;
    if (updatePostDto.code) updateData.code = updatePostDto.code;
    if (categoryId) updateData.categoryId = categoryId;

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
        category: {
          select: {
            id: true,
            name: true,
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
        likes: true,
      },
    });

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
          comments: { include: { user: { select: { id: true, username: true } } } },
          likes: true,
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

  async addLike(postId: string, userId: string, createReactionDto: CreateReactionDto) {

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existingLike = await this.prisma.like.findFirst({ where: { postId, userId } });
    const likeValue = createReactionDto.type === 'like' ? 1 : 0;
    const dislikeValue = createReactionDto.type === 'dislike' ? 1 : 0;

    const like = existingLike
      ? await this.prisma.like.update({
          where: { id: existingLike.id },
          data: { like: likeValue, dislike: dislikeValue },
          include: { User: { select: { id: true, username: true } } },
        })
      : await this.prisma.like.create({
          data: { like: likeValue, dislike: dislikeValue, userId, postId },
          include: { User: { select: { id: true, username: true } } },
        });

    return { message: `${createReactionDto.type} updated successfully`, data: like };
  }

  async addComment(postId: string, userId: string, createCommentDto: CreateCommentDto) {

    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const comment = await this.prisma.comment.create({
      data: { message: createCommentDto.message, userId, postId },
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

  async getLikesByPostId(postId: string) {

    const likes = await this.prisma.like.findMany({
      where: { postId },
      include: { User: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });

    const totalLikes = likes.filter((l) => l.like === 1).length;
    const totalDislikes = likes.filter((l) => l.dislike === 1).length;

    return {
      message: 'Likes retrieved successfully',
      data: {
        likes,
        summary: {
          totalLikes,
          totalDislikes,
          totalReactions: likes.length,
        },
      },
    };
  }
}
