// src/app/admin/all-posts/page.tsx
import { getSession } from "@/lib/session";
import { fetchPosts } from "@/lib/actions/postActions";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import NoPost from "./_components/NoPost";
import PostList from "./_components/PostList";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const AllPostsPage = async ({ searchParams }: Props) => {
  const session = await getSession();

  if (session?.user.roleName !== "admin") {
    return <div>Unauthorized</div>;
  }

  const { page } = await searchParams;
  const { totalPosts, posts } = await fetchPosts({
    page: page ? +page : 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  return (
    <div>
      {!posts || !posts.length ? (
        <NoPost />
      ) : (
        <PostList
          posts={posts}
          currentPage={page ? +page : 1}
          totalPages={Math.ceil(totalPosts / DEFAULT_PAGE_SIZE)}
        />
      )}
    </div>
  );
};

export default AllPostsPage;