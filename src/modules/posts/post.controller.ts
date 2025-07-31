import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto, CreateReactionDto, CreateCommentDto } from './dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../auth/decorators/user.decorator';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Post created successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            title: { type: 'string', example: 'React Hooks Example' },
            code: { type: 'string', example: 'const [count, setCount] = useState(0);' },
            userId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            categoryId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                githubURL: { type: 'string' },
              },
            },
            category: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'Category or user not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async create(@Body() createPostDto: CreatePostDto, @User() user: any) {
    return this.postService.create(createPostDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'Filter by category ID' })
  @ApiQuery({ name: 'categoryName', required: false, type: String, example: 'JavaScript', description: 'Filter by category name (can be multiple)' })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Posts retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              code: { type: 'string' },
              userId: { type: 'string' },
              categoryId: { type: 'string' },
              createdAt: { type: 'string' },
              user: { type: 'object' },
              category: { type: 'object' },
              comments: { type: 'array' },
              likes: { type: 'array' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('categoryId') categoryId?: string,
    @Query('categoryName') categoryName?: string | string[],
  ) {
    return this.postService.findAll(
      page || 1, 
      limit || 10, 
      categoryId ? Number(categoryId) : undefined,
      categoryName
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific post by ID' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Post retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            code: { type: 'string' },
            userId: { type: 'string' },
            categoryId: { type: 'string' },
            createdAt: { type: 'string' },
            user: { type: 'object' },
            category: { type: 'object' },
            comments: { type: 'array' },
            likes: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid post ID' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Post updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            title: { type: 'string' },
            code: { type: 'string' },
            userId: { type: 'string' },
            categoryId: { type: 'string' },
            createdAt: { type: 'string' },
            user: { type: 'object' },
            category: { type: 'object' },
            comments: { type: 'array' },
            likes: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'Bad request or unauthorized' })
  @ApiResponse({ status: 404, description: 'Post or category not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
    @User() user: any,
  ) {
    return this.postService.update(id, updatePostDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Post deleted successfully' },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({ status: 400, description: 'Invalid post ID or unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async remove(@Param('id', ParseIntPipe) id: number, @User() user: any) {
    return this.postService.remove(id, user.id);
  }

  @Post(':id/reactions')
  @ApiOperation({ summary: 'Add or update reaction (like/dislike) for a post' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Reaction updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'like updated successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            like: { type: 'number' },
            dislike: { type: 'number' },
            userId: { type: 'string' },
            postId: { type: 'number' },
            createdAt: { type: 'string' },
            User: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid post ID or reaction data' })
  @ApiResponse({ status: 404, description: 'Post or user not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async addReaction(
    @Param('id', ParseIntPipe) id: number,
    @Body() createReactionDto: CreateReactionDto,
    @User() user: any,
  ) {
    return this.postService.addLike(id, user.id, createReactionDto);
  }

  @Post(':id/comment')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiBearerAuth()
  @ApiResponse({
    status: 201,
    description: 'Comment added successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Comment added successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            message: { type: 'string' },
            userId: { type: 'string' },
            postId: { type: 'number' },
            createdAt: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid post ID or comment data' })
  @ApiResponse({ status: 404, description: 'Post or user not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async addComment(
    @Param('id', ParseIntPipe) id: number,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: any,
  ) {
    return this.postService.addComment(id, user.id, createCommentDto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a post' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Comments retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Comments retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              message: { type: 'string' },
              userId: { type: 'string' },
              postId: { type: 'number' },
              createdAt: { type: 'string' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  username: { type: 'string' },
                },
              },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid post ID' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getComments(
    @Param('id', ParseIntPipe) id: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.postService.getCommentsByPostId(id, page || 1, limit || 10);
  }

  @Get(':id/reactions')
  @ApiOperation({ summary: 'Get all reactions for a post' })
  @ApiParam({ name: 'id', type: 'number', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Reactions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Reactions retrieved successfully' },
        data: {
          type: 'object',
          properties: {
            reactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  like: { type: 'number' },
                  dislike: { type: 'number' },
                  userId: { type: 'string' },
                  postId: { type: 'number' },
                  createdAt: { type: 'string' },
                  User: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      username: { type: 'string' },
                    },
                  },
                },
              },
            },
            summary: {
              type: 'object',
              properties: {
                totalLikes: { type: 'number' },
                totalDislikes: { type: 'number' },
                totalReactions: { type: 'number' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid post ID' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getReactions(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getLikesByPostId(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get posts by user ID' })
  @ApiParam({ name: 'userId', type: 'string' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'User posts retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User posts retrieved successfully' },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number' },
              title: { type: 'string' },
              code: { type: 'string' },
              userId: { type: 'string' },
              categoryId: { type: 'string' },
              createdAt: { type: 'string' },
              user: { type: 'object' },
              category: { type: 'object' },
              comments: { type: 'array' },
              likes: { type: 'array' },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            totalPages: { type: 'number' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  async findByUser(
    @Param('userId') userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.postService.findByUser(userId, page || 1, limit || 10);
  }
}
