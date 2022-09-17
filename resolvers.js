/*
 * define some methods to filter data based on arguments passed
 */

// get single value
const getSingleRecord = (data, value) => {
  return data.find(({ id, name }) => value.name === name || value.id === id);
};

// filter multiple records
const filterRecords = (data, value) => {
  return data.filter(
    ({ genre, name }) => value.genre === genre || value.name === name
  );
};

// add new record to data
const createRecord = (data, input) => {
  return data.push(input);
};

const resolvers = {
  Query: {
    movies(_, { input }, context) {
      if (input) {
        return filterRecords(context.data.movies, input);
      }
      return context.data.movies;
    },
    movie(_, { input }) {
      return getSingleRecord(context.data.movies, input);
    },
    series(_, __, context) {
      return context.data.series;
    },
    tvShows(_, __, context) {
      const data = context.data.movies.concat(context.data.series);
      return data;
    },
  },
  Mutation: {
    addMovie(_, { input }, context) {
      createRecord(context.data.movies, input);
      return input;
    },
  },
  // resolver for our interface
  MovieGenre: {
    __resolveType(parent) {
      // check if parent.yearsRunning, return the type Series
      if (parent.yearsRunning) {
        return "Series";
      }

      return "Movie";
    },
  },
};

module.exports = resolvers;
