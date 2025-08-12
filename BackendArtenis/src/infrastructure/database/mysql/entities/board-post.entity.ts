import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { BoardEntity } from './board.entity';
import { PostEntity } from './post.entity';

@Entity('board_posts')
export class BoardPostEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  boardId: string;

  @Column()
  postId: string;

  @Column({ nullable: true })
  note: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relaciones
  @ManyToOne(() => BoardEntity, (board) => board.boardPosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'boardId' })
  board: BoardEntity;

  @ManyToOne(() => PostEntity, (post) => post.boardPosts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: PostEntity;
}
