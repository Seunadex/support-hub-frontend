import { useState, useContext, useMemo, useCallback } from "react";
import { useParams, NavLink } from "react-router";
import { formatDistanceToNow, parseISO, format, isValid } from "date-fns";
import {
  ArrowLeft,
  UserRound,
  Paperclip,
  HatGlasses,
  Send,
} from "lucide-react";

import { useSnackbar } from "notistack";

// Context
import { AuthContext } from "@/contexts/AuthContext";

// Utils
import { humanize } from "@/utils/function";

// Components
import { NumberChip, StatusChip, PriorityChip } from "@/components/Chip";
import CommentCard from "@/components/CommentCard";
import Modal from "@/components/Modal";

// GraphQL queries & mutations
import { useGetTicket } from "@/graphql/queries/getTicket";
import { useAssignTicket } from "@/graphql/mutations/assignTicket";
import { useAddComment } from "@/graphql/mutations/addComment";
import { useResolveTicket } from "@/graphql/mutations/resolveTicket";
import { useCloseTicket } from "@/graphql/mutations/closeTicket";

const LineSkeleton = () => (
  <div className="animate-pulse h-4 bg-gray-200 rounded w-full" />
);

const CardSkeleton = () => (
  <div className="bg-white border border-gray-300 p-6 rounded-lg">
    <div className="flex items-center gap-2 mb-5">
      <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="space-y-3">
      <LineSkeleton />
      <LineSkeleton />
      <LineSkeleton />
    </div>
  </div>
);

const SafeDate = ({ iso, formatStr = "MMM d, yyyy, hh:mm:ss a" }) => {
  const d = parseISO(iso || "");
  if (!iso || !isValid(d)) return <span className="text-gray-500">Unknown</span>;
  return <span title={d.toISOString()}>{format(d, formatStr)}</span>;
};

