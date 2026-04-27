import { convexAuth, getAuthUserId } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

export const { auth, signIn, signOut, isAuthenticated } = convexAuth({
  providers: [Password],
});

export { getAuthUserId };
