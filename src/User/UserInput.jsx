import React from "react";
import "./UserInput.css";

const UserInput = () => {
  return (
    <div className="wrapper">
      <h1>Contact Information</h1>
      <input type="email" placeholder="Enter Your Email" required />
      <input type="number" placeholder="Enter Your Phone Number" required />
      <input type="text" placeholder="Enter Your Address" required />

      <h2>3. Skills / Technical Info</h2>

      <label>Known Programming Languages</label>
      <select multiple>
        <option value="C">C</option>
        <option value="C++">C++</option>
        <option value="Java">Java</option>
        <option value="Python">Python</option>
        <option value="JavaScript">JavaScript</option>
      </select>

      <label>Tools / Frameworks</label>
      <select multiple>
        <option value="React">React</option>
        <option value="Node.js">Node.js</option>
        <option value="Flutter">Flutter</option>
        <option value="TensorFlow">TensorFlow</option>
        <option value="Docker">Docker</option>
      </select>

      <label>Certifications (optional)</label>
      <textarea placeholder="Mention your certifications here..."></textarea>
      <input type="file" />

      <h2>4. Placement Details (Optional if pre-placement)</h2>

      <label>Interested in Placement</label>
      <select>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <label>Preferred Domain</label>
      <select>
        <option value="Web Dev">Web Dev</option>
        <option value="AI/ML">AI/ML</option>
        <option value="Embedded">Embedded</option>
        <option value="Cybersecurity">Cybersecurity</option>
      </select>

      <label>Internship Done</label>
      <select>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>

      <label>Resume Upload</label>
      <input type="file" />
    </div>
  );
};

export default UserInput;
