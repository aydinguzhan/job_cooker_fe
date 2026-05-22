import { userInfo } from "../lib/auth";
import apiClient from "../lib/axios";

const API_URL = import.meta.env.VITE_API_URL;

type UploadProfileImageResponse = {
  fileId: string;
  url: string;
};

export async function uploadProfileImage(
  file: File,
): Promise<UploadProfileImageResponse> {
  const formData = new FormData();
  formData.append("image", file);

  const currentUser = userInfo();

  if (!currentUser?.userId) {
    throw new Error("User information not found");
  }

  const response = await apiClient.post(`/files/profile/${currentUser.userId}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const data = response.data?.data ?? response.data;

  const fileId = data.fileId ?? data.file_id ?? data.id;

  if (!fileId) {
    throw new Error("File id not found in upload response");
  }

  return {
    fileId,
    url: getFileUrl(fileId),
  };
}

export function getFileUrl(fileId?: string | null) {
  if (!fileId) return "";

  return `${API_URL}/files/${fileId}`;
}
export function resolveFileUrl(path?: string | null) {
  if (!path) return "";

  if (
    path.startsWith("http") ||
    path.startsWith("blob:") ||
    path.startsWith("data:")
  ) {
    return path;
  }

  return `${API_URL}${path}`;
}
