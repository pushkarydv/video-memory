import fs from 'fs';
import { convert_youtube_video_to_text } from './video-to-text.js';
import { add_or_update_vectors } from './vector-database.js';
import { convert_text_to_embeedings } from './text-to-embeedings.js';

/**
 * Trains on videos by processing them in parallel with a concurrency limit.
 * Reads video URLs from training-video-urls.json, converts each video to text,
 * generates embeddings from the text, and stores them in the vector database.
 *
 * @returns {Promise<void>} - A promise that resolves when all videos are processed.
 * Tracks analytics including total videos and successfully processed videos.
 */
const train_on_videos = async () => {
  const trainingVideoUrls = JSON.parse(
    fs.readFileSync('./training-video-urls.json', 'utf8')
  );

  const analytics = {
    totalVideos: trainingVideoUrls.length,
    videosProcessed: 0,
  };

  const videoProcessingPromises = trainingVideoUrls.map(async (videoUrl) => {
    try {
      const video_summary = await convert_youtube_video_to_text(videoUrl);
      const video_summary_embeedings = await convert_text_to_embeedings(
        video_summary
      );

      // saving to vector db
      const res = await add_or_update_vectors({
        id: `youtube-${videoUrl}`,
        vectors_array: video_summary_embeedings,
        namespace_id: 'youtube-videos',
        metadata: {
          url: videoUrl,
        },
      });

      if (res === true) {
        analytics.videosProcessed += 1;
      }
      console.log(
        `${analytics.videosProcessed} of ${analytics.totalVideos} videos processed`
      );
    } catch (error) {
      console.error(`Error processing video ${videoUrl}:`, error);
    }
  });

  // Process videos in parallel with a concurrency limit of 10
  const concurrencyLimit = 10;
  for (let i = 0; i < videoProcessingPromises.length; i += concurrencyLimit) {
    await Promise.all(videoProcessingPromises.slice(i, i + concurrencyLimit));
  }
};

train_on_videos();
