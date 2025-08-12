export interface Post {
  id: string;
  title: string;
  description: string;
  images: string[];
  tags: string[];
  authorId: string;
  author: {
    id: string;
    username: string;
    avatar?: string;
    isVerified: boolean;
  };
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}
