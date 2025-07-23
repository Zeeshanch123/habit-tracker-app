import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Sign up a new user (Supabase Auth + local user)' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User registered successfully!Check your email and confirm email to become a supabase user' })
  @ApiBadRequestResponse({ description: 'Invalid input or Supabase error' })
  async signUp(@Body() dto: CreateUserDto) {
    return this.authService.signUp(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user via Supabase Auth' })
  @ApiBody({ schema: { properties: { email: { type: 'string' }, password: { type: 'string' } } } })
  @ApiOkResponse({ description: 'User logged in successfully' })
  @ApiBadRequestResponse({ description: 'Invalid credentials or Supabase error' })
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
} 