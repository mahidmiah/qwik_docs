import { Pinecone } from '@pinecone-database/pinecone';

export const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
});


// import { PinePineconeClientcone } from "@pinecone-database/pinecone";      

// export const getPineconeClient = async () => {
//   onst client = new PineconeClient()
//   await client.init({
//     apiKey: process.env.PINECONE_API_KEY!,
//     environment: 'gcp-starter',
//   })
//   return client
// }