import { NumberChip, StatusChip, PriorityChip } from "@/components/Chip";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Calendar, Paperclip, ChartColumnStacked, UserRoundPen } from "lucide-react";
import { NavLink } from "react-router";

const TicketCard = (ticket) => {
  const { title, description, number, status, priority, createdAt, category, assignedTo, attachments } = ticket.ticket || {};
  return (
    <NavLink to={`/ticket/${ticket.ticket.id}`}>
      <div className="border border-gray-200 p-4 rounded shadow hover:shadow-lg">
        <div className="flex space-x-2 mb-4">
          <NumberChip label={number} />
          <StatusChip label={status} />
          <PriorityChip label={priority} />
      </div>
      <h2 className="font-bold text-md text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500">
        {description}
      </p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-3">
          <p className="text-xs text-gray-500 flex items-center space-x-1">
            <Calendar size={14}/>
            <span>{formatDistanceToNow(parseISO(createdAt), { addSuffix: true })}</span>
          </p>
          <p className="text-xs text-gray-500 flex items-center space-x-1">
            <Paperclip size={14} />
            <span>{attachments.length}</span>
          </p>
          <p className="text-xs text-gray-500 flex items-center space-x-1">
            <ChartColumnStacked size={14} />
            <span>Category: {category}</span>
          </p>
        </div>

        {assignedTo && (
          <span className="text-xs text-gray-500 flex items-center space-x-1">Assigned to: <UserRoundPen size={15} /> {assignedTo.firstName} {assignedTo.lastName}</span>
        )}
      </div>
    </div>
    </NavLink>
  );
};

export default TicketCard;