const Ticket = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const { loading, ticket } = useGetTicket(Number(id));

  const [comment, setComment] = useState("");
  const [closeTicketModalOpen, setCloseTicketModalOpen] = useState(false);
  const [resolveTicketModalOpen, setResolveTicketModalOpen] = useState(false);

  const { user: currentUser } = useContext(AuthContext);

  const {
    assignTicket,
    loading: assigning,
  } = useAssignTicket(Number(id), updatedTicket => {
    if (updatedTicket) enqueueSnackbar("Ticket assigned", { variant: "success" });
  });

  const { addComment, loading: commentLoading } = useAddComment(Number(id), comment, data => {
    if (data?.addComment?.ticket) {
      enqueueSnackbar("Comment added", { variant: "success" });
      setComment("");
      return;
    }
    (data?.addComment?.errors || []).forEach(err => enqueueSnackbar(err, { variant: "error" }));
  });

  const { closeTicket, isClosing } = useCloseTicket(Number(id), result => {
    if (result?.closeTicket?.success) {
      setCloseTicketModalOpen(false);
      enqueueSnackbar("Ticket closed", { variant: "success" });
      return;
    }
    (result?.closeTicket?.errors || []).forEach(err => enqueueSnackbar(err, { variant: "error" }));
  });

  const { resolveTicket, isResolving } = useResolveTicket(Number(id), result => {
    if (result?.resolveTicket?.success) {
      setResolveTicketModalOpen(false);
      enqueueSnackbar("Ticket resolved", { variant: "success" });
      return;
    }
    (result?.resolveTicket?.errors || []).forEach(err => enqueueSnackbar(err, { variant: "error" }));
  });

  const allowComment = useMemo(() => {
    const isCompleted = ticket?.status === "resolved" || ticket?.status === "closed";
    return (
      (!isCompleted && ticket?.agentHasReplied) || ticket?.agentCanComment || ticket?.customerCanComment
    );
  }, [ticket]);

  const isResolved = ticket?.status === "resolved";
  const isClosed = ticket?.status === "closed";

  const handleSubmit = useCallback(
    e => {
      e.preventDefault();
      if (!comment.trim() || commentLoading) return;
      try {
        addComment();
      } catch (err) {
        enqueueSnackbar("Failed to add comment", { variant: "error" });
      }
    },
    [comment, commentLoading, addComment, enqueueSnackbar]
  );

  if (loading) {
    return (
      <div className="bg-slate-50 min-h-screen px-6 md:px-10 py-10">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen grid place-items-center px-6">
        <p className="text-gray-600">Ticket not found.</p>
      </div>
    );
  }

  const createdAtDate = parseISO(ticket.createdAt || "");
  const createdAgo = isValid(createdAtDate)
    ? formatDistanceToNow(createdAtDate, { addSuffix: true })
    : "moments ago";

  return (
    <div className="bg-slate-50 min-h-screen px-6 md:px-10 lg:px-20 py-10">
      <div className="flex items-center gap-4 mb-5">
        <NavLink
          to="/"
          aria-label="Back to tickets"
          className="hover:bg-gray-200 p-2 rounded-full inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
        >
          <ArrowLeft size={17} />
        </NavLink>
        <div>
          <div className="flex gap-2 mb-3">
            <NumberChip label={ticket.number} />
            <StatusChip label={ticket.status} />
            <PriorityChip label={ticket.priority} />
          </div>
          <h1 className="text-2xl font-bold truncate" title={ticket.title}>
            {ticket.title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <section className="bg-white border border-gray-300 p-6 rounded-lg">
            <div className="flex items-center gap-2 mb-5">
              <UserRound size={30} />
              <div>
                <div className="flex items-center gap-3">
                  <p className="font-medium" title={ticket.customer.fullName || ticket.customer.firstName}>
                    {ticket.customer.firstName}
                  </p>
                  <div className="text-gray-600 px-2 bg-gray-200 rounded-xl text-xs whitespace-nowrap">
                    {ticket.customer.role}
                  </div>
                </div>
                <p className="text-gray-500 text-sm" title={isValid(createdAtDate) ? createdAtDate.toISOString() : undefined}>
                  Created {createdAgo}
                </p>
              </div>
            </div>

            <p className="text-slate-700 whitespace-pre-wrap break-words">{ticket.description}</p>

            <hr className="my-5 text-gray-200" />

            <p className="flex items-center gap-1 mb-3">
              <Paperclip size={16} />
              <span className="text-sm font-medium">Attachments</span>
            </p>

            {ticket.attachments.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {ticket.attachments.map(att => (
                  <li key={att.id} className="flex items-center gap-1 text-blue-700">
                    <Paperclip size={12} />
                    <a
                      href={att.url}
                      className="text-xs hover:underline"
                      target="_blank"
                      rel="noopener"
                      title={att.filename}
                    >
                      {att.filename}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No attachments</p>
            )}
          </section>

          {Array.isArray(ticket.comments) && ticket.comments.map(c => (
            <CommentCard key={c.id} comment={c} />
          ))}

          {allowComment && (
            <section className="bg-white border border-gray-300 p-6 rounded-lg mt-4">
              <p className="font-medium mb-4">Add Response</p>
              <form className="flex flex-col" onSubmit={handleSubmit}>
                <textarea
                  className="border border-gray-300 p-2 rounded-lg w-full bg-slate-50 text-sm"
                  rows={4}
                  placeholder="Type your response here..."
                  onChange={e => setComment(e.target.value)}
                  value={comment}
                />
                <button
                  type="submit"
                  disabled={!comment.trim() || commentLoading}
                  className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg flex self-end text-sm items-center gap-1 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <Send size={15} />
                  <span>{commentLoading ? "Sending..." : "Send Response"}</span>
                </button>
              </form>
            </section>
          )}
        </div>

        <aside>
          <section className="bg-white border border-gray-300 p-4 rounded-lg">
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
              <p className="text-gray-700 text-sm">{humanize(ticket.category)}</p>
            </div>
            <div className="mb-3">
              <p className="text-gray-500 text-sm">Created</p>
              <p className="text-gray-700 text-sm">
                <SafeDate iso={ticket.createdAt} />
              </p>
            </div>
            {ticket.firstResponseAt && (
              <div className="mb-3">
                <p className="text-gray-500 text-sm mb-1">First Response</p>
                <p className="text-gray-700 text-sm">
                  <SafeDate iso={ticket.firstResponseAt} />
                </p>
              </div>
            )}
          </section>

          <section className="bg-white border border-gray-300 p-4 rounded-lg mt-5">
            <p className="font-semibold mb-4">Assigned Agent</p>
            {ticket.assignedTo ? (
              <div className="flex items-center gap-2">
                <HatGlasses size={35} />
                <div>
                  <p className="text-gray-700 font-medium">{ticket.assignedTo.fullName}</p>
                  <p className="text-gray-500 text-sm">{ticket.assignedTo.email}</p>
                </div>
              </div>
            ) : currentUser?.role === "agent" ? (
              <button
                className="border border-gray-500 px-4 py-1 rounded-md text-sm whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-violet-400"
                onClick={() => assignTicket()}
                disabled={assigning}
              >
                {assigning ? "Assigning..." : "Assign to Me"}
              </button>
            ) : (
              <p className="text-gray-500 text-sm">Unassigned</p>
            )}
          </section>

          <section className="bg-white border border-gray-300 p-4 rounded-lg mt-5 flex flex-col gap-3">
            <p className="font-medium">Actions</p>
            <div className="flex gap-3">
              <button
                type="button"
                className="bg-green-500 text-white text-sm px-4 py-1 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-300"
                onClick={() => setResolveTicketModalOpen(true)}
                disabled={!ticket?.canResolve || isClosed}
              >
                {isClosed || isResolved ? "Resolved" : "Resolve"}
              </button>

              {!isClosed && ticket?.canClose && (
                <button
                  type="button"
                  className="bg-red-500 text-white text-sm px-4 py-1 rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300"
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
              <div className="flex justify-end mt-4 gap-2">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-1 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={() => setResolveTicketModalOpen(false)}
                >
                  No
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-1 rounded-md text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-300"
                  onClick={resolveTicket}
                  disabled={isResolving}
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
              <div className="flex justify-end mt-4 gap-2">
                <button
                  className="bg-gray-300 text-gray-700 px-4 py-1 rounded-md text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
                  onClick={() => setCloseTicketModalOpen(false)}
                >
                  No
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-1 rounded-md text-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-300"
                  onClick={closeTicket}
                  disabled={isClosing}
                >
                  {isClosing ? "Closing..." : "Yes, close it"}
                </button>
              </div>
            </Modal>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default Ticket;
