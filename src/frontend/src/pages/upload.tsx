import { Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Marked, Renderer } from "@ts-stack/markdown";

Marked.setOptions({
  renderer: new Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
});

const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setNewFileName(newName);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file, newFileName);

    try {
      const response = await fetch("/api/v1/uploadfile/", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={handleFileChange} />
      <input type="text" value={newFileName} onChange={handleNameChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default Upload;
