import verifyUser from '../../controllers/verifyUser';

export const resolvers = {
  Mutation: {
    verifyUser: async (_, { input: { id } }) => {
      const isUserVerified = await verifyUser({ id });
      return { isUserVerified };
    },
  },
};
