import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'imdb_transform' })
export class Film {
  @PrimaryColumn()
  pk_imdb: string;
  
  @Column()
  tconst: string;

  @Column()
  nconst: string;

  @Column()
  primaryname: string;

  @Column()
  category: string;

  @Column()
  genres: string;

  @Column()
  primarytitle: string;

  @Column()
  startyear: number;

  @Column()
  numvotes: number;

  @Column()
  averagerating: number;
}

@Entity({ name: 'user_rating' })
export class Cinecheck {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  userid: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userid' })
  user: User;

  @Column()
  tconst: string;

  @Column({ nullable: true })
  personalrating: number;

  @Column({ default: false })
  watched: boolean;

  @Column({ default: false })
  favorite: boolean;
}
