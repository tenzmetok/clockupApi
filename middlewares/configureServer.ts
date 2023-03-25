import { formatError } from 'apollo-errors';
import { applyMiddleware } from 'graphql-middleware';

const configureServer = ({ middleware = [], ...config }) => {
  if (config.schema) {
    if (middleware.length > 0) {
      config.schema = applyMiddleware(config.schema, ...middleware);
    }
  }
  return {
    introspection: true, // enables introspection of the schema
    playground: true,
    debug: true,
    formatError,
    ...config,
  };
};

export default configureServer;
