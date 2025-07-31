import { Controller, Get, Query, Post, Body, Param } from '@nestjs/common';
import { HomeService } from './home.service';
import { LeaveCommentDto, ReactionDto } from './dto';
import { ProgrammingLanguage } from '@prisma/client';
import { ApiQuery } from '@nestjs/swagger';

@Controller()
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('get-all-posts')
  @ApiQuery({ name: 'p_lang', required: false, enum: ProgrammingLanguage })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAllPosts(
    @Query('p_lang') p_lang?: ProgrammingLanguage,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const pageNumber = page ? parseInt(page, 10) : 1;
    const limitNumber = limit ? parseInt(limit, 10) : 10;

    return this.homeService.getAllPosts(p_lang, pageNumber, limitNumber);
  }

  @Post('leave-comment')
  leaveComment(@Body() body: LeaveCommentDto) {
    return this.homeService.leaveComment(body);
  }

  @Get('comments-by-post-id/:postId')
  getComments(@Param('postId') postId: string) {
    return this.homeService.getCommentsByPostId(postId);
  }

  @Post('reaction')
  addReaction(@Body() body: ReactionDto) {
    return this.homeService.react(body);
  }
}
