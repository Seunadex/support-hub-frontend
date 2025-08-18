import { useState } from "react";

const CATEGORIES = [
  { value: "technical_issues", label: "Technical" },
  { value: "billing", label: "Billing" },
  { value: "account", label: "Account" },
  { value: "feature_request", label: "Feature Request" },
  { value: "feedback", label: "Feedback" },
  { value: "other", label: "Other" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const Form = ({ createTicket, loading, error }) => {
  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTicket(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            className="border border-gray-300 p-2 w-full rounded"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Priority</label>
          <select
            className="border border-gray-300 p-2 w-full rounded"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="">Select a priority</option>
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Title</label>
        <input
          type="text"
          className="border border-gray-300 p-2 w-full rounded"
          placeholder="Enter ticket title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          className="border border-gray-300 p-2 w-full rounded"
          rows="4"
          placeholder="Enter ticket description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default Form;
