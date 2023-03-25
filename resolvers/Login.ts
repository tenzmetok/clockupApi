import { login } from '../../controllers/login';
export const resolvers = {
  Query: {
    Login: async (_, { email, password }) => {
      const loginResponse = await login({ email, password });
      return loginResponse;
    },
    userByToken: async (_, {}, ctx) => {
      const isAuthenticated = ctx.user ? true : false;
      if (isAuthenticated) {
        ctx.user.isAuthenticated = isAuthenticated;
        return { user: ctx.user };
      } else {
        return { isAuthenticated: false };
      }
    },
  },
};
