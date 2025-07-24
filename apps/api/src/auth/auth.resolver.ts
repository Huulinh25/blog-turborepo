import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SignInInput } from './dto/signin.input';
import { AuthPayload } from './entities/auth-payload.entities';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async signIn (@Args("signInInput") sinInInput: SignInInput){
    const user = await this.authService.validateLocalUser(sinInInput);
    return await this.authService.login(user);
  }
}
