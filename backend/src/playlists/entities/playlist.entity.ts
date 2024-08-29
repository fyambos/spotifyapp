import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Song } from 'src/songs/entities/song.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Playlist {
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column()
  @Field({ description: 'playlist name' })
  name: String;

  @Column()
  @Field()
  spotify_id: String;

  @ManyToMany(() => Song, song => song.playlists, { cascade: true })  // Define the many-to-many relationship
  @JoinTable()  // Specify that this side owns the relationship and will have the join table
  @Field(() => [Song], {nullable: true})  // Make sure to expose this field to GraphQL
  songs?: Song[];
}

  