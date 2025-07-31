import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgrammingLanguage } from '@prisma/client';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts(p_lang?: ProgrammingLanguage, page = 1, limit = 10) {
    const whereCondition = p_lang
      ? {
          PostCategory: {
            some: {
              category: {
                name: {
                  equals: p_lang,
                  mode: 'insensitive', // katta-kichik harfni farqlamaslik uchun
                },
              },
            },
          },
        }
      : {};

    return this.prisma.post.findMany({
      where: Object.keys(whereCondition).length
        ? {
            PostCategory: {
              some: {
                category: {
                  name: whereCondition.PostCategory?.some?.category?.name
                    ?.equals,
                },
              },
            },
          }
        : undefined,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        comments: true,
        likes: true,
        PostCategory: {
          include: { category: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async leaveComment(dto: {
    postId: string;
    userId?: string;
    message: string;
  }) {
    if (!dto.userId) {
      throw new Error('userId is required for creating a comment');
    }

    return this.prisma.comment.create({
      data: {
        message: dto.message,
        postId: dto.postId,
        userId: dto.userId,
      },
    });
  }

  async getCommentsByPostId(postId: string) {
    return this.prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: { username: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async react(dto: {
    postId: string;
    userId?: string;
    like?: number;
    dislike?: number;
  }) {
    if (!dto.userId) {
      throw new Error('userId is required for creating a reaction');
    }

    return this.prisma.like.create({
      data: {
        postId: dto.postId,
        userId: dto.userId,
        like: dto.like || 0,
        dislike: dto.dislike || 0,
      },
    });
  }
}
