import verifyEmail from '../../controllers/verifyEmail';

export const resolvers = {
  Mutation: {
    verifyEmail: async (_, { input: { token } }) => {
      const isEmailVerified = await verifyEmail({ token });
      return { isEmailVerified };
    },
  },
};
