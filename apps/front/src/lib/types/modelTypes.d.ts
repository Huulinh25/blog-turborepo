export type Post = {
  id: number;
  title: string;
  slug: string | null | undefined;
  author: User;
  content: string;
  thumbnail: string | null;
  published: boolean;
  authorId: number;
  tags?: Tag[];
  comments?: CommentEntity[];
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    likes: number;
    comments: number;
  };
};

export type User = {
  name: string;
  id: number;
  email: string;
  bio: string | null;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Tag = {
  id: string;
  name: string;
};

export type CommentEntity = {
  id: number;
  content: string;
  postId: number;
  post: Post;
  authorId: number;
  author: User;
  createdAt: Date;
  updatedAt: Date;
};
