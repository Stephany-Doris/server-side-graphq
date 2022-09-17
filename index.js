const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({
    data: { movies, series },
  }),
});

server.listen().then(({ port }) => console.log(`🚀 Server ready at ${port}`));
