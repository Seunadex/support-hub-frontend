import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { UserRound, HatGlasses } from "lucide-react";

const ROLE_MAPPING = {
  customer: "Customer",
  agent: "Support Agent",
};

const CommentCard = ({ comment }) => {
  const author = comment?.author || {};
  const isAgent = author.role === "agent";
  const roleLabel = ROLE_MAPPING[author.role] || "User";

  const createdAtDate = parseISO(comment?.createdAt || "");
  const timeText = isValid(createdAtDate)
    ? formatDistanceToNow(createdAtDate, { addSuffix: true })
    : "just now";
  const timeTitle = isValid(createdAtDate)
    ? createdAtDate.toISOString()
    : "Unknown timestamp";

  const containerClasses = `border p-6 rounded-lg mt-4 ${
    isAgent
      ? "bg-violet-50 border-s-4 border-gray-300 border-l-violet-600"
      : "bg-white border-gray-300"
  }`;

  const badgeClasses = `px-3 py-0.5 whitespace-nowrap rounded-xl text-xs ${
    isAgent ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-700"
  }`;

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-2 mb-5">
        {isAgent ? (
          <HatGlasses size={32} aria-hidden="true" />
        ) : (
          <UserRound size={32} aria-hidden="true" />
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <p className="font-medium truncate" title={author.fullName || "Unknown"}>
              {author.fullName || "Unknown"}
            </p>
            <div className={badgeClasses} aria-label={`Role: ${roleLabel}`}>
              {roleLabel}
            </div>
          </div>
          <p className="text-gray-500 text-sm" title={timeTitle}>
            {timeText}
          </p>
        </div>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap break-words">{comment?.body || ""}</p>
    </div>
  );
};

export default CommentCard;
