import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import express from 'express';
import resolvers from '../graphql/resolvers';
import config from '../config';
import helmet from 'helmet';
import typeDefs from '../graphql/schemas';
import { graphqlUploadExpress } from 'graphql-upload';
import { getUser } from '../controllers/login';
import { configureServer, authMiddleware } from '../middlewares';
import { verifyJWT } from '../services/jwtVerify';

const schema = makeExecutableSchema({ typeDefs, resolvers });
const disableAuth = [
  'Login',
  'registerUser',
  'isRegistered',
  'verifyEmail',
  'EmailExist',
  'changePassword',
  'verifyToken',
];

export default async ({ app }: { app: express.Application }) => {
  if (config.env !== 'local') {
    app.use(
      helmet.hsts({
        maxAge: 63072000,
        preload: true,
      })
    );
    app.use(helmet());
  }
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(graphqlUploadExpress({}));
  const serverConfig: any = configureServer({
    schema,
    basePath: config.api && config.api.prefix ? config.api.prefix : '',
    middleware: [authMiddleware(disableAuth)],
    context: async ({ req }) => {
      try {
        const { authorizer, authorization } = req.headers;
        let authByJWT = false;

        // if authorizer attached with request
        if (authorizer) {
          const authContext = JSON.parse(authorizer);
          if (authContext.active && authContext.userId) {
            authByJWT = authContext.userId;
          }
        }
        // if authorization token attached with request
        else if (authorization) {
          const verify = await verifyJWT(authorization);
          authByJWT = verify.id;
        }

        // set context if request authorized
        if (authByJWT) {
          const user = await getUser(authByJWT);
          return { user };
        }
        return authByJWT;
      } catch (error) {
        console.error('Error while setting context of user', error);
        throw error;
      }
    },
    uploads: false,
  });

  const graphQL = new ApolloServer(serverConfig);
  graphQL.applyMiddleware({ app, path: '/graphql' });

  // error handlers
  app.use((err, req, res, next) => {
    /**
     * Handle 401 thrown by express-jwt library
     */
    if (err.name === 'UnauthorizedError') {
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });

  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
