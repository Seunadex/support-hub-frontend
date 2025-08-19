import { gql, useMutation } from "@apollo/client";
import { GET_TICKET } from "@/graphql/queries/getTicket";

const ADD_COMMENT = gql`
  mutation AddComment($ticketId: String!, $body: String!) {
    addComment(input: { ticketId: $ticketId, body: $body }) {
      ticket {
        id
        comments {
          id
          body
          createdAt
          author {
            id
            fullName
            email
          }
        }
      }
    }
  }
`;

export const useAddComment = (ticketId, body, callbackAction) => {
  const [addComment, { loading }] = useMutation(ADD_COMMENT, {
    onCompleted: (data) => {
      callbackAction(data);
    },
    variables: { ticketId, body },
    refetchQueries: [{ query: GET_TICKET, variables: { id: ticketId } }],
  });

  return { addComment, loading };
};
