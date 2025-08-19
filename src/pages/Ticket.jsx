import { useState, useContext } from "react";
import { useParams, NavLink } from "react-router";
import { useGetTicket } from "@/graphql/queries/getTicket";
import { NumberChip, StatusChip, PriorityChip } from "@/components/Chip";
import {
  ArrowLeft,
  UserRound,
  Paperclip,
  HatGlasses,
  Send,
} from "lucide-react";
import { formatDistanceToNow, parseISO, format } from "date-fns";
import { humanize } from "@/utils/function";
import { useAssignTicket } from "@/graphql/mutations/assignTicket";
import { useAddComment } from "@/graphql/mutations/addComment";
import CommentCard from "@/components/CommentCard";
import { AuthContext } from "@/contexts/AuthContext";

const Ticket = () => {
  const { id } = useParams();
  const { loading, ticket } = useGetTicket(id);
  const [comment, setComment] = useState("");
  const { assignTicket, loading: assigning } = useAssignTicket(
    id,
    (updatedTicket) => {
      // Handle successful assignment
      console.log(updatedTicket);
    }
  );
  const { addComment, loading: commentLoading } = useAddComment(
    id,
    comment,
    (data) => {
      setComment("");
    }
  );
  const { user: currentUser } = useContext(AuthContext);
  const agentCanComment = ticket?.assignedTo?.id === currentUser?.id;
  const customerCanComment = ticket?.agentHasReplied;

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      if (!comment.trim()) return;
      addComment();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="bg-slate-50 min-h-screen p-10">
      <div className="flex items-center space-x-4 mb-5">
        <div className="hover:bg-gray-200 p-2 rounded-full flex items-center">
          <NavLink to="/" className="cursor-pointer">
            <ArrowLeft size={17} />
          </NavLink>
        </div>
        <div>
          <div className="flex space-x-2 mb-4">
            <NumberChip label={ticket.number} />
            <StatusChip label={ticket.status} />
            <PriorityChip label={ticket.priority} />
          </div>
          <h1 className="text-2xl font-bold">{ticket.title}</h1>
        </div>
      </div>
      <div className="flex space-x-4">
        <div>
          <div className="bg-white border border-gray-300 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-5">
              <UserRound size={30} />
              <div>
                <div className="flex items-center space-x-3">
                  <p className="font-medium">
                    {ticket.customer.firstName} {ticket.customer.lastName}
                  </p>
                  <div className="text-gray-600 px-2 bg-gray-200 rounded-xl text-xs">
                    {ticket.customer.role}
                  </div>
                </div>
                <p className="text-gray-500 text-sm">
                  Created{" "}
                  {formatDistanceToNow(parseISO(ticket.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <p className="text-slate-700">{ticket.description}</p>
            <hr className="my-5 text-gray-200" />
            <p className="flex items-center space-x-1 mb-3">
              <Paperclip size={16} />{" "}
              <span className="text-sm font-medium">Attachments</span>
            </p>
            {ticket.attachments.length > 0 ? (
              <div className="flex flex-col space-y-1">
                {ticket.attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center space-x-1 text-blue-700"
                  >
                    <Paperclip size={12} />
                    <NavLink
                      to={attachment.url}
                      className="text-xs hover:underline"
                    >
                      {attachment.filename}
                    </NavLink>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No attachments</p>
            )}
          </div>

          {ticket.comments.map((comment) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}

          {(agentCanComment || customerCanComment) && (
            <div className="bg-white border border-gray-300 p-6 rounded-lg mt-4">
              <p className="font-medium mb-4">Add Response</p>
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <textarea
                  className="border border-gray-300 p-2 rounded-lg w-full bg-slate-50 text-sm"
                  rows={4}
                  placeholder="Type your response here..."
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                ></textarea>
                <button
                  type="submit"
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg flex self-end text-sm items-center space-x-1 cursor-pointer"
                >
                  <Send size={15} />{" "}
                  <span>{commentLoading ? "Sending..." : "Send Response"}</span>
                </button>
              </form>
            </div>
          )}
        </div>
        <div>
          <div className="bg-white border border-gray-300 p-4 rounded-lg">
            <p className="font-medium mb-4">Ticket Information</p>
            <div className="mb-3">
              <p className="text-gray-500 text-sm mb-1">Status</p>
              <StatusChip label={ticket.status} />
            </div>
            <div className="mb-3">
              <p className="text-gray-500 text-sm mb-1">Priority</p>
              <PriorityChip label={ticket.priority} />
            </div>
            <div className="mb-3">
              <p className="text-gray-500 text-sm">Category</p>
              <p className="text-gray-700 text-sm">
                {humanize(ticket.category)}
              </p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 text-sm">Created</p>
              <p className="text-gray-700 text-sm">
                {format(parseISO(ticket.createdAt), "MMM d, yyyy, hh:mm:ss a")}
              </p>
            </div>
            {ticket.firstResponseAt && (
              <div className="mb-3">
                <p className="text-gray-500 text-sm mb-1">First Response</p>
                <p className="text-gray-700 text-sm">
                  {format(
                    parseISO(ticket.firstResponseAt),
                    "MMM d, yyyy, hh:mm:ss a"
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="bg-white border border-gray-300 p-4 rounded-lg mt-5">
            <p className="font-semibold mb-4">Assigned Agent</p>
            {ticket.assignedTo ? (
              <div className="flex items-center space-x-2">
                <HatGlasses size={35} />
                <div>
                  <p className="text-gray-700 font-medium">
                    {ticket.assignedTo.fullName}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {ticket.assignedTo.email}
                  </p>
                </div>
              </div>
            ) : (
              currentUser?.role === "agent" && (
                <button
                  className="border border-gray-500 px-4 py-1 rounded-md text-sm whitespace-nowrap cursor-pointer"
                  onClick={() => assignTicket()}
                  disabled={assigning}
                >
                  {assigning ? "Assigning..." : "Assign to Me"}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
