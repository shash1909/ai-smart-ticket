<h1>🚀 Smart AI Ticketing System</h1>

<p>
  A modern <strong>AI-powered ticket management system</strong> built with the MERN stack (MongoDB, Express, React, Node.js),
  enhanced by <strong>Gemini API</strong> for AI insights, <strong>Inngest</strong> for workflows, and <strong>Mailtrap</strong> for transactional emails.
</p>

<hr>

<h2>🎯 Features</h2>
<ul>
  <li>📝 User authentication (signup, login) with JWT</li>
  <li>📮 Email verification & notifications using <code>Inngest</code> + <code>nodemailer</code></li>
  <li>🎫 Submit tickets with title & description</li>
  <li>🤖 AI auto-generates metadata: enhanced descriptions, suggested skills, complexity, estimated resolution time</li>
  <li>⚙️ AI auto-assigns tickets to moderators based on skills</li>
  <li>🏷️ Priority auto-set by AI (or manually by admin)</li>
  <li>🧑‍💻 Admin panel to manage users (change role: user, moderator, admin)</li>
  <li>🗃️ Moderators & admins can also submit tickets like users</li>
  <li>🌍 Publicly viewable list of all tickets (non-auth users)</li>
</ul>

<hr>

<h2>⚙️ Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React, Vite, Tailwind CSS</li>
  <li><strong>Backend:</strong> Node.js, Express</li>
  <li><strong>Database:</strong> MongoDB (Mongoose)</li>
  <li><strong>AI:</strong> Gemini API (Google)</li>
  <li><strong>Event orchestration:</strong> Inngest (send verification + ticket emails)</li>
  <li><strong>Email:</strong> Nodemailer + Mailtrap sandbox</li>
  <li><strong>JWT:</strong> For authentication</li>
</ul>

<hr>

<h2>🖼️ Screenshots & Flow</h2>

<h3>1️⃣ Login and Signup Page</h3>
<p>
  <img width="1415" alt="image" src="https://github.com/user-attachments/assets/e0639c73-b4b5-4e6d-926c-3e1e794ae37a" />


  <img width="1438" alt="image" src="https://github.com/user-attachments/assets/b02daf3a-d674-4c77-acb1-34807d8ac81e" />

</p>
<p>
  Users can sign up or log in. Verification email sent on signup via Inngest & Nodemailer.
</p>

<h3>2️⃣ Submit Ticket</h3>


<img width="1435" alt="image" src="https://github.com/user-attachments/assets/fbc8557f-4c16-450f-9e63-23180b8f80ce" />



  User provides a title & description. AI (via Gemini) processes it to:
  <ul>
    <li>Generate enhanced problem summary</li>
    <li>Suggest skills required</li>
    <li>Set priority & assign moderator if skills match</li>
  </ul>
 <img width="1191" alt="image" src="https://github.com/user-attachments/assets/71cb800e-7867-4004-ab84-a6abe1b65a9b" />


<p>
</p>

<h3>3️⃣ Admin Panel</h3>
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/09abe847-5992-4d50-bad6-271bb298e970" />


<p>
  Admin can view all users, edit roles (user, moderator, admin), and see skills.
</p>

<h3>🛠️ Moderator Features</h3>
<img width="1044" alt="image" src="https://github.com/user-attachments/assets/e83def74-0ce2-45f5-8573-52fadd352ab9" />
<ul>
  <li>Moderators can view all tickets assigned to them.</li>
  <li>They can update the ticket <strong>status</strong> to:
    <ul>
      <li><code>in-progress</code>: when they start working on it</li>
      <li><code>resolved</code>: when the issue is fixed</li>
      <li><code>closed</code>: when the ticket is officially closed after verification</li>
    </ul>
  </li>
  <li>Helps maintain a smooth workflow and clear communication with users.</li>
</ul>

<h3>4️⃣ All Tickets View</h3>
<p>Non logged (not authenticated) in user can also see others' tickets, but cannot create their own.</p>
<img width="1436" alt="image" src="https://github.com/user-attachments/assets/81a6f208-e2e5-4b3a-b970-7db453c7c985" />

<hr>

<h2>📝 Future Enhancements</h2>
<ul>
  <li>AI-driven ticket similarity detection</li>
</ul>

<hr>
