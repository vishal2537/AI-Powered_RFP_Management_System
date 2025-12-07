import React, { useState } from "react";
import useStore from "../store";
import { emailLogin } from "../utils/apiCalls";
import { saveUserInfo } from "../utils";

export default function LoginPage() {
   const { signIn, setIsLoading } = useStore();

  const [formData, setFormData] = useState({
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
    const result = await emailLogin(formData);
    setIsLoading(true);
    if (result?.success === true) {
      saveUserInfo(result, signIn);
    } else {
      console.log("Login failed:", result);
    }
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-black p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-black mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>

        <p className="text-center text-black mt-4">
          Don’t have an account?{" "}
          <a href="/sign-up" className="underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
