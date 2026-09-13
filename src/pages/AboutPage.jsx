function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-xl font-bold pb-2">About this Todo Application</h1>
      <p className="text-gray-700 leading-relaxed mb-8">
        This project demonstrates modern web development practices with task management, user authentication, and client-side routing.
        <br />
        As a user you can confidently manage and track your Todo list, navigate the application and keep your tasks organized with ease.
      </p>

      <h2 className="text-lg font-semibold pb-2">App Features</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-8">
        <li>Authentication & Security: Log in and keep your personal tasks private.</li>
        <li>Task Management: Create, edit, complete and delete tasks.</li>
        <li>Task Filtering & Tracking: Filter tasks by status and see your active and completed tasks.</li>
        <li>Easy Navigation: Move between pages and use the browser's back and forward buttons.</li>
      </ul>
      
      <h2 className="text-lg font-semibold pb-2">Technologies Used</h2>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>React 19.2.7: to create Application's UI.</li>
        <li>React Router 8.3.1: to handle page navigation and protected routes.</li>
        <li>Vite 8.1.3: to provide fast development and building the application.</li>
      </ul>
    </div>
  );
}

export default AboutPage;