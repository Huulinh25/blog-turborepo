"use server"

import { SignUpFormState } from "@/lib/types/formState";
import { SignUpFormSchema } from "../ZodSchemas/signUpFormSchema";
import { fetchGraphQL } from "../fetchGraphQL";
import { print } from "graphql";
import { CREATE_USER_MUTATION } from "../gqlQueries";
import { redirect } from "next/navigation";

export async function signUp(
  state: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  const validatedFields = SignUpFormSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      data: Object.fromEntries(formData.entries()),
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const data = await fetchGraphQL(print(CREATE_USER_MUTATION), {
    input: {
      ...validatedFields.data,
    },
  });

  if (data.errors) {
    return {
      data: Object.fromEntries(formData.entries()),
      message: "Something went wrong",
    };
  }

  redirect("/auth/signin");
}