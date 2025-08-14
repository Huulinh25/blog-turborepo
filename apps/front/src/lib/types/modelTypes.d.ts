export type Post = {
    id: number;
    title: string;
    slug: string;
    author: string;
    content: string;
    thumbnail: string;
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
    updatedAt: string;
}

export type Tag = {
    id: string;
    name: string;
}

export type CommentModel = {
    id: number;
    content: string;
    post: Post;
    author: User;
    createAt: Date;
    updatedAt: Date;
}