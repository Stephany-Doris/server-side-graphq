const { ApolloServer } = require("apollo-server");
const resolvers = require("./resolvers");
const { buildSchemas, remoteServices } = require("./schema");
const { stitchSchemas } = require("@graphql-tools/stitch");
const { UrlLoader } = require("@graphql-tools/url-loader");
const { mergeSchemas } = require("@graphql-tools/schema");
const { loadSchema } = require("@graphql-tools/load");

// some mock data to be returned when one makes a query
let movies = [
  {
    id: 01,
    name: "Hangover",
    genre: "COMEDY",
    year: 2007,
  },
  {
    id: 02,
    name: "Wrong Turn",
    genre: "HORROR",
    year: 2003,
  },
  {
    id: 03,
    name: "Interstellar",
    genre: "DRAMA",
    year: 2014,
  },
];

let series = [
  {
    id: 01,
    name: "The Office",
    genre: "COMEDY",
    yearsRunning: 9,
  },
  {
    id: 02,
    name: "The walking dead",
    genre: "HORROR",
    yearsRunning: 10,
  },
  {
    id: 03,
    name: "Black Money love",
    genre: "DRAMA",
    yearsRunning: 2,
  },
];

async function main() {
  /**
     * load from endpoint
        const schema = await loadSchema("https://rickandmortyapi.com/graphql", {
          loaders: [new UrlLoader()],
        });

     * merge our local schema with the rick and morty schema.
        const mergedSchema = mergeSchemas({
          schemas: [schema],
          typeDefs,
          resolvers,
        });
  */

  const remoteSchemasConfig = await buildSchemas(remoteServices);
  const gatewaySchema = stitchSchemas({
    subschemas: remoteSchemasConfig,
  });

  const server = new ApolloServer({
    schema: gatewaySchema,
    context: () => ({
      data: { movies, series },
    }),
  });

  server.listen().then(({ port }) => console.log(`🚀 Server ready at ${port}`));
}
main();
