import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { UpdateUserDto } from './dto';
import { isUUID } from 'validator';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        githubURL: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            reactions: true, // reactions uchun ham reactions table dan hisoblanadi
          },
        },
        posts: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            code: true,
            createdAt: true,
            PostCategory: {
              select: {
                id: true,
              },
            },
            _count: {
              select: {
                reactions: true,
                comments: true,
              },
            },
          },
        },
        comments: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            message: true,
            createdAt: true,
            Post: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
        reactions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            like: true,
            dislike: true,
            createdAt: true,
            Post: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User profile retrieved successfully',
      data: user,
    };
  }

  async getMyReactions(
    userId: string,
    page = 1,
    limit = 10,
    type?: 'like' | 'dislike',
  ) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const skip = (page - 1) * limit;

    // Build where clause for filtering
    let where: any = { userId };

    if (type) {
      if (type === 'like') {
        where.like = 1;
      } else if (type === 'dislike') {
        where.dislike = 1;
      }
    }

    const [reactions, total] = await Promise.all([
      this.prisma.reaction.findMany({
        where,
        skip,
        take: limit,
        include: {
          Post: {
            select: {
              id: true,
              title: true,
              code: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
              PostCategory: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.reaction.count({ where }),
    ]);

    return {
      message: 'User reactions retrieved successfully',
      data: reactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateSettings(userId: string, updateUserDto: UpdateUserDto) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if username is already taken (if provided)
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUser = await this.prisma.user.findUnique({
        where: { username: updateUserDto.username },
      });

      if (existingUser) {
        throw new BadRequestException('Username already taken');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(updateUserDto.username && { username: updateUserDto.username }),
        ...(updateUserDto.email && { email: updateUserDto.email }),
        ...(updateUserDto.githubURL && { githubURL: updateUserDto.githubURL }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        githubURL: true,
        createdAt: true,
      },
    });

    return {
      message: 'User settings updated successfully',
      data: updatedUser,
    };
  }

  async getMyPosts(userId: string, page = 1, limit = 10) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          PostCategory: {
            select: {
              id: true,
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
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.post.count({ where: { userId } }),
    ]);

    return {
      message: 'User posts retrieved successfully',
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMyComments(userId: string, page = 1, limit = 10) {
    if (!isUUID(userId)) {
      throw new BadRequestException('Invalid user ID');
    }

    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          Post: {
            select: {
              id: true,
              title: true,
              code: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  username: true,
                },
              },
              PostCategory: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.comment.count({ where: { userId } }),
    ]);

    return {
      message: 'User comments retrieved successfully',
      data: comments,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
