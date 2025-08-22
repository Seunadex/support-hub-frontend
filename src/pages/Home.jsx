import { useState, useContext, useMemo, useCallback } from "react";

import { useSnackbar } from "notistack";

import { AuthContext } from "@/contexts/AuthContext";

import { useGetTickets } from "@/graphql/queries/getTickets";
import { useCreateTicket } from "@/graphql/mutations/createTicket";
import { useGetTicketStatCount } from "@/graphql/queries/getTicketStatCount";
import { useExportClosedTickets } from "../graphql/mutations/exportClosedTickets";

import Modal from "@/components/Modal";
import Form from "@/components/Form";
import TicketCard from "@/components/TicketCard";

import {
  Plus,
  Ticket,
  Clock3,
  TicketCheck,
  PackageOpen,
  Download,
  LoaderCircle,
} from "lucide-react";

import { format, subMonths } from "date-fns";
import Tooltip from "../components/Tooltip";

const StatCard = ({ title, value, icon, bgClass }) => (
  <div className={`${bgClass} p-4 rounded shadow`}>
    <div className="flex justify-between items-center">
      <p className="text-sm text-gray-600">{title}</p>
      {icon}
    </div>
    <p className="text-lg font-semibold" aria-live="polite">{value}</p>
  </div>
);

const LineSkeleton = () => (
  <div className="animate-pulse h-4 bg-gray-200 rounded w-full" />
);

const CardSkeleton = () => (
  <div className="border border-gray-200 p-4 rounded shadow bg-white">
    <div className="flex gap-2 mb-4">
      <div className="h-5 w-12 bg-gray-200 rounded animate-pulse" />
      <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
      <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
    </div>
    <div className="space-y-2">
      <LineSkeleton />
      <LineSkeleton />
      <LineSkeleton />
    </div>
  </div>
);

const Home = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);

  const isCustomer = useMemo(() => user?.role === "customer", [user?.role]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const createTicketCallback = useCallback(
    result => {
      if (result?.createTicket?.ticket) {
        enqueueSnackbar("Ticket created successfully", { variant: "success" });
        closeModal();
      } else {
        (result?.createTicket?.errors || []).forEach(err => {
          enqueueSnackbar(err, { variant: "error" });
        });
      }
    },
    [enqueueSnackbar, closeModal]
  );

  const { tickets, loading: ticketsLoading } = useGetTickets();
  const { createTicket, loading, error } = useCreateTicket(createTicketCallback);
  const { data, loading: statsLoading } = useGetTicketStatCount();
  const { exportClosedTickets, isExporting } = useExportClosedTickets();

  const handleExport = useCallback(async () => {
    const dateFormat = "yyyy-MM-dd'T'HH:mm:ssxxx";
    try {
      const startDate = format(subMonths(new Date(), 1), dateFormat);
      const endDate = format(new Date(), dateFormat);
      const result = await exportClosedTickets({ variables: { startDate, endDate } });

      const payload = result?.data?.exportClosedTickets;
      if (!payload) {
        enqueueSnackbar("No export payload returned", { variant: "error" });
        return;
      }

      const { csvUrl, filename, count, errors: errs = [] } = payload;

      if (errs.length > 0) {
        errs.forEach(err => enqueueSnackbar(err, { variant: "error" }));
        return;
      }

      enqueueSnackbar(`Successfully exported ${count} tickets`, { variant: "success" });

      if (csvUrl) {
        const a = document.createElement("a");
        a.href = csvUrl;
        a.target = "_blank";
        a.rel = "noopener";
        if (filename) a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      console.error("Error exporting closed tickets:", e);
      enqueueSnackbar("Error exporting closed tickets", { variant: "error" });
    }
  }, [enqueueSnackbar, exportClosedTickets]);

  const stats = data?.ticketStatCount || {};

  return (
    <div className="bg-gray-50 min-h-screen p-5">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {isCustomer ? "Your Support Tickets" : "Support Tickets"}
          </h1>
          <p className="text-md text-gray-600">Track and manage your support requests in one place.</p>
        </div>
        {isCustomer ? (
          <button
            type="button"
            className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={openModal}
          >
            <Plus size={20} /> <span>New Ticket</span>
          </button>
        ) : (
          <Tooltip text="Export closed tickets for the last month">
            <button
              type="button"
              className="bg-blue-600 text-white px-3 py-1.5 rounded-full cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleExport}
              disabled={isExporting}
              aria-busy={isExporting}
              aria-label="Export closed tickets for the last month"
              >
              <Download size={18} />
              <span>{isExporting ? "Exporting" : "Export"}</span>
              {isExporting && <LoaderCircle className="animate-spin" size={16} />}
            </button>
          </Tooltip>
        )}
        <Modal isOpen={isModalOpen} onClose={closeModal} title="New Support Ticket">
          <Form createTicket={createTicket} loading={loading} error={error} />
        </Modal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
        {statsLoading ? (
          <>
            <div className="bg-blue-50 p-4 rounded shadow"><LineSkeleton /><div className="mt-2"><LineSkeleton /></div></div>
            <div className="bg-red-50 p-4 rounded shadow"><LineSkeleton /><div className="mt-2"><LineSkeleton /></div></div>
            <div className="bg-yellow-50 p-4 rounded shadow"><LineSkeleton /><div className="mt-2"><LineSkeleton /></div></div>
            <div className="bg-green-50 p-4 rounded shadow"><LineSkeleton /><div className="mt-2"><LineSkeleton /></div></div>
          </>
        ) : (
          <>
            <StatCard title="Total Tickets" value={stats.total ?? 0} icon={<Ticket size={15} />} bgClass="bg-blue-50" />
            <StatCard title="Open" value={stats.open ?? 0} icon={<PackageOpen size={15} />} bgClass="bg-red-50" />
            <StatCard title="Pending" value={stats.pending ?? 0} icon={<Clock3 size={15} />} bgClass="bg-yellow-50" />
            <StatCard title={isCustomer ? "Resolved or Closed" : "Completed"} value={stats.completed ?? 0} icon={<TicketCheck size={15} />} bgClass="bg-green-50" />
          </>
        )}
      </div>

      {ticketsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6 mt-7">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : tickets.length > 0 ? (
        <div className="border border-gray-200 mt-7 rounded-md bg-white grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
          {tickets.map(ticket => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center my-10 text-xl">No tickets found.</p>
      )}
    </div>
  );
};

export default Home;
