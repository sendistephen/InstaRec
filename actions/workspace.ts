"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };

    const isUserInWorkspace = await prisma?.workspace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          // if the user is directly associated with the workspace through the user relationship that matches the user's clerk id
          {
            User: {
              clerkId: user.id,
            },
          },
          //   or if the user is  a member of the workspace,where all members have a User relationship that matches the user's clerk id
          {
            members: {
              every: {
                User: {
                  clerkId: user.id,
                },
              },
            },
          },
        ],
      },
    });
    return {
      status: 200,
      data: { workspace: isUserInWorkspace },
    };
  } catch (error) {
    return { status: 403, data: { workspace: null } };
  }
};

export const getWorkSpaces = async () => {
  try {
    const user = await currentUser();

    if (!user) return { status: 404 };

    const workspaces = await prisma?.user.findMany({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            Workspace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });
    if (workspaces) {
      return {
        status: 200,
        data: { data: workspaces },
      };
    }
  } catch (error) {
    return { status: 400 };
  }
};

export const getWorkspaceFolders = async (workspaceId: string) => {
  try {
    const isFolders = await prisma.folder.findMany({
      where: {
        workspaceId: workspaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });
    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: isFolders };
    }
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 403, data: [] };
  }
};

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const videos = await prisma.video.findMany({
      where: {
        OR: [{ workspaceId: workSpaceId }, { folderId: workSpaceId }],
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        source: true,
        processing: true,
        Folder: {
          select: {
            id: true,
            name: true,
          },
        },
        User: {
          select: {
            firstname: true,
            lastname: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    if (videos && videos.length > 0) {
      return { status: 200, data: videos };
    }
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 400 };
  }
};

export const getWorkspaces = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const workspaces = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            Workspace: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });
    if (workspaces) {
      return { status: 200, data: workspaces };
    }
  } catch (error) {
    return { status: 400 };
  }
};

export const getNotifications = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 404 };

    const notifications = await prisma.user.findUnique({
      where: { clerkId: user.id },
      select: {
        notification: true,
        _count: {
          select: {
            notification: true,
          },
        },
      },
    });

    if (notifications && notifications.notification.length > 0)
      return { status: 200, data: notifications };
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 400, data: [] };
  }
};
