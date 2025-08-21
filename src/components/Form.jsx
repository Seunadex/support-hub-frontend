import { useId, useRef, useState, useMemo } from "react";
import { Upload, X } from "lucide-react";
import { useSnackbar } from "notistack";

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

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 3;

const Form = ({ createTicket, loading }) => {
  const { enqueueSnackbar } = useSnackbar();
  const formId = useId();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    category: "",
    priority: "",
    title: "",
    description: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const remainingSlots = useMemo(() => MAX_FILES - selectedFiles.length, [selectedFiles.length]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateAndAdd = files => {
    const incoming = Array.from(files || []);
    if (!incoming.length) return;

    const currentKeySet = new Set(
      selectedFiles.map(f => `${f.name}__${f.size}__${f.lastModified}`)
    );

    const next = [];
    for (const file of incoming) {
      const key = `${file.name}__${file.size}__${file.lastModified}`;
      if (currentKeySet.has(key)) {
        enqueueSnackbar(`${file.name} already added`, { variant: "warning" });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        enqueueSnackbar(`${file.name} is too large. Max is 10MB.`, { variant: "error" });
        continue;
      }
      if (!ACCEPTED_TYPES.includes(file.type)) {
        enqueueSnackbar(`${file.name} is not allowed. Use JPG, PNG, or PDF.`, { variant: "error" });
        continue;
      }
      next.push(file);
    }

    if (selectedFiles.length + next.length > MAX_FILES) {
      const allowed = Math.max(0, MAX_FILES - selectedFiles.length);
      if (allowed === 0) {
        enqueueSnackbar(`Limit is ${MAX_FILES} files`, { variant: "error" });
        return;
      }
      enqueueSnackbar(`Only ${allowed} more file${allowed > 1 ? "s" : ""} allowed`, { variant: "warning" });
      next.splice(allowed);
    }

    if (next.length) setSelectedFiles(prev => [...prev, ...next]);
  };

  const handleFileChange = e => {
    validateAndAdd(e.target.files);
    e.target.value = "";
  };

  const removeFileAt = index => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => setSelectedFiles([]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createTicket({ ...formData, attachments: selectedFiles });
      setFormData({ category: "", priority: "", title: "", description: "" });
      setSelectedFiles([]);
    } catch (err) {
      enqueueSnackbar("Failed to submit", { variant: "error" });
    }
  };

  const onDragOver = e => {
    e.preventDefault();
    setDragActive(true);
  };
  const onDragLeave = e => {
    e.preventDefault();
    setDragActive(false);
  };
  const onDrop = e => {
    e.preventDefault();
    setDragActive(false);
    validateAndAdd(e.dataTransfer.files);
  };

  const titleId = `${formId}-title`;
  const descId = `${formId}-desc`;
  const categoryId = `${formId}-category`;
  const priorityId = `${formId}-priority`;
  const dropId = `${formId}-drop`;
  const helpId = `${formId}-help`;

  const submitDisabled =
    loading || !formData.category || !formData.priority || !formData.title || !formData.description;

  return (
    <form onSubmit={handleSubmit} aria-describedby={helpId} noValidate>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor={categoryId}>Category</label>
          <select
            id={categoryId}
            className="border border-gray-300 p-2 w-full rounded text-sm text-gray-700"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor={priorityId}>Priority</label>
          <select
            id={priorityId}
            className="border border-gray-300 p-2 w-full rounded text-sm text-gray-700"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            required
          >
            <option value="">Select a priority</option>
            {PRIORITIES.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor={titleId}>Title</label>
        <input
          id={titleId}
          type="text"
          className="border border-gray-300 p-2 w-full text-sm rounded"
          placeholder="Enter ticket title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          minLength={3}
          maxLength={120}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor={descId}>Description</label>
        <textarea
          id={descId}
          className="border border-gray-300 p-2 w-full rounded text-sm"
          rows={4}
          placeholder="Provide details about your issue"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          minLength={10}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2" htmlFor={dropId}>Attachments</label>
        <div
          id={dropId}
          className={`border-2 border-dashed rounded-lg p-4 ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-400"
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          aria-label="File drop area"
        >
          <div className="flex flex-col items-center justify-center text-gray-600">
            <Upload size={24} />
            <p className="text-sm mb-2">Click or drop files here</p>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept={ACCEPTED_TYPES.join(",")}
              aria-describedby={helpId}
            />
            <button
              type="button"
              className="mt-2 text-sm border border-gray-600 px-4 py-1.5 rounded cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              disabled={remainingSlots <= 0}
            >
              {remainingSlots > 0 ? `Select Files (${remainingSlots} left)` : "Limit reached"}
            </button>
          </div>

          <div className="mt-3">
            {selectedFiles.length > 0 ? (
              <div className="space-y-2 mt-2">
                {selectedFiles.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-10 h-10 rounded object-cover"
                        onLoad={e => URL.revokeObjectURL(e.currentTarget.src)}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-white border flex items-center justify-center text-xs">PDF</div>
                    )}
                    <span className="text-xs truncate flex-1" title={file.name}>{file.name}</span>
                    <span className="text-xs tabular-nums">{formatFileSize(file.size)}</span>
                    <button
                      type="button"
                      className="text-red-600 p-1 cursor-pointer"
                      aria-label={`Remove ${file.name}`}
                      onClick={() => removeFileAt(index)}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button type="button" className="text-xs underline cursor-pointer" onClick={clearAll}>Remove all</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No files selected</p>
            )}
          </div>
        </div>
        <p id={helpId} className="text-xs text-gray-500 mt-1">
          JPG, JPEG, PNG, PDF. Max 10MB each. Up to {MAX_FILES} files.
        </p>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-1.5 rounded cursor-pointer disabled:opacity-60"
          disabled={submitDisabled}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

function formatFileSize(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
  const value = (bytes / Math.pow(k, i)).toFixed(2);
  return `${value} ${units[i]}`;
}

export default Form;
