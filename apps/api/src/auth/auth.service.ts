import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInInput } from './dto/signin.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {
        
    }
    
    async validateLocalUser({ email, password }:SignInInput) {
        const user = await this.prisma.user.findUnique({
            where: {
                email
            },
        });

        if(!user) throw new UnauthorizedException('User not found');

        const passswordMatches = await verify(user.password, password);

        if(!passswordMatches)
            throw new UnauthorizedException('Invalid Credentials!');

        return user;
    }
}
