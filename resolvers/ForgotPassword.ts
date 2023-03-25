import { emailExist, changePassword, verifyToken } from '../../controllers/forgotPassword';
export const resolvers = {
  Query: {
    EmailExist: async (_, { email }) => {
      const isEmailexist = await emailExist({ email });
      return { isEmailexist };
    },
  },

  Mutation: {
    changePassword: async (_, { input: { token, password } }) => {
      const isPasswordChanged = await changePassword({ password }, token);
      return { isPasswordChanged };
    },
    verifyToken: async (_, { token }) => {
      const isVerified = await verifyToken(token);
      return { isVerified };
    },
  },
};
