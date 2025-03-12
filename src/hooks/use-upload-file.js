// src/hooks/useUploadFile.ts
import { useState } from "react";

import axios from "../utils/axios";

export function useUploadFile() {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");

  async function uploadFile(file) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post("/api/upload", formData, {
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
  }

  return { uploading, fileUrl, uploadFile };
}
