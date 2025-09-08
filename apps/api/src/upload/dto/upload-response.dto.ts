import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class UploadResponse {
  @Field()
  success: boolean;

  @Field()
  url: string;

  @Field()
  message: string;
}
