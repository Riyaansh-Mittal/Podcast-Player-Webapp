import React from "react";
import { ListMusic } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 p-6 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-purple-700 p-2 rounded-md">
              <ListMusic className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">PodcastHub</h2>
          </div>
          <p className="text-gray-400 text-sm">
            Discover and enjoy the best podcasts from around the world.
          </p>
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Explore</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Trending</a></li>
            <li><a href="#" className="hover:text-white">Categories</a></li>
            <li><a href="#" className="hover:text-white">New Releases</a></li>
            <li><a href="#" className="hover:text-white">Popular</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Account</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Profile</a></li>
            <li><a href="#" className="hover:text-white">Subscriptions</a></li>
            <li><a href="#" className="hover:text-white">Settings</a></li>
            <li><a href="#" className="hover:text-white">Help</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="font-bold mb-4">Legal</h3>
          <ul className="space-y-2 text-gray-400">
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
            <li><a href="#" className="hover:text-white">GDPR</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-6 mt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} PodcastHub. All rights reserved.
      </div>
    </footer>
  );
}