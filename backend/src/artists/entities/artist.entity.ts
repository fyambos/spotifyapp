import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Song } from 'src/songs/entities/song.entity';
import { Entity,PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

@Entity()
@ObjectType()
export class Artist {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: 'Example field (placeholder)' })
  id: number;
  @Column()
  @Field()
  name: string;
  @ManyToMany(() => Song, song => song.artists, { cascade: true }) 
  @JoinTable() 
  @Field(() => [Song], {nullable: true}) 
  songs?: Song[];

}
