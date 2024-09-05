import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateArtistInput {
  @Field()
  name: string;
  @Field()
  spotify_id: string;
}
