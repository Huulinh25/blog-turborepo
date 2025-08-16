export type Post = {
    id: number;
    title: string;
    slug: string;
    author: User;
    content: string;
    thumbnail: string | null;
    publish: boolean;
    authorId: number;
    tags?: Tag[];
    createdAt: string;
    updatedAt: string;
}

export type User = {
    name: string;
    id: number;
    email: string;
    bio: string | null;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type Tag = {
    id: string;
    name: string;
}

export type CommentEntity = {
    id: number;
    content: string;
    post: Post;
    author: User;
    createAt: Date;
    updatedAt: Date;
}