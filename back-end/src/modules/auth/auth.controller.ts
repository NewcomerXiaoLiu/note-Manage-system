import { Body, Controller, HttpCode, HttpException, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('认证')
@Controller()
export class AuthController {
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: '用户登录' })
  @ApiBody({ schema: { example: { username: 'admin', password: '123456' } } })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '账号或密码错误' })
  login(@Body() body: { username: string; password: string }) {
    if (body.username === 'admin' && body.password === '123456') {
      return {
        accessToken: 'note-manage-token-' + Date.now(),
        name: 'admin',
      };
    }
    throw new HttpException('账号或密码错误', 401);
  }

  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: '退出登录' })
  @ApiResponse({ status: 200, description: '退出成功' })
  logout() {
    return true;
  }
}
