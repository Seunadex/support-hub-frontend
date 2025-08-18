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
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    const validFiles = [];
    const fileErrors = [];
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        fileErrors.push(`${file.name} is too large. Maximum size is 10MB.`);
      } else if (!allowedTypes.includes(file.type)) {
        fileErrors.push(
          `${
            file.name
          } is not a valid file type. Allowed types are: ${allowedTypes.join(
            ", "
          )}`
        );
      } else {
        validFiles.push(file);
      }
    });

    if (selectedFiles.length + validFiles.length > 3) {
      fileErrors.push("You can only upload a maximum of 3 files.");
    } else {
      setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
    }

    if (fileErrors.length > 0) {
      console.error(fileErrors.join("\n"));
    }

    e.target.value = "";
  };

  const removeFiles = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTicket({ ...formData, attachments: selectedFiles });
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Attachments</label>
        <div className="border-2 border-dashed border-border rounded-lg p-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Click to select files</p>
            <input
              type="file"
              className="hidden"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <button type="button" className="mt-2 text-sm border border-gray-600 p-2 rounded-lg" onClick={() => document.getElementById('file-upload').click()}>
              Select Files
            </button>
          </div>
          <div className="mt-2">
            {selectedFiles.length > 0 ? (
              <div className="space-y-2 mt-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded">
                    <span className="text-sm truncate">{file.name}</span>
                    <div className="text-sm">{formatFileSize(file.size)}</div>
                    <button
                      type="button"
                      className="text-red-500 hover:underline cursor-pointer"
                      onClick={() => removeFiles(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No files selected</p>
            )}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Supported formats: JPG, JPEG, PNG, PDF (max 10MB each)
        </p>
      </div>
      <div className="flex justify-end">
        {/* <button
          type="button"
          className="bg-gray-300 text-white px-4 py-2 rounded cursor-pointer mr-2"
          onClick={closeModal}
        >
          Cancel
        </button> */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded cursor-pointer"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default Form;
