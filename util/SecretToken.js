import { config } from "dotenv";
import jwt from "jsonwebtoken";

config();

const MINUTES = 60;

/**
 * Creates a secret token using the provided id.
 * @param {string} id - The id to be included in the token payload.
 * @returns {string} - The generated secret token using the provided id, secret key and expiration time.
 */
export function createSecretToken(id) {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: MINUTES * 60,
  });
}
