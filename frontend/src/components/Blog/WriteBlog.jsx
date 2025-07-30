import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const options = {
  placeholder: "Write your blog content in markdown...",
};

export default function WriteBlog() {
  const [title, setTitle] = useState("");
  const [writerName, setWriterName] = useState("");
  const [image, setImage] = useState(null);
  const [markdownContent, setMarkdownContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Prevent duplicate submissions

  const navigate = useNavigate(); // Initialize useNavigate

  // Memoize editor options
  const editorOptions = useMemo(() => options, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting) return;

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!title || !writerName || !image || !markdownContent) {
      setError("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Convert markdown content to a Blob and append it as a file
      const markdownBlob = new Blob([markdownContent], {
        type: "text/markdown",
      });
      const formData = new FormData();
      formData.append("title", title);
      formData.append("writer_name", writerName);
      formData.append("created_at", new Date().toISOString());
      formData.append("image", image); // Backend expects "image"
      formData.append(
        "markdown",
        markdownBlob,
        `${title.replace(/\s+/g, "_")}.md`
      ); // Backend expects "markdown"

      const response = await fetch(`${API_BASE_URL}/api/blogs/file`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create blog.");
      }

      setSuccess("Blog created successfully.");
      setTimeout(() => navigate("/blog"), 1000); // Redirect to blog page after 2 seconds
    } catch (error) {
      console.error("Error creating blog:", error);
      setError(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  return (
    <div className="mx-5 md:mx-13 my-8 lg:mt-25">
      <h1 className="text-lg md:text-2xl font-bold mb-4">Write a Blog</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
          required
        />
        <input
          type="text"
          placeholder="Writer Name"
          value={writerName}
          onChange={(e) => setWriterName(e.target.value)}
          className="border border-gray-300 rounded-md p-2"
          required
        />
        <input
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={(e) => setImage(e.target.files[0])}
          className="border border-gray-300 rounded-md p-2"
          required
        />
        <SimpleMDE
          value={markdownContent}
          onChange={setMarkdownContent}
          options={editorOptions}
        />
        <button
          type="submit"
          className={`bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
