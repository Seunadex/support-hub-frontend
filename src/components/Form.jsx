import { useState } from "react";
import { Upload } from "lucide-react";
import { useSnackbar } from 'notistack'
import { X } from "lucide-react";

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
  const { enqueueSnackbar } = useSnackbar();
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
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];

    files.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        enqueueSnackbar(`${file.name} is too large. Maximum size is 10MB.`, { variant: "error" });
      } else if (!allowedTypes.includes(file.type)) {
        enqueueSnackbar(`${file.name} is not a valid file type. Allowed types are: ${allowedTypes.join(", ")}`, { variant: "error" });
      } else {
        validFiles.push(file);
      }
    });

    if (selectedFiles.length + validFiles.length > 3) {
      enqueueSnackbar("You can only upload a maximum of 3 files.", { variant: "error" });
    } else {
      setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
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
            className="border border-gray-300 p-2 w-full rounded text-sm text-gray-600"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
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
            className="border border-gray-300 p-2 w-full rounded text-sm text-gray-600"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
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
          className="border border-gray-300 p-2 w-full text-sm rounded"
          placeholder="Enter ticket title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          className="border border-gray-300 p-2 w-full rounded text-sm"
          rows="4"
          placeholder="Please provide detailed information about your issue."
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Attachments</label>
        <div className="border-2 border-dashed border-gray-400 rounded-lg p-4">
          <div className="flex flex-col items-center justify-center text-gray-500">
            <Upload size={25} />
            <p className="text-sm text-muted-foreground mb-2">
              Click to select files
            </p>
            <input
              type="file"
              className="hidden"
              id="file-upload"
              multiple
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
            />
            <button
              type="button"
              className="mt-2 text-sm border border-gray-600 px-6 py-2 rounded-lg cursor-pointer"
              onClick={() => document.getElementById("file-upload").click()}
            >
              Select Files
            </button>
          </div>
          <div className="mt-2">
            {selectedFiles.length > 0 ? (
              <div className="space-y-2 mt-4">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded"
                  >
                    <span className="text-xs truncate">{file.name}</span>
                    <span className="text-xs">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:underline cursor-pointer"
                      onClick={() => removeFiles(index)}
                    >
                      <X size={16} />
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
