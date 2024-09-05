import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ArtistsService } from './artists.service';
import { Artist } from './entities/artist.entity';
import { CreateArtistInput } from './dto/create-artist.input';
import { UpdateArtistInput } from './dto/update-artist.input';

@Resolver(() => Artist)
export class ArtistsResolver {
  constructor(private readonly artistsService: ArtistsService) {}

  @Mutation(() => Artist)
  createArtist(@Args('createArtistInput') createArtistInput: CreateArtistInput) {
    return this.artistsService.create(createArtistInput);
  }

  @Query(() => [Artist], { name: 'artists' })
  findAll() {
    return this.artistsService.findAll();
  }

  @Query(() => Artist, { name: 'artist' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.artistsService.findOne(id);
  }

  @Mutation(() => Artist)
  updateArtist(@Args('updateArtistInput') updateArtistInput: UpdateArtistInput) {
    return this.artistsService.update(updateArtistInput.id, updateArtistInput);
  }

  @Mutation(() => Artist)
  removeArtist(@Args('id', { type: () => Int }) id: number) {
    return this.artistsService.remove(id);
  }

  @Mutation(() => Artist)
  async addSongToArtist(
    @Args('artistId', { type: () => Int }) artistId: number,
    @Args('songId', { type: () => Int }) songId: number,
  ): Promise<Artist> {
    return this.artistsService.addSongToArtist(artistId, songId);
  }
}
