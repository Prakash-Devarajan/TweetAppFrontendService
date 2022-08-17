import { User } from './user';

export interface Tweet {
  tweetId: string;
  tweetMsg:string;
  postTime: string;
  likes: number;
  user: User;
  replies: Tweet[];
  tweetTag: string;
}