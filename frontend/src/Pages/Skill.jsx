import React, { useState } from "react";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleAddSkill = () => {
    setShowForm(true);
  };

  const handleSaveSkill = () => {
    if (newSkill.trim() === "") return;

    const updatedSkills = [...skills, newSkill.trim()];
    setSkills(updatedSkills);
    setNewSkill("");
    setShowForm(false);

    // For now, just log to console
    console.log("Skills saved:", updatedSkills);
  };

  return (
    <div style={{ paddingTop: "64px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 className="text-xl font-bold mb-4">Skills</h2>

      <ul className="mb-4">
        {skills.length === 0 ? (
          <li>No skills added yet.</li>
        ) : (
          skills.map((skill, index) => <li key={index}>{skill}</li>)
        )}
      </ul>

      {showForm ? (
        <div className="mb-4">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Enter skill"
            className="border px-2 py-1 rounded w-full"
          />
          <button
            onClick={handleSaveSkill}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Skill
          </button>
        </div>
      ) : (
        <button
          onClick={handleAddSkill}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Skill
        </button>
      )}
    </div>
  );
};

export default Skills;
