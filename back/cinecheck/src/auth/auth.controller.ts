import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Request, 
  Res, 
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async signIn(
    @Body() signInDto: Record<string, any>, 
    @Res({ passthrough: true }) response: Response
  ) {
    try {
      const token = await this.authService.signIn(signInDto.email, signInDto.pword);
      
      response.cookie(
        'access_token',
        token.access_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 24 * 60 * 60 * 1000
        }
      );
      
      return response.json({ message: 'Connexion réussie' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      
      console.error('Login error:', error);
      return response.status(401).json({ 
        error: 'Email ou mot de passe incorrect',
        details: process.env.NODE_ENV === 'production' ? null : errorMessage 
      });
    }
  }


  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
