import { Users } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

/*
====================================================================================================================
                                                 IMDB DB
====================================================================================================================
*/
@Entity({ name: 'movies' })
export class Movies {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  year: number;

  @Column({ nullable: true })
  genres: string;

  @Column({ type: 'float', nullable: true })
  rating: number;

  @Column({ nullable: true })
  votes: number;
}

@Entity({ name: 'movie_cast' })
export class Castings {
  @PrimaryColumn()
  id: string;

  @Column()
  movie_id: string;

  @Column()
  person_id: string; 

  @Column()
  job: string; 
}

/*
========================================================================================================================
                                               CINECHECK DB
========================================================================================================================
*/
@Entity({ name: 'user_rating' })
export class UserRatings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userid: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userid' })
  user: Users;

  @Column()
  tconst: string;

  @Column({ type: 'float', nullable: true })
  personalrating: number;

  @Column({ default: false })
  watched: boolean;

  @Column({ default: false })
  favorite: boolean;
}

@Entity({ name: 'user_person_rating' })
export class UserPersonRatings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userid: number;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userid' })
  user: Users;

  @Column()
  nconst: string;

  @Column({ type: 'float', nullable: true })
  personalrating: number;

  @Column({ default: false })
  favorite: boolean;
}