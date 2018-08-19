import { GraphQLServer } from 'graphql-yoga';

const typeDefs = `
  type Query {
    greet(name: String): String!
  }
`;

const resolvers = {
  Query: {
    greet(root, args, context, info) {
      return `Hello ${args.name}`
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });
server.start({
  port: 4000,
  endpoint: '/graphql',
  playground: '/graphql',
},() => {
  console.log('Server is running!');
});