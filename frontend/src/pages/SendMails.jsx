import React, { useEffect, useState } from "react";
import Header from "../component";
import useStore from "../store";
import {
  getRfpsByUser,
  getVendorsByUser,
  sendMailToVendors,
} from "../utils/apiCalls";
import { toast } from "react-toastify";

export default function SendMails() {
  const { user } = useStore();
  const [queries, setQueries] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedQueryId, setSelectedQueryId] = useState("");
  const [selectedVendors, setSelectedVendors] = useState([]);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const res = await getRfpsByUser(user?.user?._id, user?.token);
        if (res?.success) setQueries(res.rfps || []);
        else console.error("Failed to fetch queries:", res);
      } catch (err) {
        console.error("Error fetching queries:", err);
      }
    };

    const fetchVendors = async () => {
      try {
        const res = await getVendorsByUser(user?.user?._id, user?.token);
        if (res?.vendors) setVendors(res.vendors);
        else console.error("Failed to fetch vendors:", res);
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };

    if (user?.user?._id && user?.token) {
      fetchQueries();
      fetchVendors();
    }
  }, [user?.user?._id, user?.token]);

  const handleVendorChange = (e) => {
    const selectedIds = Array.from(
      e.target.selectedOptions,
      (opt) => opt.value
    );
    setSelectedVendors(selectedIds);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!selectedQueryId || selectedVendors.length === 0) {
      toast.error("Please select a query and at least one vendor.");
      return;
    }

    const selectedRfp = queries.find((q) => q._id === selectedQueryId);
    const selectedVendorEmails = vendors
      .filter((v) => selectedVendors.includes(v._id))
      .map((v) => v.email);

    try {
      const res = await sendMailToVendors(
        { rfpId: selectedRfp._id, vendorEmails: selectedVendorEmails },
        user.token
      );

      if (res?.success) {
        toast.success("Emails sent successfully!");
        setSelectedQueryId("");
        setSelectedVendors([]);
      } else {
        toast.error(res?.message || "Failed to send emails.");
      }
    } catch (err) {
      console.error("Send mail error:", err);
      toast.error("Error sending emails.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-6">Send Mails</h2>
        <form
          onSubmit={handleSend}
          className="bg-white border border-black rounded-lg p-6"
        >
          <div className="mb-4">
            <label className="block text-black mb-1">Select Query</label>
            <select
              value={selectedQueryId}
              onChange={(e) => setSelectedQueryId(e.target.value)}
              className="w-full border border-black px-3 py-2 rounded focus:outline-none"
              required
            >
              <option value="" disabled>
                -- Select a Query --
              </option>
              {queries.map((query) => (
                <option key={query._id} value={query._id}>
                  {query.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-black mb-1">Select Vendors</label>
            <select
              multiple
              value={selectedVendors}
              onChange={handleVendorChange}
              className="w-full border border-black px-3 py-2 rounded focus:outline-none h-32"
              required
            >
              {vendors.map((vendor) => (
                <option key={vendor._id} value={vendor._id}>
                  {`Name: ${vendor.name} | Email: ${vendor.email}`}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-600 mt-1">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple vendors.
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded hover:bg-gray-800 transition"
          >
            Send Mail
          </button>
        </form>
      </div>
    </div>
  );
}