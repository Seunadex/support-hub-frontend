import { gql, useQuery } from "@apollo/client";

export const GET_TICKETS = gql`
  query GetTickets {
    tickets {
      id
      title
      description
      number
      status
      priority
      createdAt
      firstResponseAt
      category
      reopenedAt
      assignedTo {
        id
        firstName
        lastName
      }
      customer {
        id
        firstName
        lastName
      }
      attachments {
        id
      }
    }
  }
`;

export const useGetTickets = () => {
  const { data, loading, error } = useQuery(GET_TICKETS, {
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true
  });

  if (loading) return { loading, tickets: [], error };
  return { tickets: data?.tickets || [], loading, error };
};
