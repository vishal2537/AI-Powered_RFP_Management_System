import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../component";
import useStore from "../store";
import { checkForAllRFP } from "../utils/apiCalls";

export default function Dashboard() {
    const {user} = useStore();
    const navigate = useNavigate();
    const actions = [
      { label: "Add Query", path: "/add-query" },
      { label: "Add Vendor", path: "/add-vendor" },
      { label: "Send Mails to Vendors", path: "/send-mails" },
      { label: "View Proposals", path: "/view-proposals" },
    ];

  useEffect(() => {
      async function checkForAllRFPVendorMails() {
        await checkForAllRFP({ userId: user?.user?._id }, user?.token);
      }
      checkForAllRFPVendorMails();
    }, [user?.user?._id, user?.token]);
  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-black mb-2">
            Welcome Back, {user?.user?.name} 👋
          </h2>
          <p className="text-gray-600 text-lg">
            Here's what's happening with your business today.
          </p>
        </div>

        <div className="bg-white border-2 border-black rounded-lg p-8">
          <h3 className="text-xl font-bold text-black mb-6">Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {actions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="border-2 border-black rounded-lg p-8 hover:bg-black hover:text-white transition-all duration-200 font-medium"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}