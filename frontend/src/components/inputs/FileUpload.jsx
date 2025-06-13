import React, { useState } from "react";
import axios from "axios";
import { FileUpload as Upload } from "../../../components/ui/file-uploads";
function FileUpload({ setEndpoints }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData
      );
      setEndpoints(res.data.endpoints);
    } catch (err) {
      alert("Upload failed. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 mb-6">
      <Upload
        type="file"
        accept=".json"
        onChange={handleUpload}
        className="text-sm"
      />
      {loading && <span className="text-blue-500 text-sm">Processing...</span>}
    </div>
  );
}

export default FileUpload;
