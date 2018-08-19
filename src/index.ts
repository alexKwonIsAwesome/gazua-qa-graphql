import { GraphQLServer } from 'graphql-yoga';
import { resolvers } from './resolvers';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers
});

server.start({
  port: 4000,
  endpoint: '/graphql',
  playground: '/graphql',
},() => {
  console.log('Server is running!');
});