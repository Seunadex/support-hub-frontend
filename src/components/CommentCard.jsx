import { formatDistanceToNow, parseISO } from "date-fns";
import {
  ArrowLeft,
  UserRound,
  Paperclip,
  HatGlasses,
  Send,
} from "lucide-react";

const ROLE_MAPPING = {
  customer: "Customer",
  agent: "Support Agent",
};

const CommentCard = ({ comment }) => {
  const isAgent = comment.author.role === "agent";

  return (
    <div className={`border border-gray-300 p-6 rounded-lg mt-4 ${isAgent ? "bg-violet-50 border-s-4 border-l-violet-600" : "bg-white"}`}>
      <div className="flex items-center space-x-2 mb-5">
        {isAgent ? <HatGlasses size={35} /> : <UserRound size={35} />}
        <div>
          <div className="flex items-center space-x-3">
            <p className="font-medium">
              {comment.author.fullName}
            </p>
            <div className={`text-gray-600 px-3 py-0.5 rounded-xl text-xs ${isAgent ? "bg-violet-600 text-white" : "bg-gray-200"}`}>
              {ROLE_MAPPING[comment.author.role]}
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            {formatDistanceToNow(parseISO(comment.createdAt), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
      <p className="text-gray-700">{comment.body}</p>
    </div>
  );
};

export default CommentCard;
