import { useState, useContext } from "react";
import Modal from "@/components/Modal";
import Form from "@/components/Form";
import TicketCard from "@/components/TicketCard";
import { useGetTickets } from "@/graphql/queries/getTickets"
import { useCreateTicket } from "@/graphql/mutations/createTicket";
import { AuthContext } from "@/contexts/AuthContext"
import { Plus, Ticket, Clock3, TicketCheck, PackageOpen } from "lucide-react";
import { useSnackbar } from 'notistack'
import { useGetTicketStatCount } from "@/graphql/queries/getTicketStatCount";

const Home = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useContext(AuthContext)

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
  const { createTicket, loading, error } = useCreateTicket(createTicketCallback);
  const { data, loading: statsLoading } = useGetTicketStatCount();

  console.log(data, 'Ticket Stats');

  return (
    <div className="bg-gray-50 min-h-screen p-5">
      <div className="flex justify-between items-center">
        <div className="">
          <h1 className="text-3xl font-bold">{isCustomer ? "Your Support Tickets" : "Support Tickets"}</h1>
          <p className="text-md text-gray-600">
            Track and manage your support requests in one place.
          </p>
        </div>
        {isCustomer && (
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1.5 rounded flex items-center space-x-2"
            onClick={openModal}
          >
            <Plus size={20} /> <span>New Ticket</span>
          </button>
        )}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title="New Support Ticket"
        ><Form createTicket={createTicket} loading={loading} error={error} /></Modal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
        <div className="bg-blue-50 p-4 rounded shadow">
          <div className="flex justify-between items-center"><p className="text-sm text-gray-500">Total Tickets</p><Ticket size={15} /></div>
          <p className="text-lg font-semibold">{data?.ticketStatCount?.total}</p>
        </div>
        <div className="bg-red-50 p-4 rounded shadow">
          <div className="flex justify-between items-center"><p className="text-sm text-gray-500">Open</p><PackageOpen size={15} /></div>
          <p className="text-lg font-semibold">{data?.ticketStatCount?.open}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded shadow">
          <div className="flex justify-between items-center"><p className="text-sm text-gray-500">Pending</p><Clock3 size={15} /></div>
          <p className="text-lg font-semibold">{data?.ticketStatCount?.pending}</p>
        </div>
        <div className="bg-green-50 p-4 rounded shadow">
          <div className="flex justify-between items-center"><p className="text-sm text-gray-500">Resolved</p><TicketCheck size={15} /></div>
          <p className="text-lg font-semibold">{data?.ticketStatCount?.resolved}</p>
        </div>
      </div>

        {ticketsLoading ? (
          <p>Loading...</p>
        ) : (
            tickets.length > 0 ? (
              <div className="border border-gray-200 mt-7 rounded-md bg-white grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
                {tickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket}/>
                ))}
              </div>
            ) : (
            <p className="text-gray-600 text-center my-10 text-xl">No tickets found.</p>
          )
        )}


    </div>
  );
};

export default Home;
