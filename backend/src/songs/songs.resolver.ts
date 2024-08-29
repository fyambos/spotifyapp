import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SongsService } from './songs.service';
import { Song } from './entities/song.entity';
import { CreateSongInput } from './dto/create-song.input';
import { UpdateSongInput } from './dto/update-song.input';

@Resolver(() => Song)
export class SongsResolver {
  constructor(private readonly songsService: SongsService) {}

  @Mutation(() => Song)
  createSong(@Args('createSongInput') createSongInput: CreateSongInput) : Promise<Song> {
    return this.songsService.createSong(createSongInput);
  }

  @Query(() => [Song], { name: 'songs' })
  findAll() {
    return this.songsService.findAll();
  }

  @Query(() => Song, { name: 'song' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.songsService.findOne(id);
  }

  @Mutation(() => Song)
  updateSong(@Args('updateSongInput') updateSongInput: UpdateSongInput) {
    return this.songsService.update(updateSongInput.id, updateSongInput);
  }

  @Mutation(() => Song)
  removeSong(@Args('id', { type: () => Int }) id: number) : Promise<Song> {
    return this.songsService.remove(id);
  }
}
