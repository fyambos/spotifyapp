import { CreateSongInput } from './create-song.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSongInput extends PartialType(CreateSongInput) {
  @Field(() => Int)
  id: number;
  @Field({ description: 'spotify id' })
  spotify_id: string;
  @Field()
  name: string;
}
