import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { AuthGuard } from './guards/auth-guard';
import { RequestWithUser } from 'src/global-interfaces/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, data } = await this.authService.login(loginDto);
    res.cookie('jwt', token, {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: true,
      secure: false,
    });
    return { message: 'Login successfull', data };
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { messsge: 'Logout successfull' };
  }

  @UseGuards(AuthGuard)
  @Get('logged-user')
  authenticatedUser(@Req() req: RequestWithUser) {
    return this.authService.findOne(req.user);
  }
}
