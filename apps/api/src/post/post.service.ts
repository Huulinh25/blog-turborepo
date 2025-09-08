import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreatePostInput } from './dto/create-post.input';
import { UpdatePostInput } from './dto/update-post.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { DEFAULT_PAGE_SIZE } from 'src/constants';

@Injectable()
export class PostService {
  constructor(private prisma:PrismaService) {}
  async findAll({
    skip = 0,
    take = DEFAULT_PAGE_SIZE
  }: {
    skip?: number;
    take?: number;
  }) {
    return await this.prisma.post.findMany({
      skip,
      take,
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  }

  async count() {
    return await this.prisma.post.count();
  }

  async findOne(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        tags: true,
      }
    });
  }

  async findByUser({
    userId,
    skip,
    take,
  }: {
    userId: number;
    skip: number;
    take: number;
  }) {
    return await this.prisma.post.findMany({
      where: {
        author: {
          id: userId,
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        published: true,
        slug: true,
        title: true,
        thumbnail: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      take,
      skip,
    });
  }

  async userPostCount(userId: number) {
    return this.prisma.post.count({
      where: {
        authorId: userId,
      },
    });
  }

  async create({
    createPostInput,
    authorId,
  }: {
    createPostInput: CreatePostInput;
    authorId: number;
  }) {
    const cleanedTags = (createPostInput.tags || [])
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    return await this.prisma.post.create({
      data: {
        ...createPostInput,
        author: {
          connect: {
            id: authorId,
          },
        },
        tags: {
          connectOrCreate: cleanedTags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });
  }

  async update({
    userId,
    updatePostInput,
  }: {
    userId: number;
    updatePostInput: UpdatePostInput;
  }) {
    const authorIdMatched = await this.prisma.post.findUnique({
      where: { id: updatePostInput.postId, authorId: userId },
    });
  
    if (!authorIdMatched) throw new UnauthorizedException();
  
    const { postId, tags, ...data } = updatePostInput;
    const cleanedTags = (tags ?? [])
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
  
    return await this.prisma.post.update({
      where: { id: postId },
      data: {
        ...data,
        tags: {
          set: [],
          connectOrCreate: cleanedTags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });
  }
  
  async delete({ postId, userId }: { postId: number; userId: number }) {
    const authorIdMatched = await this.prisma.post.findUnique({
      where: { id: postId, authorId: userId },
    });

    if (!authorIdMatched) throw new UnauthorizedException();

    await this.prisma.$transaction(async (tx) => {
      // Disconnect all tags from the post (many-to-many join table)
      await tx.post.update({
        where: { id: postId },
        data: {
          tags: { set: [] },
        },
      });

      // Delete dependent likes and comments
      await tx.like.deleteMany({ where: { postId } });
      await tx.comment.deleteMany({ where: { postId } });

      // Finally delete the post
      await tx.post.delete({
        where: { id: postId, authorId: userId },
      });

      // Clean up orphan tags (tags not linked to any posts)
      await tx.tag.deleteMany({
        where: {
          posts: {
            none: {},
          },
        },
      });
    });

    return true;
  }

  async getAllTags(userId: number) {
    return await this.prisma.tag.findMany({
      where: {
        posts: {
          some: {
            authorId: userId,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
