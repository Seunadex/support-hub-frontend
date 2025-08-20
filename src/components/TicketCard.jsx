import React, { memo, useMemo } from "react";
import { NavLink } from "react-router";
import PropTypes from "prop-types";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { Calendar, Paperclip, ChartColumnStacked, UserRoundPen } from "lucide-react";
import { NumberChip, StatusChip, PriorityChip } from "@/components/Chip";
import { humanize } from "../utils/function";

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

  const computed = useMemo(() => {
    const createdAtDate = parseISO(createdAt || "");
    const createdAtText = isValid(createdAtDate)
      ? formatDistanceToNow(createdAtDate, { addSuffix: true })
      : "moments ago";
    const createdAtTitle = isValid(createdAtDate)
      ? createdAtDate.toISOString()
      : "Unknown";

    const attachmentCount = Array.isArray(attachments) ? attachments.length : 0;
    const categoryLabel = humanize(category);
    const agentName = assignedTo?.fullName || assignedTo?.firstName || "Unassigned";
    const href = id ? `/ticket/${id}` : "#";

    return { createdAtText, createdAtTitle, attachmentCount, categoryLabel, agentName, href };
  }, [createdAt, attachments, category, assignedTo, id]);

  const { createdAtText, createdAtTitle, attachmentCount, categoryLabel, agentName, href } = computed;

  return (
    <NavLink
      to={href}
      aria-label={`Open ticket ${number ?? "unknown"}`}
      className={({ isActive }) =>
        `block focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded transition-shadow ${
          isActive ? "ring-1 ring-violet-300" : ""
        }`}
    >
      <article
        className="border border-gray-200 p-4 rounded shadow hover:shadow-lg transition-shadow bg-white"
        data-testid="ticket-card"
      >
        <header className="flex gap-2 mb-4 items-center">
          <NumberChip label={number || "#"} />
          <StatusChip label={status || "unknown"} />
          <PriorityChip label={priority || "unknown"} />
        </header>

        <h2 className="font-bold text-md text-gray-800 truncate" title={title}>
          {title}
        </h2>
        <p className="text-sm text-gray-500 line-clamp-2 break-words" title={description}>
          {description}
        </p>

        <footer className="flex items-center justify-between mt-4">
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
        </footer>
      </article>
    </NavLink>
  );
};

TicketCard.propTypes = {
  ticket: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string,
    description: PropTypes.string,
    number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    status: PropTypes.string,
    priority: PropTypes.string,
    createdAt: PropTypes.string,
    category: PropTypes.string,
    assignedTo: PropTypes.shape({
      fullName: PropTypes.string,
      firstName: PropTypes.string,
    }),
    attachments: PropTypes.array,
  }),
};

export default memo(TicketCard);
