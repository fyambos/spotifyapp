import { Injectable } from '@nestjs/common';
import { CreateSongInput } from './dto/create-song.input';
import { UpdateSongInput } from './dto/update-song.input';
import { Song } from './entities/song.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SongsService {
  constructor(@InjectRepository(Song) private songsRepository: Repository<Song>,
) {}
async createSong(createSongInput: CreateSongInput): Promise<Song> {
  const newSong = this.songsRepository.create(createSongInput); //newSong = new Song();
  const savedSong = await this.songsRepository.save(newSong);
  return this.songsRepository.save(newSong) // insert
}

  async findAll(): Promise<Song[]>{
    return this.songsRepository.find({relations: ['playlists', 'artists'] });
  }

  async findOne(id: number): Promise<Song> {
    return this.songsRepository.findOne({ where: { id },relations: ['playlists', 'artists'] });
  }

  async update(id: number, updateSongInput: UpdateSongInput): Promise<Song> {
    await this.songsRepository.update(id, updateSongInput);
    return this.songsRepository.findOne({ where: { id },relations: ['playlists', 'artists'] });  // Fetch the updated entity  
  }

  async remove(id: number) {
    const song = await this.songsRepository.findOne({ where: { id },relations: ['playlists', 'artists']   });
    if (!song) {
      throw new Error('Song not found');
    }
    await this.songsRepository.delete(id);
    return song;
  }
}
