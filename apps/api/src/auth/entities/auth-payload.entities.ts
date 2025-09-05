import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from './role.entities';

@ObjectType()
export class AuthPayload {
  @Field()
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  avatar?: string;

  @Field()
  accessToken: string;

  @Field(() => Role, { nullable: true })
  role?: Role;
}