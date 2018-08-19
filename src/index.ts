import { GraphQLServer } from 'graphql-yoga';
import { resolvers } from './resolvers';
import db from './database/db';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: (data) => ({
    ...data,
    db
  })
});

server.start({
  port: 4000,
  endpoint: '/graphql',
  playground: '/graphql',
},() => {
  console.log('Server is running!');
});