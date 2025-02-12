"use client";

import { useState } from "react";
import { Header } from "../components/Header";
import { DriveContent } from "../components/DriveContent";
import type { DriveItem } from "../types/drive";
import { Toaster } from "sonner";

export default function Home() {
  const [layout, setLayout] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<DriveItem[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: DriveItem = {
      id: Date.now().toString(),
      name,
      modifiedAt: new Date().toISOString(),
      parent: null,
      visibility: "private",
    };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    setItems([...items, newFolder]);
  };

  const handleUpload = () => {
    // Implement file upload functionality
    console.log("File upload not implemented yet");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Toaster />
      <Header
        layout={layout}
        onLayoutChange={setLayout}
        onSearch={handleSearch}
        onCreateFolder={handleCreateFolder}
        onUpload={handleUpload}
      />
      <main className="container mx-auto mt-8">
        <DriveContent layout={layout} searchQuery={searchQuery} />
      </main>
    </div>
  );
}
