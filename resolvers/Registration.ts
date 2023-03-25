import { registerUser } from '../../controllers/registration';
export const resolvers = {
  Mutation: {
    registerUser: async (_, { input: { email, first_name, last_name, password, token } }) => {
      const isUserRegistered = await registerUser({ email, first_name, last_name, password }, token);
      return isUserRegistered;
    },
  },
};
