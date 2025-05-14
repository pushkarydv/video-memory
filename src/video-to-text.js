import { config } from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

config();

/**
 * Converts a YouTube video to a text summary using generative AI.
 * @param {string} url - The URL of the YouTube video to be summarized.
 * @param {string} detail_level - The detail level of the summary values can be `low`, `medium`, `high`
 * @returns {Promise<string>} A promise that resolves to the generated summary text.
 *                            Returns an empty string if an error occurs.
 */
export const convert_youtube_video_to_text = async (url, detail_level = 'medium') => {
  /**
   * not just a simple video summary but with gemini this would be based on what are video moments such as person moving.
   * there are a few more ways i thought of but didn;t implement them
   * 1. youtube transcript to summary directly
   * 2. youtube voice to custom transcript and then [1]
   * 3. youtube video to frame based content extraction with a gap of 2s in each frame taken and then [1] or [2]
   * */

  try {
    // google generative ai clients: video features extraction and summarization
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = {
      low: 'Please provide a brief overview of the video, strictly keeping it between more then 50 and less then 200 words. Focus on main points only. The output should contain only the summary and no other information.',
      medium: 'Please provide a concise summary of the video, strictly keeping it between more then 200 and less then 500 words. Include key points and important details. The output should contain only the summary and no other information.',
      high: 'Please provide a detailed summary of the video, strictly keeping it between more then 500 and less then 1000 words. Include comprehensive analysis, key points, and supporting details. The output should contain only the summary and no other information.'
    }[detail_level] + " Output should be in english despite the video being in a different language.";

    
    if (!prompt) {
      throw new Error('Invalid detail level');
    }

    const result = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri: url,
        },
      },
    ]);
    console.log(result.response.text());

    return result.response.text();
  } catch (error) {
    console.error('Error:', error);
    return '';
  }
};

// convert_youtube_video_to_text('https://youtu.be/-Ny7XJNuzAs');