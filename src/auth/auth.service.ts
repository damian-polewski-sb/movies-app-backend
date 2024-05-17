import { Injectable } from '@nestjs/common';

import * as argon from 'argon2';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import { Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signupLocal(dto: AuthDto): Promise<Tokens> {
    const hash = await argon.hash(dto.password);

    const user = this.prisma.user.create({
      data: {
        email: dto.email,
        hash,
      },
    });
  }

  signinLocal() {}

  logout() {}

  refreshTokens() {}
}
