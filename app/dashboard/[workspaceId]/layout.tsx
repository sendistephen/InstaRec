import { onAuthenticatedUser } from "@/actions/user";
import {
  verifyAccessToWorkspace,
  getWorkspaceFolders,
} from "@/actions/workspace";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllUserVideos } from "@/background";

type Props = {
  params: { workspaceId: string };
  children: React.ReactNode;
};
const Layout = async ({ params: { workspaceId }, children }: Props) => {
  const auth = await onAuthenticatedUser();

  // redirect user to login page if they dont have a workspaceId
  if (!auth.user?.workspace) redirect("/auth/sign-in");
  if (!auth.user?.workspace.length) redirect("/auth/sign-in");

  // check if user have access to the workspace
  const hasAccess = await verifyAccessToWorkspace(workspaceId);

  if (hasAccess.status === 200) {
    return redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }

  if (!hasAccess.data?.workspace) return null;

  const query = new QueryClient();

  /**
   * NOTE:
   * prefetch:-> prefetches data from the server before the component mounts (i.e before its needed)
   */
  await query.prefetchQuery({
    queryKey: ["workspace-folders"],
    queryFn: () => getWorkspaceFolders(workspaceId),
  });

  await query.prefetchQuery({
    queryKey: ["user-videos"],
    queryFn: () => getAllUserVideos(workspaceId),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;
