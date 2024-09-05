import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Artist } from 'src/artists/entities/artist.entity';
import { Playlist } from 'src/playlists/entities/playlist.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Song {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;
  @Column()
  @Field()
  spotify_id: string;
  @Column()
  @Field()
  name: string;
  @ManyToMany(() => Playlist, playlist => playlist.songs)
  @Field(() => [Playlist], { nullable: true }) 
  playlists?: Playlist[];
  @ManyToMany(() => Artist, artist => artist.songs)
  @Field(() => [Artist], { nullable: true }) 
  artists?: Artist[];
}
