import React, { useState, useEffect } from "react";
import Header from "../component";
import { addVendor, getVendorsByUser } from "../utils/apiCalls";
import useStore from "../store";

export default function AddVendor() {
  const [showModal, setShowModal] = useState(false);
  const [vendors, setVendors] = useState([]);
  const { user } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    createdBy: user?.user?._id,
  });

  useEffect(() => {
    async function fetchVendors() {
      const response = await getVendorsByUser(user?.user?._id, user?.token);

      if (response?.vendors) {
        setVendors(response.vendors);
      }
    }
    fetchVendors();
  }, [user?.user?._id, user?.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddVendor = async (e) => {
    e.preventDefault();
    const response = await addVendor(formData,user?.token);

    if (response?.vendor) {
      alert("Vendor added successfully!");
      setVendors((prev) => [...prev, response.vendor]);
      setFormData({
        name: "",
        email: "",
        company: "",
        createdBy: user?.user?._id,
      });
      setShowModal(false);
    } else {
      alert(response?.message || "Failed to add vendor");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">Vendors</h2>
        <button
          onClick={() => setShowModal(true)}
          className="mb-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Add Vendor
        </button>
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Add Vendor</h3>

              <form onSubmit={handleAddVendor}>
                <div className="mb-4">
                  <label className="block text-black mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-black px-3 py-2 rounded focus:outline-none"
                    placeholder="Enter vendor name"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-black mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-black px-3 py-2 rounded focus:outline-none"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-black mb-1">Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full border border-black px-3 py-2 rounded focus:outline-none"
                    placeholder="Enter company"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-black rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white border border-black rounded-lg overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-2 border">S.No.</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Company</th>
              </tr>
            </thead>

            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="text-center py-4 text-gray-500 border"
                  >
                    No vendors found
                  </td>
                </tr>
              ) : (
                vendors.map((vendor, index) => (
                  <tr key={vendor._id} className="text-black">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{vendor.name}</td>
                    <td className="px-4 py-2 border">{vendor.email}</td>
                    <td className="px-4 py-2 border">{vendor.company}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}