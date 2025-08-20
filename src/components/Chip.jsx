import { humanize } from "@/utils/function";

const statusColors = {
  open: "bg-green-500 text-white",
  in_progress: "bg-blue-500 text-white",
  waiting_on_customer: "bg-yellow-400 text-gray-700",
  resolved: "bg-purple-500 text-white",
  closed: "bg-gray-400 text-white",
  reopened: "bg-red-500 text-white",
};

const priorityColors = {
  low: "bg-green-500 text-white",
  normal: "bg-blue-500 text-white",
  high: "bg-orange-500 text-white",
  urgent: "bg-red-600 text-white",
};

const Chip = ({ label, className = "", ...props }) => {
  return (
    <div
      aria-label={label}
      className={`text-xs font-semibold w-fit rounded-2xl px-3 py-0.5 flex items-center ${className}`}
      {...props}
    >
      {label}
    </div>
  );
};

export const NumberChip = ({label}) => {
  return <Chip label={label} className="bg-gray-200 text-gray-800" />;
};

export const StatusChip = ({ label }) => {
  const color = statusColors[label] || "bg-gray-200";
  return <Chip label={humanize(label)} className={color} />;
};

export const PriorityChip = ({ label }) => {
  const color = priorityColors[label] || "bg-gray-200";
  return <Chip label={humanize(label)} className={color} />;
};
