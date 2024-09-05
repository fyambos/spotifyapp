import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PlaylistsService } from './playlists.service';
import { Playlist } from './entities/playlist.entity';
import { CreatePlaylistInput } from './dto/create-playlist.input';
import { UpdatePlaylistInput } from './dto/update-playlist.input';

@Resolver(of => Playlist)
export class PlaylistsResolver {
  constructor(private playlistsService: PlaylistsService) {}
  
  @Query((returns) => Playlist)
  mockResolver(){
    return {"id":1, "name": "playlist1", "spotify_id": "1"}
  }

  @Query(returns => [Playlist])
    playlists(): Promise<Playlist[]> {
      return this.playlistsService.findAll();
    }

  @Mutation(returns => Playlist)
  createPlaylist(@Args('createPlaylistInput') createPlaylistInput: CreatePlaylistInput) : Promise<Playlist>{
    return this.playlistsService.createPlaylist(createPlaylistInput);
  }

  @Query(() => [Playlist], { name: 'playlists' })
  findAll() {
    return this.playlistsService.findAll();
  }

  @Query(() => Playlist, { name: 'playlist' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.playlistsService.findOne(id);
  }

  @Mutation(() => Playlist)
  updatePlaylist(@Args('updatePlaylistInput') updatePlaylistInput: UpdatePlaylistInput) {
    return this.playlistsService.update(updatePlaylistInput.id, updatePlaylistInput);
  }

  @Mutation(() => Playlist)
  async removePlaylist(@Args('id', { type: () => Int }) id: number): Promise<Playlist> {
    return this.playlistsService.remove(id);
  }
  @Mutation(() => Playlist)
  async addSongToPlaylist(
    @Args('playlistId', { type: () => Int }) playlistId: number,
    @Args('songId', { type: () => Int }) songId: number,
  ): Promise<Playlist> {
    return this.playlistsService.addSongToPlaylist(playlistId, songId);
  }
}
