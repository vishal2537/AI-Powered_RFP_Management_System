import React, { useState } from "react";
import useStore from "../store";

export default function Header() {
  const { user, signOut } = useStore();
  const [open, setOpen] = useState(false);
  
  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    signOut();
  };
  
  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <header className="w-full bg-black border-b border-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-bold text-xl tracking-wide">
              RFP
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            RFP Management System
          </h1>
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="px-4 py-2 rounded-lg text-white flex items-center space-x-2"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-lg">
                {user?.user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-black border border-white rounded-lg shadow-xl w-52 z-10">
              <div className="px-4 py-3 border-b border-white">
                <p className="text-sm font-semibold text-white">{user?.user?.name}</p>
                <p className="text-xs text-gray-300">{user?.user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-white hover:text-black transition-colors font-medium border-t border-white text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
