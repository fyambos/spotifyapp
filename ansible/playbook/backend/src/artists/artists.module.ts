import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsResolver } from './artists.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Artist } from './entities/artist.entity';
import { SongsModule } from 'src/songs/songs.module';

@Module({
  imports: [TypeOrmModule.forFeature([Artist]), SongsModule],
  providers: [ArtistsResolver, ArtistsService],
})
export class ArtistsModule {}
