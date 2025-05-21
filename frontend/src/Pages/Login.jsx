import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserProvider } from "ethers"; // Ethers v6
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { login } from "../service/authservice";

const Login = () => {
  const [role, setRole] = useState("freelancer");
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false); // 🔒 New state
  const navigate = useNavigate();
  const { loginContext } = useAuth();

  const connectWallet = async () => {
    if (isConnecting) return; // Prevent duplicate clicks
    setIsConnecting(true);    // Mark start of process

    if (!window.ethereum) {
      setError("Metamask not found !!");
      setIsConnecting(false);
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const message = `Sign in to Web3 Freelance Platform at ${new Date().toISOString()}`;
      const signature = await signer.signMessage(message);

      const data = {
        wallet_address: address,
        signature,
        message,
        role,
      };

      const result = await login(data); // Wait for login

      if (!result.success) {
        toast.error(result.error || "Login failed");
        return;
      }

      toast.success("Login successful");
      setWalletAddress(address);

      const loginData = {
        token: result.token || "mock-token",
        user: {
          walletAddress: address,
          role,
        },
      };

      loginContext(loginData);

      if (role === "freelancer") navigate("/private/freelancer/profile");
      else navigate("/private/client/profile");

    } catch (err) {
      console.error(err);
      if (err.code === -32002) {
        toast.warn("MetaMask is already processing a request. Please check your wallet.");
      } else {
        setError("Access denied or error occurred");
      }
    } finally {
      setIsConnecting(false); // ✅ Always reset
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
          disabled={isConnecting}
          className={`w-full ${
            isConnecting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out`}
        >
          {isConnecting ? "Connecting..." : "Connect Wallet"}
        </button>

        {walletAddress && (
          <p className="mt-4 text-sm text-green-600 font-medium">
            Connected: <span className="break-all">{walletAddress}</span>
          </p>
        )}

        {error && (
          <p className="mt-4 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
