import { config } from 'dotenv';
import OpenAI from 'openai';

config();

/**
 * Converts a given text into embeddings using OpenAI's API.
 *
 * @param {string} text - The input text to be converted into embeddings.
 * @returns {Promise<number[]>} - A promise that resolves to an array of embedding values.
 * If an error occurs, it returns an empty array.
 */
export const convert_text_to_embeedings = async (text) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const embedding = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
      encoding_format: 'float',
      dimensions: 1536,
    });

    // keeping sure the content is not too much in summary so that a single vector based object is generated rather then multiple objects
    return embedding.data[0].embedding;
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
};

// convert_text_to_embeedings('hello world');
