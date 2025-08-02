import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../auth/decorators/user.decorator';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile with recent activity' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User profile retrieved successfully',
        },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            githubURL: { type: 'string' },
            createdAt: { type: 'string' },
            _count: {
              type: 'object',
              properties: {
                posts: { type: 'number' },
                comments: { type: 'number' },
                reactions: { type: 'number' }, // reactions uchun ham reactions table dan hisoblanadi
              },
            },
            posts: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  code: { type: 'string' },
                  createdAt: { type: 'string' },
                  category: { type: 'object' },
                  _count: { type: 'object' },
                },
              },
            },
            comments: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  message: { type: 'string' },
                  createdAt: { type: 'string' },
                  Post: { type: 'object' },
                },
              },
            },
            reactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  like: { type: 'number' },
                  dislike: { type: 'number' },
                  createdAt: { type: 'string' },
                  Post: { type: 'object' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@User() user: any) {
    return this.userService.getProfile(user.id);
  }

  @Get('my-reactions')
  @ApiOperation({ summary: 'Get current user reactions (likes/dislikes)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'type',
    required: false,
    type: String,
    enum: ['like', 'dislike'],
    description: 'Filter by reaction type: "like" or "dislike"',
    example: 'like',
  })
  @ApiResponse({
    status: 200,
    description: 'User reactions retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User reactions retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              like: { type: 'number' },
              dislike: { type: 'number' },
              createdAt: { type: 'string' },
              Post: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  code: { type: 'string' },
                  createdAt: { type: 'string' },
                  user: { type: 'object' },
                  category: { type: 'object' },
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
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyReactions(
    @User() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('type') type?: 'like' | 'dislike',
  ) {
    return this.userService.getMyReactions(
      user.id,
      page || 1,
      limit || 10,
      type,
    );
  }

  @Get('my-posts')
  @ApiOperation({ summary: 'Get current user posts' })
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
              id: { type: 'number' },
              title: { type: 'string' },
              code: { type: 'string' },
              createdAt: { type: 'string' },
              category: { type: 'object' },
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
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyPosts(
    @User() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.userService.getMyPosts(user.id, page || 1, limit || 10);
  }

  @Get('my-comments')
  @ApiOperation({ summary: 'Get current user comments' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'User comments retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User comments retrieved successfully',
        },
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              message: { type: 'string' },
              createdAt: { type: 'string' },
              Post: {
                type: 'object',
                properties: {
                  id: { type: 'number' },
                  title: { type: 'string' },
                  code: { type: 'string' },
                  createdAt: { type: 'string' },
                  user: { type: 'object' },
                  category: { type: 'object' },
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
  @ApiResponse({ status: 400, description: 'Invalid user ID' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyComments(
    @User() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.userService.getMyComments(user.id, page || 1, limit || 10);
  }

  @Put('settings')
  @ApiOperation({ summary: 'Update user profile settings' })
  @ApiResponse({
    status: 200,
    description: 'User settings updated successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User settings updated successfully',
        },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' },
            githubURL: { type: 'string' },
            createdAt: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data or username already taken',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async updateSettings(
    @User() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateSettings(user.id, updateUserDto);
  }
}
