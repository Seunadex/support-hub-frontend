import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";

// const httpLink = createHttpLink({
//   uri: "http://localhost:3000/graphql",
// });

// const authLink = setContext((_, { headers }) => {
//   const token = Cookies.get("auth_token");

//   return {
//     headers: {
//       ...headers,
//       authorization: token ? `Bearer ${token}` : "",
//     },
//   };
// });

// const errorLink = onError(({ graphQLErrors, networkError }) => {
//   if (graphQLErrors) {
//     graphQLErrors.forEach(({ message, locations, path }) =>
//       console.log(
//         `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
//       )
//     );
//   }

//   if (networkError) {
//     console.log(`[Network error]: ${networkError}`);
//   }
// });

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

export default client;


// const client = new ApolloClient({
//   uri: import.meta.env.VITE_GRAPHQL_ENDPOINT,
//   cache: new InMemoryCache(),
// });

