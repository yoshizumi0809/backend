import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Param,
} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post') //「/post」というURLに関するリクエスト
export class PostController {
  //DIコンテナからpostServiceをインスタンス化せずにインポートできる。
  constructor(private readonly postService: PostService) {}

  //「/post」というURLにPOSTメソッドを要求されたときの処理
  @Post()
  async createPost(
    //const res = await axios.post(url, data)のdataがHTTPリクエストのボディ部分に存在
    @Body('message') message: string,
    //URLのクエリパラメータからtoken変数を抜き出す。
    @Query('token') token: string,
  ) {
    return await this.postService.createPost(message, token);
  }

  @Get()
  async getList(
    @Query('token') token: string,
    @Query('start') start: number,
    @Query('records') records: number,
  ) {
    return await this.postService.getList(token, start, records);
  }

  @Get('all')
  async getAllPosts(@Query('token') token: string) {
    return await this.postService.getAllPosts(token); // ← Service側も用意
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string, @Query('token') token: string) {
    await this.postService.deletePost(Number(id), token);
    return { message: '投稿を削除しました' };
  }
}
