"use client";

import React, { useState, useEffect } from "react";
import { Game, TwitchItem } from "@/types/twitch";
import {
  getTopGames,
  searchGameById,
  getRecommendations,
} from "@/services/api";
import Sider from "@/components/Sider";
import CustomSearch from "@/components/CustomSearch";

export default function DashboardHomePage() {
  const [topGames, setTopGames] = useState<Game[]>([]);
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [resources, setResources] = useState<Record<string, TwitchItem[]>>({
    streams: [],
    videos: [],
    clips: [],
  });

  // Load seed data on core component initialization
  useEffect(() => {
    getTopGames()
      .then((data) => setTopGames(data))
      .catch((err) =>
        console.error("Initial taxonomy pull failed:", err.message),
      );

    getRecommendations()
      .then((data) => setResources(data))
      .catch((err) =>
        console.error("Recommendation load failed:", err.message),
      );
  }, []);

  const handleGameSelect = (gameId: string): void => {
    setActiveGameId(gameId);
    searchGameById(gameId)
      .then((data) => setResources(data))
      .catch((err) =>
        console.error("Game selection stream mapping failed:", err.message),
      );
  };

  const handleRecommendationSelect = (): void => {
    setActiveGameId(null); // Reset highlighted tabs back to recommendation mode
    getRecommendations()
      .then((data) => setResources(data))
      .catch((err) =>
        console.error("Recommendation tracking failed:", err.message),
      );
  };

  const handleSearchSuccess = (
    searchResults: Record<string, TwitchItem[]>,
  ): void => {
    setActiveGameId(null); // Clear side focus highlights since we are viewing custom text parameters
    setResources(searchResults);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0e0e10] text-[#efeff1]">
      {/* Modern Sticky Navigation Header Bar */}
      <header className="flex h-16 w-full items-center justify-between border-b border-[#1f1f23] bg-[#18181b] px-6 shadow-md z-50 select-none">
        <div className="flex items-center gap-2 font-black text-violet-500 text-lg tracking-tighter cursor-pointer">
          🔮 <span>STREAMER</span>
        </div>

        {/* Integrated Central Command Search bar */}
        <CustomSearch onSuccess={handleSearchSuccess} />

        <div className="flex items-center gap-3">
          <button className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-600/10 hover:bg-violet-700 transition duration-150 cursor-pointer">
            Sign In
          </button>
        </div>
      </header>

      {/* Workspace Environment Area */}
      <div className="flex flex-1 w-full overflow-hidden">
        {/* Dynamic Reactive Category Sider Component */}
        <Sider
          topGames={topGames}
          activeGameId={activeGameId}
          onGameSelect={handleGameSelect}
          onRecommendationSelect={handleRecommendationSelect}
        />

        {/* Core Central Display Output Viewport */}
        <main className="flex-1 h-full p-6 md:p-8 overflow-y-auto bg-[#0e0e10]">
          <div className="mb-6 select-none">
            <h2 className="text-xl font-black tracking-tight text-white">
              Live Broadcast Network
            </h2>
            <p className="text-xs font-medium text-zinc-500 mt-0.5">
              Explore active streams, curated clips, and popular videos below.
            </p>
          </div>

          {/* Temporary Data Placeholder - Upgraded next lesson into modern Tabs & Grids */}
          <div className="h-[450px] border border-dashed border-zinc-800/80 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-zinc-900/10 backdrop-blur-sm">
            <div className="text-2xl mb-2 animate-pulse">📡</div>
            <p className="text-xs font-bold text-zinc-400">
              Networking Pipelines Engaged
            </p>
            <p className="text-[10px] text-zinc-600 max-w-xs mt-1">
              Active Data Array Contains:{" "}
              {Object.values(resources).flat().length} items currently mapped to
              local page memory.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
