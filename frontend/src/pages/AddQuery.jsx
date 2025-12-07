import React, { useEffect, useState } from "react";
import Header from "../component";
import { addRfp, getRfpsByUser } from "../utils/apiCalls";
import useStore from "../store";

export default function AddQuery() {
  const { user } = useStore();
  const [showModal, setShowModal] = useState(false);
  const [queries, setQueries] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    originalQuery: "",
    createdBy: user?.user?._id,
  });

  useEffect(() => {
    const fetchQueries = async () => {
      const response = await getRfpsByUser(user?.user?._id, user?.token);
      if (response?.success) {
        setQueries(response.rfps || []);
      } else {
        setQueries([]);
      }
    };
    fetchQueries();
  }, [user?.user?._id, user?.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddQuery = async (e) => {
    e.preventDefault();
    const payload = {
      createdBy: user?.user?._id,
      title: formData.title,
      originalQuery: formData.originalQuery,
    };
    const response = await addRfp(payload, user?.token);
    setQueries((prev) => [...prev, response.rfp]);
    if (response?.success) {
      alert("Query added successfully!");
      setFormData({
        title: "",
        originalQuery: "",
        createdBy: user?.user?._id,
      });
      setShowModal(false);
    } else {
      alert(response?.message || "Failed to add query");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-4">Queries</h2>
        <button
          onClick={() => setShowModal(true)}
          className="mb-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Add Query
        </button>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Create Query</h3>

              <form onSubmit={handleAddQuery}>
                <div className="mb-4">
                  <label className="block text-black mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border border-black px-3 py-2 rounded"
                    placeholder="Enter query title"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-black mb-1">Description</label>
                  <textarea
                    name="originalQuery"
                    value={formData.originalQuery}
                    onChange={handleChange}
                    className="w-full border border-black px-3 py-2 rounded"
                    placeholder="Enter query description"
                    required
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
                <th className="px-4 py-2 border">Title</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Created</th>
              </tr>
            </thead>

            <tbody>
              {queries.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-gray-500 border"
                  >
                    No queries found
                  </td>
                </tr>
              ) : (
                queries.map((query, index) => (
                  <tr key={query._id} className="text-black">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{query.title}</td>
                    <td className="px-4 py-2 border">{query.originalQuery}</td>
                    <td className="px-4 py-2 border">
                      {new Date(query.createdAt).toLocaleDateString()}
                    </td>
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