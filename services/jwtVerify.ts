import { AuthenticationError } from 'apollo-server-express';
import config from '../config';
const jwt = require('jsonwebtoken');

const verifyJWT = async token => {
  try {
    const match = token.match(/^Bearer (.*)$/);
    if (!match || match.length < 2) {
      throw new AuthenticationError(`Invalid Authorization token"`);
    }
    const jwtDecode = await jwt.verify(match[1], config.jwtSecret);
    return jwtDecode;
  } catch (err) {
    throw new AuthenticationError('Not Authenticated');
  }
};

export { verifyJWT };
