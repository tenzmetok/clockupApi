import { AuthenticationError } from 'apollo-server-express';

const authCheck =
  (disableAuth = []) =>
  async (resolve, root, args, context, info) => {
    const authDisabled = ['_service', ...disableAuth].includes(info.fieldName);
    if (!authDisabled && !context) {
      throw new AuthenticationError('Request unAuthorized');
    }
    if (!authDisabled && !context.user) {
      throw new AuthenticationError('Request unAuthorized');
    }
    const result = await resolve(root, args, context, info);
    return result;
  };

export default disableAuth => ({
  Query: authCheck(disableAuth),
  Mutation: authCheck(disableAuth),
});
