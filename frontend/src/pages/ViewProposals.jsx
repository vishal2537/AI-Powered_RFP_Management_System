import React, { useEffect, useState } from "react";
import Header from "../component";
import useStore from "../store";
import { getAllRfpVendorDetails } from "../utils/apiCalls";

export default function ViewProposals() {
  const { user, token } = useStore();

  const [queries, setQueries] = useState([]);
  const [openQuery, setOpenQuery] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [bestVendor, setBestVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user?.user?._id) return;

      const result = await getAllRfpVendorDetails(user?.user?._id, user?.token);
      console.log("result", result);
      setQueries(result?.data || []);
      setLoading(false);
    };

    load();
  }, [user, token]);

  const toggleQuery = (id) => {
    setOpenQuery(openQuery === id ? null : id);
  };

  const handleBestVendorDisplay = (vendorList) => {
    const extracted = vendorList
      .filter((v) => v.vendorResponse !== null)
      .map((v) => ({
        ...v.vendor,
        evaluationMessage: v.vendorResponse?.evaluation?.aiExplanationMessage || "",
        evaluationScore: v.vendorResponse?.evaluation?.finalScore || 0,
      }));

    if (extracted.length === 0) return;

    const best = extracted.reduce((p, c) =>
      c.evaluationScore > p.evaluationScore ? c : p
    );

    setBestVendor(best);
  };

  const closeModal = () => {
    setSelectedVendor(null);
    setBestVendor(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-6">
        <h2 className="text-2xl font-bold mb-6">View Proposals</h2>

        {queries.length === 0 ? (
          <p>No RFP or vendor proposals found.</p>
        ) : (
          <div className="space-y-4">
            {queries.map((q) => (
              <div
                key={q.rfp._id}
                className="bg-white border border-black rounded-lg"
              >
                <button
                  onClick={() => toggleQuery(q.rfp._id)}
                  className="w-full text-left px-4 py-3 font-medium text-black flex justify-between items-center border-b border-black"
                >
                  <span>{q.rfp.title}</span>
                  <span>{openQuery === q.rfp._id ? "-" : "+"}</span>
                </button>

                {openQuery === q.rfp._id && (
                  <div className="p-4 space-y-3">
                    {q.vendors.map((v, i) => {
                      const vendor = v.vendor;
                      const score =
                        v.vendorResponse?.evaluation?.finalScore ||
                        "Not evaluated";

                      return (
                        <button
                          key={i}
                          onClick={() =>
                            setSelectedVendor({
                              ...vendor,
                              evaluationScore: score,
                              evaluationMessage:
                                v.vendorResponse?.evaluation
                                  ?.aiExplanationMessage || "",
                              vendorResponseDetails:
                                v.vendorResponse?.structuredResponseData || {},
                            })
                          }
                          className="w-full text-left px-4 py-3 border border-black rounded hover:bg-black hover:text-white transition flex justify-between items-center"
                        >
                          <span>{vendor.name}</span>
                          <span className="text-sm text-gray-600 hover:text-gray-200">
                            View Details
                          </span>
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handleBestVendorDisplay(q.vendors)}
                      className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition mt-3"
                    >
                      Show Best Vendor
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-white p-6 rounded-lg w-11/12 max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">{selectedVendor.name}</h3>
            <p>
              <strong>Company:</strong> {selectedVendor.company}
            </p>
            <p>
              <strong>Email:</strong> {selectedVendor.email}
            </p>
            {!selectedVendor.vendorResponseDetails ||
              Object.keys(selectedVendor.vendorResponseDetails).length === 0 ? (
              <p className="mt-4 text-center text-red-600 font-semibold bg-red-50 p-3 rounded">
                No Response From Vendor.
              </p>) : null}
            {selectedVendor.vendorResponseDetails &&
              Object.keys(selectedVendor.vendorResponseDetails).length > 0 && (
                <div className="mt-6 p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <h4 className="font-semibold text-lg mb-4 text-black">
                    Vendor Response Details
                  </h4>

                  <div className="space-y-4">
                    {selectedVendor.vendorResponseDetails.products?.map(
                      (product, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg bg-white shadow-sm"
                        >
                          <h5 className="font-bold text-md mb-2 text-gray-800">
                            {product.name} ({product.brand})
                          </h5>

                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <p>
                              <strong>Quantity:</strong> {product.quantity}
                            </p>
                            <p>
                              <strong>Price:</strong> ₹
                              {product.price.toLocaleString()}
                            </p>
                          </div>

                          <div className="mt-2 text-sm">
                            <strong className="text-gray-700">
                              Specifications:
                            </strong>
                            <ul className="list-disc ml-5 mt-1 text-gray-600">
                              {Object.entries(product.specs || {}).map(
                                ([key, value]) => (
                                  <li key={key}>
                                    <strong>{key}:</strong> {value}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-white border rounded-lg shadow-sm">
                    <p className="text-sm text-gray-700">
                      <strong>Total Quote Value:</strong> ₹
                      {selectedVendor.vendorResponseDetails.totalQuoteValue.toLocaleString()}
                    </p>
                  </div>

                  {selectedVendor.vendorResponseDetails.message && (
                    <div className="mt-4 p-3 bg-white border rounded-lg shadow-sm">
                      <p className="text-sm text-gray-700">
                        <strong>Vendor Message:</strong>{" "}
                        {selectedVendor.vendorResponseDetails.message}
                      </p>
                    </div>
                  )}

                  {selectedVendor.evaluationMessage && (
                    <>
                      <div className="mt-4 p-3 bg-white border rounded-lg shadow-sm">
                        <p className="text-sm text-gray-700">
                          <strong>AI Score:</strong>{" "}
                          {selectedVendor.evaluationScore}
                        </p>
                      </div>

                      <div className="mt-4 p-3 bg-white border rounded-lg shadow-sm">
                        <p className="text-sm text-gray-700">
                          <strong>AI Explanation:</strong>{" "}
                          {selectedVendor.evaluationMessage}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            <button
              onClick={closeModal}
              className="w-full mt-4 bg-black text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {bestVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">
              Best Vendor: {bestVendor.name}
            </h3>

            <p>
              <strong>Company:</strong> {bestVendor.company}
            </p>
            <p>
              <strong>Email:</strong> {bestVendor.email}
            </p>
            <p>
              <strong>Best Score:</strong> {bestVendor.evaluationScore}
            </p>

            <p>
              <strong>AI Message:</strong> {bestVendor.evaluationMessage}
            </p>

            <button
              onClick={closeModal}
              className="w-full mt-4 bg-black text-white py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}