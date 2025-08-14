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