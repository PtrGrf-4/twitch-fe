"use client";

import React, { useState } from "react";
import { searchGameByName } from "@/services/api";
import { TwitchItem } from "@/types/twitch";

interface CustomSearchProps {
  onSuccess: (data: Record<string, TwitchItem[]>) => void;
}

export default function CustomSearch({ onSuccess }: CustomSearchProps) {
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearchSubmit = (e: React.FormEvent): void => {
    e.preventDefault();

    // 1. 增加空输入和纯空格提示
    if (query.trim() === "") {
      alert("Please enter a valid category name.");
      return;
    }

    setIsLoading(true);

    searchGameByName(query)
      .then((data) => {
        // 2. 判断是否真的搜到了内容，避免用户以为“没反应”
        const totalItems = Object.values(data).flat().length;
        if (totalItems === 0) {
          alert(`No results found for "${query}". Please try another keyword.`);
        } else {
          onSuccess(data);
          setQuery(""); // 成功拉取数据后才清空输入框
        }
      })
      .catch((err) => {
        console.error("Search query dropped:", err.message);
        alert(`Could not find records for category: "${query}"`);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="relative w-full max-w-sm md:max-w-md"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={
          isLoading
            ? "Searching Cloud Database..."
            : "🔍 Search platform categories..."
        }
        disabled={isLoading}
        className="w-full bg-[#2f2f35]/50 border border-zinc-800/80 rounded-xl pl-4 pr-16 py-2 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:bg-[#0e0e10] transition-all duration-200 disabled:opacity-60"
      />

      {/* 3. 加载中的状态提示（动态小图标） */}
      {isLoading && (
        <span className="absolute right-3 top-2.5 text-xs text-violet-500 animate-pulse">
          ⏳
        </span>
      )}

      {/* 清除按钮（只有在有内容且不在加载中时才显示） */}
      {query && !isLoading && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute right-3 top-2.5 text-[10px] text-zinc-500 hover:text-white transition duration-150 cursor-pointer"
        >
          ✕
        </button>
      )}
    </form>
  );
}
