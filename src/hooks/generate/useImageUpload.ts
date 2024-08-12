import { useUploadImageQuery } from "@/libs/api/generate";
import { useState } from "react";

export function useImageUpload() {
  const [uploadImageRequestData, setUploadImageRequestData] = useState({
    base64: "",
    name: "",
  });

  const query = useUploadImageQuery(uploadImageRequestData);

  return {
    query,
    setUploadImageRequestData,
  };
}
