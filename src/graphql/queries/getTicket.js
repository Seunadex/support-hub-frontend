import { gql, useQuery } from "@apollo/client";

export const GET_TICKET = gql`
  query GetTicket($id: ID!) {
    ticket(id: $id) {
      id
      title
      description
      number
      status
      priority
      createdAt
      category
      agentHasReplied
      customer {
        id
        firstName
        lastName
        role
      }
      assignedTo {
        id
        fullName
        email
      }
      firstResponseAt
      attachments {
        id
        filename
        url
      }
      comments {
        id
        body
        createdAt
        author {
          id
          fullName
          role
          email
        }
      }
    }
  }
`;

export const useGetTicket = (id) => {
  const { loading, error, data } = useQuery(GET_TICKET, {
    variables: { id },
    notifyOnNetworkStatusChange: true
  });

  return {
    loading,
    error,
    ticket: data?.ticket,
  };
};
