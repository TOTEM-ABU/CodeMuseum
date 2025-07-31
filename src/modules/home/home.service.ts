import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgrammingLanguage } from '@prisma/client';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts(p_lang?: ProgrammingLanguage, page = 1, limit = 10) {
    return this.prisma.post.findMany({
      where: p_lang
        ? {
            PostCategory: {
              some: {
                category: {
                  name: p_lang,
                },
              },
            },
          }
        : {},
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

  async leaveComment(dto: { postId: string; userId: string; message: string }) {
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

  async react(dto: { postId: string; userId: string; like: number; dislike: number }) {
    return this.prisma.like.create({
      data: {
        postId: dto.postId,
        userId: dto.userId,
        like: dto.like,
        dislike: dto.dislike,
      },
    });
  }
}
