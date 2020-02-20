const { GraphQLServer } = require("graphql-yoga");
const { prisma } = require("./generated/prisma-client");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL"
  }
];
let idCount = links.length;

const resolvers = {
  Query: {
    info: () => "This is the API of a Hackernews clone",
    feed: (root, args, context, info) => context.prisma.links()
  },
  Mutation: {
    post: (root, args, context) => {
      const { url, description } = args;
      return context.prisma.createLink({
        url,
        description
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: { prisma }
});

server.start(() => console.log("Serving up on port 4000!"));
