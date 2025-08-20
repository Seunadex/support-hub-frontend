import { gql, useQuery } from "@apollo/client";

export const GET_CURRENT_USER = gql`
  query getCurrentUser {
    currentUser {
      id
      firstName
      lastName
      fullName
      role
      email
    }
  }
`

export const useFetchUser = (id) => {
  const { loading, data, networkStatus } = useQuery(GET_CURRENT_USER, {
    variables: {
      id,
    },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true
  });

  if(loading) {
    return {
      loading,
      data,
      networkStatus
    }
  }

  return {
    loading,
    data,
    networkStatus
  }
}