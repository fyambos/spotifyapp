import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSongInput {
  @Field({ description: 'spotify id' })
  spotify_id: string;
  @Field()
  name: string;
}
