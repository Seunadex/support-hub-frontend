import { gql, useMutation } from "@apollo/client";

const EXPORT_CLOSED_TICKETS = gql`
  mutation ExportClosedTickets($startDate: ISO8601DateTime!, $endDate: ISO8601DateTime!) {
    exportClosedTickets(input: { startDate: $startDate, endDate: $endDate }) {
      csvUrl
      filename
      count
      errors
    }
  }
`;

export const useExportClosedTickets = () => {
  const [exportClosedTickets, { loading, error }] = useMutation(
    EXPORT_CLOSED_TICKETS,
    {
      errorPolicy: "all",
    }
  );

  return {
    exportClosedTickets,
    isExporting: loading,
    error,
  };
};
