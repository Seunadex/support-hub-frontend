import { humanize } from "@/utils/function"

const Chip = ({ label, style }) => {
  return (
    <div className={`text-xs font-semibold w-fit rounded-2xl px-3 py-0.5 flex items-center ${style}`}>
      {label}
    </div>
  );
};

export const NumberChip = ({label}) => {
  return <Chip label={label} style="bg-gray-200 text-gray-800" />;
};

export const StatusChip = ({label}) => {
  let color;
  switch (label) {
    case "open":
      color = "bg-green-500 text-white";
      break;
    case "in_progress":
      color = "bg-blue-500 text-white";
      break;
    case "waiting_on_customer":
      color = "bg-yellow-400 text-gray-700";
      break;
    case "resolved":
      color = "bg-purple-500 text-white";
      break;
    case "closed":
      color = "bg-gray-400 text-white";
      break;
    case "reopened":
      color = "bg-red-500 text-white";
      break;
    default:
      color = "bg-gray-200";
  }
  return <Chip label={humanize(label)} style={color} />;
};

export const PriorityChip = ({label}) => {
  let color;
  switch (label) {
    case "low":
      color = "bg-green-500 text-white";
      break;
    case "normal":
      color = "bg-blue-500 text-white";
      break;
    case "high":
      color = "bg-orange-500 text-white";
      break;
    case "urgent":
      color = "bg-red-600 text-white";
      break;
    default:
      color = "bg-gray-200";
  }
  return <Chip label={humanize(label)} style={color} />;
};
