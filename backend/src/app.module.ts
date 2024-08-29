import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PlaylistsModule } from './playlists/playlists.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsModule } from './songs/songs.module';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [GraphQLModule.forRoot<ApolloDriverConfig>({
    driver: ApolloDriver,
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    playground: false,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    
  }),
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: 'data/development.db',
    entities: ['dist/**/*entity{.ts,.js}'],
    synchronize: true,
  }),
  PlaylistsModule,
  SongsModule,
  ArtistsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
