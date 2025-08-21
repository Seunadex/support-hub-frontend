import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Cookies from "js-cookie";
import { createUploadLink } from "apollo-upload-client";

const httpLink = createUploadLink({
  uri: `${import.meta.env.VITE_BASE_URL}/graphql`
});

const authLink = setContext((_, { headers }) => {
  const token = Cookies.get("auth_token");

  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  credentials: "include",
});

export default client;
