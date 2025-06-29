import { Injectable } from '@nestjs/common';
import { SignInInput } from './dto/signin.input';

@Injectable()
export class AuthService {
    async validateLocalUser({ email, password }:SignInInput)
}
