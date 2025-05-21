import React, { useState } from "react";

const Skills = () => {
  const [skills, setSkills] = useState([]);
  const predefinedSkills = ["JavaScript", "React", "Node.js", "Python", "Java", "HTML", "CSS", "MongoDB"];

  const handleAddSkill = (skill) => {
    if (!skills.includes(skill)) {
      const updatedSkills = [...skills, skill];
      setSkills(updatedSkills);
      console.log("Skills saved:", updatedSkills);
    }
  };

  return (
    <div style={{ paddingTop: "64px", maxWidth: "600px", margin: "0 auto" }}>
      <h2 className="text-xl font-bold mb-4">Select Your Skills</h2>

      <div className="mb-4 flex flex-wrap gap-3">
        {predefinedSkills.map((skill, index) => (
          <button
            key={index}
            onClick={() => handleAddSkill(skill)}
            className={`px-4 py-2 rounded-full text-white shadow transition ${
              skills.includes(skill)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={skills.includes(skill)}
          >
            {skill}
          </button>
        ))}
      </div>

      <h3 className="text-lg font-semibold mb-2">Your Skills:</h3>
      <ul className="list-disc list-inside">
        {skills.length === 0 ? (
          <li>No skills selected yet.</li>
        ) : (
          skills.map((skill, index) => <li key={index}>{skill}</li>)
        )}
      </ul>
    </div>
  );
};

export default Skills;
