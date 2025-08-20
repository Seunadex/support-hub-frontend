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
import Modal from "@/components/Modal";
import { useResolveTicket } from "../graphql/mutations/resolveTicket";
import { useCloseTicket } from "../graphql/mutations/closeTicket";
import { useSnackbar } from "notistack";

const Ticket = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const { loading, ticket } = useGetTicket(id);
  const [comment, setComment] = useState("");
  const [closeTicketModalOpen, setCloseTicketModalOpen] = useState(false);
  const [resolveTicketModalOpen, setResolveTicketModalOpen] = useState(false);

  // Mutation Hooks
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
      if (data?.addComment?.ticket) {
        enqueueSnackbar("Comment added successfully", { variant: "success" });
        return setComment("");
      } else {
        data?.addComment?.errors.forEach((error) => {
          enqueueSnackbar(error, { variant: "error" });
        });
      }
    }
  );
  const { closeTicket, isClosing } = useCloseTicket(id, (result) => {
    if (result.closeTicket.success) {
      return setCloseTicketModalOpen(false);
    }

    result?.closeTicket?.errors.forEach((error) => {
      enqueueSnackbar(error, { variant: "error" });
    });
  });
  const { resolveTicket, isResolving } = useResolveTicket(id, (result) => {
    if (result.resolveTicket.success) {
      return setResolveTicketModalOpen(false);
    }

    result?.resolveTicket?.errors.forEach((error) => {
      enqueueSnackbar(error, { variant: "error" });
    });
  });

  const { user: currentUser } = useContext(AuthContext);
  const agentCanComment = ticket?.agentCanComment;
  const customerCanComment = ticket?.customerCanComment;
  const canResolve = ticket?.canResolve;
  const canClose = ticket?.canClose;
  const isCompleted =
    ticket?.status === "resolved" || ticket?.status === "closed";
  const isResolved = ticket?.status === "resolved";
  const isClosed = ticket?.status === "closed";

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
    <div className="bg-slate-50 min-h-screen px-20 md:px-40 py-10">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="bg-white border border-gray-300 p-6 rounded-lg">
            <div className="flex items-center space-x-2 mb-5">
              <UserRound size={30} />
              <div>
                <div className="flex items-center space-x-3">
                  <p className="font-medium">{ticket.customer.firstName}</p>
                  <div className="text-gray-600 px-2 bg-gray-200 rounded-xl text-xs whitespace-nowrap">
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
          {/* TODO: Simplify complex conditionals */}
          {((!isCompleted && ticket?.agentHasReplied) ||
            agentCanComment ||
            customerCanComment) && (
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
            ) : currentUser?.role === "agent" ? (
              <button
                className="border border-gray-500 px-4 py-1 rounded-md text-sm whitespace-nowrap cursor-pointer"
                onClick={() => assignTicket()}
                disabled={assigning}
              >
                {assigning ? "Assigning..." : "Assign to Me"}
              </button>
            ) : (
              <p className="text-gray-500 text-sm">Unassigned</p>
            )}
          </div>
          <div className="bg-white border border-gray-300 p-4 rounded-lg mt-5 flex space-x-3 flex flex-col">
            <p className="font-medium mb-4">Actions</p>
            <div className="space-x-3">
              <button
                type="button"
                className="bg-green-500 text-white text-sm px-4 py-1 rounded-lg hover:cursor-pointer hover:not-disabled:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => setResolveTicketModalOpen(true)}
                disabled={!canResolve}
              >
                {isClosed || isResolved ? "Resolved" : "Resolve"}
              </button>
              {!isClosed && canClose && (
                <button
                  type="button"
                  className="bg-red-500 text-white px-4 py-1 rounded-lg text-sm"
                  onClick={() => setCloseTicketModalOpen(true)}
                >
                  {ticket?.status === "closed" ? "Closed" : "Close"}
                </button>
              )}
            </div>
            <Modal
              title="Resolve Ticket"
              isOpen={resolveTicketModalOpen}
              onClose={() => setResolveTicketModalOpen(false)}
            >
              <p>Are you sure you want to resolve this ticket?</p>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-1 rounded-md mr-2 text-sm cursor-pointer"
                  onClick={() => setResolveTicketModalOpen(false)}
                >
                  No
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-1 rounded-md text-sm cursor-pointer"
                  onClick={resolveTicket}
                >
                  {isResolving ? "Resolving..." : "Yes, resolve it"}
                </button>
              </div>
            </Modal>
            <Modal
              title="Close Ticket"
              isOpen={closeTicketModalOpen}
              onClose={() => setCloseTicketModalOpen(false)}
            >
              <p>Are you sure you want to close this ticket?</p>
              <div className="flex justify-end mt-4">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-1 rounded-md mr-2 text-sm cursor-pointer"
                  onClick={() => setCloseTicketModalOpen(false)}
                >
                  No
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-md text-sm cursor-pointer"
                  onClick={closeTicket}
                >
                  {isClosing ? "Closing..." : "Yes, close it"}
                </button>
              </div>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ticket;
