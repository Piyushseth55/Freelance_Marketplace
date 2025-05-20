import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider } from "ethers"; // Ethers v6

import { useAuth } from "../context/AuthContext"; // your auth context

const Login = () => {
  const [role, setRole] = useState("freelancer");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { loginContext } = useAuth(); // 👈 context function

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const address = accounts[0];
        setWalletAddress(address);

        const loginData = {
          token: "mock-token", // or any dummy token for now
          user: {
            walletAddress: address,
            role: role,
          },
        };

        // Save to context and localStorage
        loginContext(loginData);

        // Navigate based on role
        if (role === "freelancer") navigate("/private/freelancer/profile");
        else navigate("/private/client/profile");
      } catch (err) {
        setError("Access denied or error occurred");
        console.error(err);
      }
    } else {
      setError("MetaMask not found");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
        <img
          src="https://freelogopng.com/images/all_img/1683021055metamask-icon.png"
          alt="MetaMask"
          className="h-16 mx-auto mb-6"
        />
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-gray-500 mb-6">
          Login securely with MetaMask and choose your role
        </p>

        <div className="mb-6">
          <label className="block text-sm text-left text-gray-700 font-medium mb-2">
            Select Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
          </select>
        </div>

        <button
          onClick={connectWallet}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
        >
          Connect Wallet
        </button>

        {walletAddress && (
          <p className="mt-4 text-sm text-green-600 font-medium">
            Connected: <span className="break-all">{walletAddress}</span>
          </p>
        )}
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
