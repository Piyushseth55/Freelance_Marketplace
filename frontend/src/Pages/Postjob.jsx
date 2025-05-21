import React, { useState } from "react";
import { toast } from "react-toastify";

const PostJob = () => {
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    skills: "",
    experience: "",
    jobType: "Freelance", // Fixed to Freelance
  });

  const handleChange = (e) => {
    setJobData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedData = {
      ...jobData,
      skills: jobData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),
    };
    
    toast.success("Job Posted Succesfully");
    console.log("Job Submitted:", formattedData);
    
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Post a Freelance Job</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={jobData.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={jobData.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={jobData.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="salary"
          placeholder="Salary (e.g., ₹50,000/project)"
          value={jobData.salary}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="skills"
          placeholder="Required Skills (comma separated)"
          value={jobData.skills}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="experience"
          placeholder="Experience Required (e.g., 2+ years)"
          value={jobData.experience}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Submit Job
        </button>
      </form>
    </div>
  );
};

export default PostJob;
