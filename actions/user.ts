"use server";

import { currentUser } from "@clerk/nextjs/server";

export const onAuthenticatedUser = async () => {
  try {
    // check if clerk user exists
    const user = await currentUser();
    if (!user) return { status: 404 };
  } catch (error) {}
};
