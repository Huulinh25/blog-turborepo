"use client";
import { getPostComments } from "@/lib/actions/commentActions";
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { CommentEntity } from "@/lib/types/modelTypes";
import { useState } from "react";
import CommentCard from "./commentCard";
import CommentPagination from "./commentPagination";

type Props = {
  postId: number;
  take?: number;
  skip?: number;
  totalComments?: number;
  comments?: CommentEntity[];
};

const Comments = ({ postId }: Props) => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ["GET_POST_COMMENTS", postId, page],
    queryFn: async () =>
      await getPostComments({
        postId,
        skip: (page - 1) * DEFAULT_PAGE_SIZE,
        take: DEFAULT_PAGE_SIZE,
      }),
  });

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

    
  const totalPages = Math.ceil((data?.count ?? 0) / DEFAULT_PAGE_SIZE);
  return (
    <div className="p-2 rounded-md shadow-md">
      <h6 className="text-lg text-slate-700">Comments</h6>
      <div className="flex flex-col gap-4">
        {data?.comments?.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
      <CommentPagination
        className="p-2"
        currentPage={page}
        setCurrentPage={(p) => setPage(p)}
        totalPages={totalPages}
      >

      </CommentPagination>
    </div>
  );
};

export default Comments;