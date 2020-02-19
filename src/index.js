const { GraphQLServer } = require("graphql-yoga");

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
    feed: () => links
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      };
      links.push(link);
      return link;
    },
    editPost: (parent, args) => {
      const { id, url, description } = args;
      let editedLink = null;
      links.forEach(link => {
        if (link.id === id) {
          if (url) {
            link.url = url;
          }
          if (description) {
            link.description = description;
          }
        }
        editedLink = link;
        return;
      });
      return editedLink;
    },
    deletePost: (parent, args) => {
      const { id } = args;
      let deletedLink = null;
      links = links.filter(link => {
        if (link.id === id) {
          deletedLink = link;
          return false;
        } else {
          return true;
        }
      });
      return deletedLink;
    }
  }
};

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

server.start(() => console.log("Serving up on port 4000!"));
