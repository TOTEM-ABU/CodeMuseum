import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
import {
  CreatePostDto,
  CreateAnonymousPostDto,
  UpdatePostDto,
  CreateReactionDto,
  CreateCommentDto,
} from './dto';
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
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            title: { type: 'string', example: 'React Hooks Example' },
            code: {
              type: 'string',
              example: 'const [count, setCount] = useState(0);',
            },
            userId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string' },
                githubURL: { type: 'string' },
              },
            },
            PostCategory: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 400,
    description: 'Bad request or invalid category name',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async create(@Body() createPostDto: CreatePostDto, @User() user: any) {
    return this.postService.create(createPostDto, user.id);
  }

  @Post('anonymous')
  @ApiOperation({ summary: 'Create an anonymous post (no authentication required)' })
  @ApiResponse({
    status: 201,
    description: 'Anonymous post created successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Anonymous post created successfully' },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            title: { type: 'string', example: 'React Hooks Example' },
            code: {
              type: 'string',
              example: 'const [count, setCount] = useState(0);',
            },
            userId: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                username: { type: 'string', example: 'anonymous' },
                githubURL: { type: 'string' },
              },
            },
            PostCategory: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or invalid category name',
  })
  async createAnonymous(@Body() createAnonymousPostDto: CreateAnonymousPostDto) {
    return this.postService.createAnonymous(createAnonymousPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Filter by category ID',
  })
  @ApiQuery({
    name: 'categoryName',
    required: false,
    type: String,
    example: 'JavaScript',
    description: 'Filter by category name (can be multiple)',
  })
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
              id: { type: 'string' },
              title: { type: 'string' },
              code: { type: 'string' },
              userId: { type: 'string' },
              createdAt: { type: 'string' },
              user: { type: 'object' },
              PostCategory: { type: 'array' },
              comments: { type: 'array' },
              reactions: { type: 'array' },
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
      categoryId,
      categoryName,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific post by ID' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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
            id: { type: 'string' },
            title: { type: 'string' },
            code: { type: 'string' },
            userId: { type: 'string' },
            createdAt: { type: 'string' },
            user: { type: 'object' },
            PostCategory: { type: 'array' },
            comments: { type: 'array' },
            reactions: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid post ID' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a post' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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
            id: { type: 'string' },
            title: { type: 'string' },
            code: { type: 'string' },
            userId: { type: 'string' },
            createdAt: { type: 'string' },
            user: { type: 'object' },
            PostCategory: { type: 'array' },
            comments: { type: 'array' },
            reactions: { type: 'array' },
          },
        },
      },
    },
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 400,
    description: 'Bad request or invalid category name',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @User() user: any,
  ) {
    return this.postService.update(id, updatePostDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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
  @ApiResponse({ status: 400, description: 'Invalid post ID' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtGuard)
  async remove(@Param('id') id: string, @User() user: any) {
    return this.postService.remove(id, user.id);
  }

  @Post(':id/reactions')
  @ApiOperation({ summary: 'Add a reaction to a post' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 201,
    description: 'Reaction added successfully',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Reaction added successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            like: { type: 'number' },
            dislike: { type: 'number' },
            userId: { type: 'string' },
            postId: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request or unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async addReaction(
    @Param('id') id: string,
    @Body() createReactionDto: CreateReactionDto,
    @User() user: any,
  ) {
    return this.postService.addReaction(id, user.id, createReactionDto);
  }

  @Post(':id/comment')
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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
            postId: { type: 'string' },
            createdAt: { type: 'string' },
            user: { type: 'object' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request or unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @User() user: any,
  ) {
    return this.postService.addComment(id, user.id, createCommentDto);
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'Get comments for a specific post with pagination' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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
              postId: { type: 'string' },
              createdAt: { type: 'string' },
              user: { type: 'object' },
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
    @Param('id') id: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.postService.getCommentsByPostId(id, page || 1, limit || 10);
  }

  @Get(':id/reactions')
  @ApiOperation({ summary: 'Get reactions for a specific post' })
  @ApiParam({
    name: 'id',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reactions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Reactions retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              like: { type: 'number' },
              dislike: { type: 'number' },
              userId: { type: 'string' },
              postId: { type: 'string' },
              createdAt: { type: 'string' },
              User: { type: 'object' },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid post ID' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getReactions(@Param('id') id: string) {
    return this.postService.getReactionsByPostId(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get posts by user ID with pagination' })
  @ApiParam({
    name: 'userId',
    type: 'string',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'User posts retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User posts retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
              code: { type: 'string' },
              userId: { type: 'string' },
              createdAt: { type: 'string' },
              user: { type: 'object' },
              PostCategory: { type: 'array' },
              comments: { type: 'array' },
              reactions: { type: 'array' },
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
