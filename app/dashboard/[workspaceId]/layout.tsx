import { onAuthenticatedUser } from "@/actions/user";
import { redirect } from "next/navigation";
type Props = {
  params: { workspaceId: string };
  children: React.ReactNode;
};
const Layout = async ({ params: { workspaceId }, children }: Props) => {
  const auth = await onAuthenticatedUser();

  // redirect user to login page if they dont have a workspaceId
  if (!auth.user?.workspace) redirect("/auth/sign-in");
  if (!auth.user?.workspace.length) redirect("/auth/sign-in");

  // //   have access to the workspace
  //   const hasAccess = await verifyAccessToWorkspace(workspaceId)

  return <div>{children}</div>;
};

export default Layout;
