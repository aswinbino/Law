const { Pinecone } = require('@pinecone-database/pinecone');
require('dotenv').config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const getPineconeIndex = () => {
  return pinecone.Index(process.env.PINECONE_INDEX || 'indian-legal-fines-index');
};

module.exports = { pinecone, getPineconeIndex };
