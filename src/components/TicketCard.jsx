import { NumberChip, StatusChip, PriorityChip } from "@/components/Chip";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { Calendar, Paperclip, ChartColumnStacked, UserRoundPen } from "lucide-react";
import { NavLink } from "react-router";
import { humanize } from '../utils/function';

const TicketCard = ({ ticket }) => {
  const t = ticket || {};
  const {
    id,
    title,
    description,
    number,
    status,
    priority,
    createdAt,
    category,
    assignedTo,
    attachments,
  } = t;

  const createdAtDate = parseISO(createdAt || "");
  const createdAtText = isValid(createdAtDate)
    ? formatDistanceToNow(createdAtDate, { addSuffix: true })
    : "just now";
  const createdAtTitle = isValid(createdAtDate)
    ? createdAtDate.toISOString()
    : "Unknown timestamp";

  const attachmentCount = Array.isArray(attachments) ? attachments.length : 0;
  const categoryLabel = humanize(category) || "Uncategorized";
  const agentName = assignedTo?.fullName || assignedTo?.firstName || "Unassigned";

  const href = id ? `/ticket/${id}` : "#";

  return (
    <NavLink to={href} aria-label={`Open ticket ${number || "unknown"}`}>
      <div className="border border-gray-200 p-4 rounded shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-500 transition-shadow">
        <div className="flex gap-2 mb-4 items-center">
          <NumberChip label={number || "—"} />
          <StatusChip label={status || "unknown"} />
          <PriorityChip label={priority || "unknown"} />
        </div>

        <h2 className="font-bold text-md text-gray-800 truncate" title={title || "Untitled ticket"}>
          {title || "Untitled ticket"}
        </h2>
        <p className="text-sm text-gray-500 line-clamp-2 break-words" title={description || "No description"}>
          {description || "No description"}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div className="flex flex-wrap gap-3">
            <p className="text-xs text-gray-500 flex items-center gap-1" title={createdAtTitle}>
              <Calendar size={14} aria-hidden="true" />
              <span>{createdAtText}</span>
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1" aria-label={`${attachmentCount} attachments`}>
              <Paperclip size={14} aria-hidden="true" />
              <span>{attachmentCount}</span>
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1" title={`Category: ${categoryLabel}`}>
              <ChartColumnStacked size={14} aria-hidden="true" />
              <span>Category: {categoryLabel}</span>
            </p>
          </div>

          <span className="text-xs text-gray-500 flex items-center" title={`Agent: ${agentName}`}>
            Agent: <UserRoundPen size={14} className="mx-1" aria-hidden="true" /> {agentName}
          </span>
        </div>
      </div>
    </NavLink>
  );
};

export default TicketCard;
