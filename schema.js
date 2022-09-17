const { gql } = require("apollo-server");

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

module.exports = typeDefs;
