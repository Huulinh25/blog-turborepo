import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule } from 'nestjs/jwt';

@Module({
  imports: [JwtModule.register({
    secret: "",
    signOpions: {
      expiresIn: "",
    }
  })],
  providers: [AuthResolver, AuthService, PrismaService],
})
export class AuthModule {}
