import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgrammingLanguage } from '@prisma/client';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts(categoryId?: number, page = 1, limit = 10) {
    return this.prisma.post.findMany({
      where: categoryId ? { categoryId } : {},
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        comments: true,
        likes: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async leaveComment(dto: { postId: number; userId: string; message: string }) {
    return this.prisma.comment.create({
      data: {
        message: dto.message,
        postId: dto.postId,
        userId: dto.userId,
      },
    });
  }

  async getCommentsByPostId(postId: number) {
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

  async react(dto: { postId: number; userId: string; like: number; dislike: number }) {
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
