import { Users } from '../../users/entities/user.entity';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

/*
====================================================================================================================
                                                        IMDB                                                        
====================================================================================================================
*/
@Entity({ name: 'movies' })
export class Movies {
  @PrimaryColumn()
  id: string;
  
  @Column()
  title: string;

  @Column()
  startyear: number;

  @Column()
  genres: string;

  @Column()
  rating: number;

  @Column()
  votes: number;
}

@Entity({ name: 'movie_cast' })
export class Castings {
  @PrimaryColumn()
  id: string;
  
  @Column()
  movie_id: string;

  @Column()
  person_id: number;

  @Column()
  genres: string;

  @Column()
  job: number;
}

/*
========================================================================================================================
                                                        CINECHECK                                                       
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

  @Column({ nullable: true })
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

  @Column({ nullable: true })
  personalrating: number;

  @Column({ default: false })
  favorite: boolean;
}
