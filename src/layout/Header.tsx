import React from "react";
import { Search, Bell, User, ListMusic } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-gray-900 p-4 sticky top-0 z-10 border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-purple-700 p-2 rounded-md">
            <ListMusic className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">PodcastHub</h1>
        </div>
        
        <div className="relative hidden md:block max-w-md w-full mx-4">
          <input
            type="text"
            placeholder="Search podcasts..."
            className="bg-gray-800 w-full px-4 py-2 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute right-3 top-2 w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-300 hover:text-white">
            <Bell className="w-5 h-5" />
          </button>
          <button className="p-2 bg-gray-800 rounded-full">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}