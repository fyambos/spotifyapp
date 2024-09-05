import { Injectable } from '@nestjs/common';
import { CreateArtistInput } from './dto/create-artist.input';
import { UpdateArtistInput } from './dto/update-artist.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { SongsService } from 'src/songs/songs.service';

@Injectable()
export class ArtistsService {
  constructor(@InjectRepository(Artist) private artistsRepository: Repository<Artist>,
  private songsService: SongsService,
) {}

  async create(createArtistInput: CreateArtistInput) : Promise<Artist>{
    const newArtist = this.artistsRepository.create(createArtistInput); //newSong = new Song();
    const savedSong = await this.artistsRepository.save(newArtist);
    return this.artistsRepository.save(newArtist) // insert
  }

  async findAll() : Promise<Artist[]> {
    return this.artistsRepository.find({relations: ['songs'] });
  }

  async findOne(id: number): Promise<Artist> {
    return this.artistsRepository.findOne({ where: { id },relations: ['songs'] });
  }

  async update(id: number, updateArtistInput: UpdateArtistInput) : Promise<Artist> {
    await this.artistsRepository.update(id, updateArtistInput);
    return this.artistsRepository.findOne({ where: { id },relations: ['songs'] });  
  }

  async remove(id: number) {
    const artist = await this.artistsRepository.findOne({ where: { id },relations: ['songs']   });
    if (!artist) {
      throw new Error('Song not found');
    }
    await this.artistsRepository.delete(id);
    return artist;
  }

  async addSongToArtist(artistId: number, songId: number): Promise<Artist> {
    const artist = await this.artistsRepository.findOne({
      where: { id: artistId },
      relations: ['songs'], 
    });
    if (!artist) {
      throw new Error('Artist not found');
    }
    if (!artist.songs) {
      artist.songs = [];
    }
    const song = await this.songsService.findOne(songId);
    if (!song) {
      throw new Error('Song not found');
    }
    if (!artist.songs.some((s) => s.id === song.id)) {
      artist.songs.push(song);
    } else {
      throw new Error('Song already in artist');
    }
    await this.artistsRepository.save(artist);
    return artist;
  }
  
}
