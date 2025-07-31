import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma';
import { UpdateCategoryDto } from './dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(page = 1, limit = 10, name?: string | string[]) {
    const skip = (page - 1) * limit;

    // Build where clause for name filtering
    let where = {};
    if (name) {
      if (Array.isArray(name)) {
        // Multiple names provided
        where = {
          name: {
            in: name,
          },
        };
      } else {
        // Single name provided
        where = {
          name: {
            contains: name,
            mode: 'insensitive', // Case insensitive search
          },
        };
      }
    }

    const [categories, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        include: {
          PostCategory: {
            include: {
              post: {
                include: {
                  user: {
                    select: {
                      id: true,
                      username: true,
                      githubURL: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.category.count({ where }),
    ]);

    return {
      message: 'Categories retrieved successfully',
      data: categories,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid category ID');
    }

    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        PostCategory: {
          include: {
            post: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    githubURL: true,
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
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      message: 'Category retrieved successfully',
      data: category,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.prisma.category.findFirst({
        where: {
          name: updateCategoryDto.name,
          id: { not: id },
        },
      });

      if (existingCategory) {
        throw new BadRequestException('Category with this name already exists');
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        ...(updateCategoryDto.name && { name: updateCategoryDto.name }),
      },
      include: {
        PostCategory: {
          include: {
            post: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    githubURL: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      message: 'Category updated successfully',
      data: updatedCategory,
    };
  }

  async remove(id: string) {
    if (!id) {
      throw new BadRequestException('Invalid category ID');
    }

    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        PostCategory: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.PostCategory.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with existing posts',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Category deleted successfully',
    };
  }
} 