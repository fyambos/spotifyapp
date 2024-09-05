import { Injectable } from '@nestjs/common';
import { CreatePlaylistInput } from './dto/create-playlist.input';
import { UpdatePlaylistInput } from './dto/update-playlist.input';
import { Playlist } from './entities/playlist.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SongsService } from 'src/songs/songs.service';

@Injectable()
export class PlaylistsService {
  
    constructor(@InjectRepository(Playlist) private playlistsRepository: Repository<Playlist>,
    private songsService: SongsService,
    ) {}
  
  async mockService(): Promise<Playlist[]> {
    const pl = new Playlist();
    pl.id = 1;
    pl.name = "Mumbo";
    pl.spotify_id = "3j93jf4br73j39k"
    return [pl];
  }
async createPlaylist(createPlaylistInput: CreatePlaylistInput): Promise<Playlist> {
  const newPlaylist = this.playlistsRepository.create(createPlaylistInput); //newPlaylist = new Playlist();
  const savedPlaylist = await this.playlistsRepository.save(newPlaylist);
  return this.playlistsRepository.save(newPlaylist) // insert
}
async findAll(): Promise<Playlist[]> {
  return this.playlistsRepository.find({ relations: ['songs'] }); // SELECT * playlist
}
async findOne(id: number): Promise<Playlist> { 
  const playlist = await this.playlistsRepository.findOne({ where: { id },relations: ['songs'] },);
  if (!playlist) {
    throw new Error('Playlist not found');
  }
  return playlist
}

async update(id: number, updatePlaylistInput: UpdatePlaylistInput): Promise <Playlist> {
  const playlist = await this.playlistsRepository.findOne({ where: { id },relations: ['songs'] });
  if (!playlist) {
    throw new Error('Playlist not found');
  }
  await this.playlistsRepository.update(id, updatePlaylistInput);
return playlist
}

async remove(id: number): Promise<Playlist> {
  const playlist = await this.playlistsRepository.findOne({ where: { id },relations: ['songs'] });
  if (!playlist) {
    throw new Error('Playlist not found');
  }
  await this.playlistsRepository.delete(id);
  return playlist;
}

async addSongToPlaylist(playlistId: number, songId: number): Promise<Playlist> {
  const playlist = await this.playlistsRepository.findOne({
    where: { id: playlistId },
    relations: ['songs'],
  });
  if (!playlist) {
    throw new Error('Playlist not found');
  }
  if (!playlist.songs) {
    playlist.songs = [];
  }
  const song = await this.songsService.findOne(songId);
  if (!song) {
    throw new Error('Song not found');
  }
  if (!playlist.songs.some((s) => s.id === song.id)) {
    playlist.songs.push(song);
  } else {
    throw new Error('Song already in playlist');
  }
  
  await this.playlistsRepository.save(playlist);
  return playlist;
}

}
