export const resolvers = {
  Query: {
    greet(root, args, context, info) {
      return `Hello ${args.name}`
    }
  }
};