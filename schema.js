const { gql } = require("apollo-server");
const { UrlLoader } = require("@graphql-tools/url-loader");
const { mergeSchemas } = require("@graphql-tools/schema");
const { loadSchema } = require("@graphql-tools/load");
const { fetch } = require("@whatwg-node/fetch");
const { print } = require("graphql");

/**
 * Type Definitions for our Schema using the SDL.
 */

const typeDefs = gql`
  # create an enum type for genres field
  enum Genre {
    HORROR
    COMEDY
    DRAMA
  }

  # create an interface for the common fields between the movies and series type
  interface MovieGenre {
    name: String!
    genre: Genre
  }

  type Movie implements MovieGenre {
    id: ID!
    name: String!
    genre: Genre
    year: Int
  }

  input MovieInput {
    id: Int!
    name: String!
    genre: Genre!
    year: String!
  }

  input NewMovieInput {
    id: Int!
    name: String!
    genre: Genre!
    year: String!
  }

  type Series implements MovieGenre {
    id: ID!
    name: String!
    genre: Genre
    yearsRunning: Int
  }

  type Query {
    """
    Movies Query should not return null
    """
    movies(input: MovieInput): [Movie]!
    #query a single movie by passing name or id as a filter
    movie(input: MovieInput!): Movie
    series: [Series]!

    # tvshows can return either series or movies
    tvShows: [MovieGenre!]!
  }

  type Mutation {
    addMovie(input: NewMovieInput!): Movie
  }
`;

// function remoteExecutor returns an async function
const remoteExecutor =
  (url) =>
  async ({ document, variables }) => {
    const query = print(document);
    const fetchResult = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });
    return fetchResult.json();
  };

const remoteServices = [
  { name: "Rick and Morty 🔥", url: "https://rickandmortyapi.com/graphql" },
  {
    name: "spaceX",
    url: "https://api.spacex.land/graphql",
  },
];

const buildSchemas = async (services) => {
  const urlLoader = new UrlLoader();
  return Promise.all(
    services.map(async ({ url }) => {
      const schema = await loadSchema(url, {
        loaders: [urlLoader],
      });
      const schemaConfig = {
        schema,
        executor: remoteExecutor(url),
      };
      return schemaConfig;
    })
  );
};

module.exports = { typeDefs, buildSchemas, remoteServices };
