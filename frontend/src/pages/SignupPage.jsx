import React, { useState } from "react";
import { emailSignUp } from "../utils/apiCalls";
import useStore from "../store";
import { saveUserInfo } from "../utils";


export default function SignupPage() {
    const { signIn, setIsLoading } = useStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await emailSignUp({ ...formData });
    setIsLoading(false);

    if (result?.success === true) {
      saveUserInfo(result, signIn);
    } else {
      console.log("Signup failed:", result);
    }
  };
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-black p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-black mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-black px-3 py-2 rounded focus:outline-none"
              placeholder="Enter name"
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
              placeholder="Enter email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-black px-3 py-2 rounded focus:outline-none"
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-black mt-4">
          Already have an account?{" "}
          <a href="/" className="underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
