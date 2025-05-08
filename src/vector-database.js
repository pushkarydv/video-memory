import { Index } from '@upstash/vector';
import { config } from 'dotenv';

config();

/**
 * Adds vectors to the vector database and if the vector already exists, it updates it.
 *
 * @param {Object} params - The parameters for adding vectors.
 * @param {string} params.id - The unique identifier for the vector.
 * @param {number[]} params.vectors_array - The array of vector values.
 * @param {string} [params.namespace_id='default'] - The namespace ID (default is 'default').
 * @param {Object} [params.metadata={}] - Additional metadata for the vector.
 * @returns {Promise<Object>} The response from the vector database.
 */
export const add_or_update_vectors = async ({
  id,
  vectors_array,
  namespace_id = 'default',
  metadata = {},
}) => {
  try {
    const index = new Index({
      url: process.env.UPSTASH_URL,
      token: process.env.UPSTASH_TOKEN,
    });

    const namespace = index.namespace(namespace_id);

    await namespace.upsert({
      id,
      vector: vectors_array,
      metadata,
    });
    
    return true;
  } catch (e) {
    console.error(`[ERROR] `, e);
    return false;
  }
};

/**
 * Queries the vector database for similar vectors.
 *
 * @param {number[]} vectors_array - The array of vector values to query.
 * @param {string} [namespace_id='default'] - The namespace ID (default is 'default').
 * @returns {Promise<Object[]>} The query results, or an empty array if an error occurs.
 */
export const get_query_results = async (
  vectors_array,
  namespace_id = 'default'
) => {
  try {
    const index = new Index({
      url: process.env.UPSTASH_URL,
      token: process.env.UPSTASH_TOKEN,
    });

    const namespace = index.namespace(namespace_id);

    const results = await namespace.query({
      vector: vectors_array,
      topK: 3,
    });

    return results || [];
  } catch (e) {
    console.error(`[ERROR] ${JSON.stringify(e, null, 2)}`);
    return [];
  }
};
