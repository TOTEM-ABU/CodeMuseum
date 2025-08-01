import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaveCommentDto } from './dto';

@Injectable()
export class HomeService {
  constructor(private prisma: PrismaService) {}

  async getAllPosts(categoryId?: string, page = 1, limit = 10) {
    return this.prisma.post.findMany({
      where: categoryId
        ? {
            PostCategory: {
              some: {
                categoryId: categoryId,
              },
            },
          }
        : {},
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        comments: true,
        reactions: true,
        PostCategory: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async leaveComment(dto: LeaveCommentDto) {
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
    userId: string;
    like: number;
    dislike: number;
  }) {
    return this.prisma.reaction.create({
      data: {
        postId: dto.postId,
        userId: dto.userId,
        like: dto.like || 0,
        dislike: dto.dislike || 0,
      },
    });
  }
}
