import { useState } from "react";

import axios from "../utils/axios";

interface UploadResponse {
  url: string;
}

interface UseUploadFileReturn {
  uploading: boolean;
  fileUrl: string;
  uploadFile: (file: File) => Promise<string>;
}

export function useUploadFile(): UseUploadFileReturn {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  async function uploadFile(file: File): Promise<string> {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post<UploadResponse>("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (!res) {
        setUploading(false);
        throw new Error("Ошибка загрузки файла");
      }
      const { data } = res;
      setUploading(false);
      setFileUrl(data.url);
      return data.url;
    } catch (error) {
      setUploading(false);
      throw error;
    }
  }

  return { uploading, fileUrl, uploadFile };
}
