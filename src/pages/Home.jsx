import { useState, useContext } from "react";
import Modal from "@/components/Modal";
import Form from "@/components/Form";
import TicketCard from "@/components/TicketCard";
import { useGetTickets } from "@/graphql/queries/getTickets";
import { useCreateTicket } from "@/graphql/mutations/createTicket";
import { AuthContext } from "@/contexts/AuthContext";
import {
  Plus,
  Ticket,
  Clock3,
  TicketCheck,
  PackageOpen,
  Download,
  LoaderCircle,
} from "lucide-react";
import { useSnackbar } from "notistack";
import { useGetTicketStatCount } from "@/graphql/queries/getTicketStatCount";
import { useExportClosedTickets } from "../graphql/mutations/exportClosedTickets";
import { format, subMonths } from "date-fns";

const Home = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext);

  const isCustomer = user?.role === "customer";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const createTicketCallback = (result) => {
    if (result?.createTicket?.ticket) {
      enqueueSnackbar("Ticket created successfully", { variant: "success" });
      closeModal();
    } else {
      result?.createTicket?.errors.forEach((error) => {
        enqueueSnackbar(error, { variant: "error" });
      });
    }
  };

  const { tickets, loading: ticketsLoading } = useGetTickets();
  const { createTicket, loading, error } =
    useCreateTicket(createTicketCallback);
  const { data, loading: statsLoading } = useGetTicketStatCount();
  const { exportClosedTickets, isExporting } = useExportClosedTickets();

  const handleExport = async () => {
    const dateFormat = "yyyy-MM-dd'T'HH:mm:ssxxx";
    try {
      const startDate = format(subMonths(new Date(), 1), dateFormat);
      const endDate = format(new Date(), dateFormat);
      const result = await exportClosedTickets({
        variables: { startDate, endDate },
      });

      if (result.data?.exportClosedTickets) {
        const { csvUrl, filename, count, errors } =
          result.data.exportClosedTickets;
        const errs = errors || [];

        if (errs.length > 0) {
          errs.forEach((err) => {
            enqueueSnackbar(err, { variant: "error" });
          });
        } else {
          enqueueSnackbar(`Successfully exported ${count} tickets`, {
            variant: "success",
          });

          // Add a host
          window.open(csvUrl, "_blank");
        }
      }
    } catch (error) {
      console.error("Error exporting closed tickets:", error);
      enqueueSnackbar("Error exporting closed tickets", { variant: "error" });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-5">
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-3xl font-bold">
            {isCustomer ? "Your Support Tickets" : "Support Tickets"}
          </h1>
          <p className="text-md text-gray-600">
            Track and manage your support requests in one place.
          </p>
        </div>
        {isCustomer ? (
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1.5 rounded flex items-center space-x-2"
            onClick={openModal}
          >
            <Plus size={20} /> <span>New Ticket</span>
          </button>
        ) : (
          <button
            type="button"
            className="bg-blue-500 text-white p-3 rounded-full flex items-center space-x-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleExport}
            disabled={isExporting}
          >
            <Download size={20} />
            {isExporting && <LoaderCircle className="animate-spin" />}
          </button>
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="New Support Ticket"
        >
          <Form createTicket={createTicket} loading={loading} error={error} />
        </Modal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
        <div className="bg-blue-50 p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Total Tickets</p>
            <Ticket size={15} />
          </div>
          <p className="text-lg font-semibold">
            {data?.ticketStatCount?.total}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Open</p>
            <PackageOpen size={15} />
          </div>
          <p className="text-lg font-semibold">{data?.ticketStatCount?.open}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">Pending</p>
            <Clock3 size={15} />
          </div>
          <p className="text-lg font-semibold">
            {data?.ticketStatCount?.pending}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded shadow">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {isCustomer ? "Resolved or Closed" : "Completed"}
            </p>
            <TicketCheck size={15} />
          </div>
          <p className="text-lg font-semibold">
            {data?.ticketStatCount?.completed}
          </p>
        </div>
      </div>

      {ticketsLoading ? (
        <p>Loading...</p>
      ) : tickets.length > 0 ? (
        <div className="border border-gray-200 mt-7 rounded-md bg-white grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center my-10 text-xl">
          No tickets found.
        </p>
      )}
    </div>
  );
};

export default Home;
