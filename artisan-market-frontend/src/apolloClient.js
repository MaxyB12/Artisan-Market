import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: 'http://localhost:5001/graphql', // Make sure this matches your backend GraphQL endpoint
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default client;