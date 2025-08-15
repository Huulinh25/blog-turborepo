"use server"

import { print} from "graphql";
import { fetchGraphQL } from "../fetchGraphQL"
import { GET_POSTS } from "../gqlQueries";
import { Post } from "../types/modelTypes";
import { transformTakeSkip } from "../helpers";

export const fetchPosts = async ({
    page,
    pageSize
    }:{
        page?: number;
        pageSize?: number
    }) => {
    const {skip, take} = transformTakeSkip({page, pageSize});

    const data = await fetchGraphQL(print(GET_POSTS), {skip, take});
    // console.log({data});
    return {posts: data.posts as Post[], totalPosts: data.pageCount};
}