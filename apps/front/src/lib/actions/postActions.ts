"use server";

import { print } from "graphql";
import { authFetchGraphQL, fetchGraphQL, fetchUserTags } from "../fetchGraphQL";
import {
  CREATE_POST_MUTATION,
  DELETE_POST_MUTATION,
  GET_POST_BY_ID,
  GET_POSTS,
  GET_USER_POSTS,
  UPDATE_POST_MUTATION,
} from "../gqlQueries";
import { transformTakeSkip } from "../helpers";
import { Post } from "../types/modelTypes";
import { PostFormState } from "../types/formState";
import { uploadThumbnailViaAPI } from "./uploadActions";
import { PostFormSchema } from "../ZodSchemas/postFornSchema";
import { DEFAULT_PAGE_SIZE } from "../constants";

// Hàm lấy tags độc lập
export async function getUserTags() {
  try {
    const tags = await fetchUserTags();
    // console.log("User tags fetched from server action:", tags); // In ra console
    return tags;
  } catch (error) {
    console.error("Error fetching user tags in server action:", error);
    return [];
  }
}

export const fetchPosts = async ({
  page,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  page?: number;
  pageSize?: number;
} = {}): Promise<{ posts: Post[]; totalPosts: any }> => {
  const effectivePage = page || 1;
  const effectivePageSize = pageSize || 12;
  const { skip, take } = transformTakeSkip({ page: effectivePage, pageSize: effectivePageSize });
  try {
    const data = await fetchGraphQL(print(GET_POSTS), { skip, take });
    return { posts: data.posts as Post[], totalPosts: data.postCount };
  } catch (error) {
    console.error("Error fetching posts:", error);
    return { posts: [], totalPosts: 0 };
  }
};

export const fetchPostById = async (id: number) => {
  const data = await fetchGraphQL(print(GET_POST_BY_ID), { id });

  return data.getPostById as Post;
};

export async function fetchUserPosts({
  page,
  pageSize = DEFAULT_PAGE_SIZE,
}: {
  page?: number;
  pageSize: number;
}) {
  try {
    const { take, skip } = transformTakeSkip({ page, pageSize });
    const data = await authFetchGraphQL(print(GET_USER_POSTS), {
      take,
      skip,
    });

    return {
      posts: data.getUserPosts as Post[],
      totalPosts: data.userPostCount as number,
    };
  } catch (error) {
    console.error("Error fetching user posts:", error);
    return {
      posts: [],
      totalPosts: 0,
    };
  }
}

export async function saveNewPost(
  state: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const validatedFields = PostFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      data: Object.fromEntries(formData.entries()),
      errors: validatedFields.error.flatten().fieldErrors,
      ok: false,
    };
  }

  let thumbnailUrl = "";
  if (validatedFields.data.thumbnail) {
    try {
      thumbnailUrl = await uploadThumbnailViaAPI(validatedFields.data.thumbnail);
    } catch (uploadError) {
      console.error("Thumbnail upload failed:", uploadError);
      return {
        data: Object.fromEntries(formData.entries()),
        message: "Upload thumbnail failed. Please try again.",
        ok: false,
        userTags: [],
        errors: { thumbnail: ["Failed to upload thumbnail"] },
      } as unknown as PostFormState;
    }
  }

  const { postId, ...cleanData } = validatedFields.data;
  const tags = (formData.get("tags")?.toString().split(",") || [])
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  try {
    const userTags = await fetchUserTags();
    console.log("Fetched userTags from server:", userTags);
    if (!userTags || userTags.length === 0) {
      console.warn("No tags fetched from server");
    }
    const mutation = print(CREATE_POST_MUTATION);
    const variables = {
      input: {
        ...cleanData,
        thumbnail: thumbnailUrl,
        tags,
      },
    };

    const data = await authFetchGraphQL(mutation, variables);

    if (!data?.createPost) {
      return {
        data: Object.fromEntries(formData.entries()),
        message: "Failed to create post",
        ok: false,
        userTags,
      };
    }

    return {
      data: Object.fromEntries(formData.entries()),
      message: "Post created successfully",
      ok: true,
      userTags,
    };
  } catch (error) {
    console.error("Error fetching tags or creating post:", error);
    let errorMessage = "An unexpected error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return {
      data: Object.fromEntries(formData.entries()),
      message: errorMessage,
      ok: false,
      userTags: [],
    };
  }
}

export async function updatePost(
  state: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const validatedFields = PostFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      data: Object.fromEntries(formData.entries()),
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { thumbnail, ...inputs } = validatedFields.data;
  let thumbnailUrl = "";
  if (thumbnail) thumbnailUrl = await uploadThumbnailViaAPI(thumbnail);

  try {
    const userTags = await fetchUserTags();
    console.log("Fetched userTags for update:", userTags);
    const data = await authFetchGraphQL(print(UPDATE_POST_MUTATION), {
      input: {
        ...inputs,
        ...(thumbnailUrl && { thumbnail: thumbnailUrl }),
      },
    });

    if (data) {
      return {
        message: "Success! The Post Updated",
        ok: true,
        userTags,
      };
    }
    return {
      message: "Oops, Something Went Wrong",
      data: Object.fromEntries(formData.entries()),
      userTags,
    };
  } catch (error) {
    console.error("Error updating post:", error);
    return {
      message: "An unexpected error occurred",
      data: Object.fromEntries(formData.entries()),
      userTags: [],
    };
  }
}

export async function deletePost(postId: number) {
  const data = await authFetchGraphQL(print(DELETE_POST_MUTATION), {
    postId,
  });

  return data.deletePost;
}