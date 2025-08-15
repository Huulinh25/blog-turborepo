"use server"

import { print} from "graphql";
import { fetchGraphQL } from "../fetchGraphQL"
import { GET_POSTS } from "../gqlQueries";
import { Post } from "../types/modelTypes";

export const fetchPosts = async () => {
    const data = await fetchGraphQL(print(GET_POSTS));
    // console.log({data});
    return data.posts as Post[];
}