import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getProfileByWallet, updateClientProfile, updateFreelancerProfile } from "../service/profileService";
import { toast } from "react-toastify";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (user?.walletAddress) {
      getProfileByWallet(user.walletAddress, user.role)
        .then((res) => {
          if (res.success && res.profile) {
            setProfile(res.profile);
          }
        }) 
        .catch((err) => {
          console.error("Error fetching profile", err);
        });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { wallet_address: user.walletAddress, role: user.role, ...formData };

    const updateFn = user.role === "client" ? updateClientProfile : updateFreelancerProfile;

    updateFn(payload)
      .then((res) => {
        if (res.success) {
          setProfile({ ...formData });
          setEditing(false);
          toast.success("Profile updated successfully");
        }
      })
      .catch((err) => {
        console.error("Error updating profile", err);
      });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 capitalize">{user.role} Profile</h2>

      {profile ? (
        <div>
          {user.role === "client" ? (
            <>
              <p className="mb-2"><span className="font-semibold">Name:</span> {profile.name}</p>
              <p className="mb-2"><span className="font-semibold">Email:</span> {profile.email}</p>
              <p className="mb-2"><span className="font-semibold">Contact:</span> {profile.contact}</p>
              <p className="mb-2"><span className="font-semibold">Company:</span> {profile.company}</p>
              <p className="mb-2"><span className="font-semibold">Post:</span> {profile.post}</p>
            </>
          ) : (
            <>
              <p className="mb-2"><span className="font-semibold">Name:</span> {profile.name}</p>
              <p className="mb-2"><span className="font-semibold">Email:</span> {profile.email}</p>
              <p className="mb-2"><span className="font-semibold">Contact:</span> {profile.contact}</p>
              <p className="mb-2"><span className="font-semibold">Objective:</span> {profile.objective}</p>
            </>
          )}

          <button
            onClick={() => {
              setFormData(profile);
              setEditing(true);
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4 text-gray-700">No profile found.</p>
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Profile
          </button>
        </div>
      )}

      {editing && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            name="name"
            placeholder="Name"
            value={formData.name || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          <input
            name="contact"
            placeholder="Contact"
            value={formData.contact || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          {user.role === "client" ? (
            <>
              <input
                name="company"
                placeholder="Company"
                value={formData.company || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                name="post"
                placeholder="Post"
                value={formData.post || ""}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
            </>
          ) : (
            <input
              name="objective"
              placeholder="Objective"
              value={formData.objective || ""}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Save
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
