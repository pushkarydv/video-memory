# video-memory

![Content](https://github.com/user-attachments/assets/b81b0ed9-7259-40bb-b8b4-7414342c1718)

Video memory remembers moments of videos form millions of these and can directly search for any video from a single moment.

Demo: [https://youtu.be/R879Hv9cKco](https://youtu.be/R879Hv9cKco)

## How it works?

### Training part

- video is breaken to text via gemini in "en"
- text is converted to vectors via text-embeeding-3-small
- vectors are stored in upstash with video url in metadata

### Queriying part

- convert prompt to english
- convert english prompt to vectors
- do similarity search with upstash vectors and get video url from best match


## Using the same repo

- fork this repo and add the env variables
- provide your videl urls in `training-video-urls.json` and simply run the training action.

## Where this came from?

Few months back i created [memory-in-images.vercel.app](https://memory-in-images.vercel.app), a approach to find any image from millions from text prompt, and that provided a base to build this. 
