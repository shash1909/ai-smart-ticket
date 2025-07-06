<h1>Smart AI Ticket System</h1>
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
  <img width="1021" alt="image" src="https://github.com/user-attachments/assets/5905ddef-dfba-4637-ba8b-d8e244e0422d" />


  <img width="1239" alt="image" src="https://github.com/user-attachments/assets/9b1932f9-6bce-416c-b358-16324c7552eb" />

</p>
<p>
  Users can sign up or log in. Verification email sent on signup via Inngest & Nodemailer.
</p>

<h3>2️⃣ Submit Ticket</h3>



<img width="1140" alt="image" src="https://github.com/user-attachments/assets/4612d18e-fc45-45e8-8b37-22a2f890aa1f" />




  User provides a title & description. AI (via Gemini) processes it to:
  <ul>
    <li>Generate enhanced problem summary</li>
    <li>Suggest skills required</li>
    <li>Set priority & assign moderator if skills match</li>
  </ul>
 <img width="864" alt="image" src="https://github.com/user-attachments/assets/2db9fa03-c4eb-4e61-b974-5ae39a6a65e4" />



<p>
</p>

<h3>3️⃣ Admin Panel</h3>
<img width="1026" alt="image" src="https://github.com/user-attachments/assets/9308bc35-3c45-466b-b048-755c0dd2e72d" />



<p>
  Admin can view all users, edit roles (user, moderator, admin), and see skills.
</p>

<h3>🛠️ Moderator Features</h3>
<img width="754" alt="image" src="https://github.com/user-attachments/assets/c9ea1c17-f265-4c00-a86b-a5a9861699ae" />

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
<img width="1078" alt="image" src="https://github.com/user-attachments/assets/d455faec-3bdf-43d5-8889-e99681fb4623" />


<hr>

<h2>📝 Future Enhancements</h2>
<ul>
  <li>AI-driven ticket similarity detection</li>
</ul>

<hr>
