import { Controller, Get, Query, Post, Body, Param } from '@nestjs/common';
import { HomeService } from './home.service';

@Controller()
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get('get-all-posts')
  getAllPosts(
    @Query('p_lang') p_lang?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.homeService.getAllPosts(p_lang as any, Number(page) || 1, Number(limit) || 10);
  }

  @Post('leave-comment')
  leaveComment(@Body() body: { postId: string; userId: string; message: string }) {
    return this.homeService.leaveComment(body);
  }

  @Get('comments-by-post-id/:postId')
  getComments(@Param('postId') postId: string) {
    return this.homeService.getCommentsByPostId(postId);
  }

  @Post('reaction')
  addReaction(@Body() body: { postId: string; userId: string; like: number; dislike: number }) {
    return this.homeService.react(body);
  }
}
