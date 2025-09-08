import { BACKEND_URL } from "./constants";
import { getSession } from "./session";

export const fetchGraphQL = async (query: string, variables = {}) => {
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Network error: ${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    return { errors: result.errors };
  }

  return result.data;
};

export const authFetchGraphQL = async (query: string, variables = {}) => {
  const session = await getSession();
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const result = await response.json();
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error("Failed to fetch the data from GraphQL");
  }

  return result.data;
};

export const authFetchGraphQLWithFile = async (query: string, variables: any) => {
  const session = await getSession();
  
  // Tạo FormData cho file upload
  const formData = new FormData();
  
  // Thêm query và variables vào FormData
  formData.append('operations', JSON.stringify({
    query,
    variables: {
      ...variables,
      file: null, // File sẽ được map sau
    }
  }));
  
  // Map file với GraphQL variable
  const fileMap: Record<string, string[]> = {};
  Object.keys(variables).forEach((key, index) => {
    if (variables[key] instanceof File) {
      const mapKey = String(index);
      fileMap[mapKey] = [`variables.${key}`];
      formData.append(mapKey, variables[key]);
    }
  });
  
  formData.append('map', JSON.stringify(fileMap));
  
  const response = await fetch(`${BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: formData,
  });

  const result = await response.json();
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error("Failed to upload file");
  }

  return result.data;
};

// Hàm để lấy tags của người dùng
export const fetchUserTags = async (): Promise<string[]> => {
  const GET_USER_TAGS = `
    query GetUserTags {
      tags {
        id
        name
      }
    }
  `;
  const data = await authFetchGraphQL(GET_USER_TAGS);
  return data.tags.map((tag: { name: string }) => tag.name);
};