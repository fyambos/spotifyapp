import { Module } from '@nestjs/common';
import { SongsService } from './songs.service';
import { SongsResolver } from './songs.resolver';
import { Song } from './entities/song.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  providers: [SongsResolver, SongsService],
  exports: [SongsService]
})
export class SongsModule {}
