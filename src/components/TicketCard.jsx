import { NumberChip, StatusChip, PriorityChip } from "@/components/Chip";
import { formatDistanceToNow, parseISO } from "date-fns";

const TicketCard = (ticket) => {
  const { title, description, number, status, priority, createdAt, category, assignedTo } = ticket.ticket;
  return (
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
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(parseISO(createdAt), { addSuffix: true })}
          </p>
          <p className="text-xs text-gray-400">1</p>
          <p className="text-xs text-gray-400">Category: {category}</p>
        </div>

        {assignedTo && (
          <span className="text-xs text-gray-400">Assigned to: {assignedTo.firstName} {assignedTo.lastName}</span>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
