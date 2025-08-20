import { memo } from "react";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";
import { UserRound, HatGlasses } from "lucide-react";
import PropTypes from "prop-types";

const ROLE_MAPPING = {
  customer: "Customer",
  agent: "Support Agent",
};

const RoleBadge = ({ isAgent, label }) => (
  <span
    title={label}
    className={`px-3 py-0.5 whitespace-nowrap rounded-xl text-xs ${
      isAgent ? "bg-violet-600 text-white" : "bg-gray-200 text-gray-700"
    }`}
  >
    {label}
  </span>
);

RoleBadge.propTypes = {
  isAgent: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
};

const Avatar = ({ isAgent, avatarUrl, name }) => {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name || "User"}
        width={32}
        height={32}
        className="w-8 h-8 rounded-full object-cover"
      />
    );
  }
  return isAgent ? (
    <HatGlasses size={32} aria-hidden="true" />
  ) : (
    <UserRound size={32} aria-hidden="true" />
  );
};

Avatar.propTypes = {
  isAgent: PropTypes.bool.isRequired,
  avatarUrl: PropTypes.string,
  name: PropTypes.string,
};

const formatCreatedAt = createdAt => {
  const parsed = parseISO(createdAt || "");
  if (!isValid(parsed)) return { text: "moments ago", title: "Unknown timestamp" };
  return {
    text: formatDistanceToNow(parsed, { addSuffix: true }),
    title: parsed.toISOString(),
  };
};

const CommentCard = ({ comment }) => {
  const author = comment?.author || {};
  const isAgent = author.role === "agent";
  const roleLabel = ROLE_MAPPING[author.role] || "User";

  const { text: timeText, title: timeTitle } = formatCreatedAt(comment?.createdAt);

  const containerClasses = `border p-6 rounded-lg mt-4 ${
    isAgent ? "bg-violet-50 border-l-4 border-gray-300 border-l-violet-600" : "bg-white border-gray-300"
  }`;

  const name = author.fullName || "Unknown";

  return (
    <article className={containerClasses} aria-label={`${roleLabel} comment`}>
      <div className="flex items-center gap-2 mb-5">
        <Avatar isAgent={isAgent} avatarUrl={author.avatarUrl} name={name} />
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <p className="font-medium truncate" title={name} data-testid="comment-author">
              {name}
            </p>
            <RoleBadge isAgent={isAgent} label={roleLabel} />
          </div>
          <p className="text-gray-500 text-sm" title={timeTitle} aria-live="polite">
            {timeText}
          </p>
        </div>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap break-words" data-testid="comment-body">
        {comment?.body || ""}
      </p>
    </article>
  );
};

CommentCard.propTypes = {
  comment: PropTypes.shape({
    body: PropTypes.string,
    createdAt: PropTypes.string,
    author: PropTypes.shape({
      fullName: PropTypes.string,
      role: PropTypes.string,
      avatarUrl: PropTypes.string,
    }),
  }),
};

export default memo(CommentCard);
