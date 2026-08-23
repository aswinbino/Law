const { OpenAIEmbeddings } = require('@langchain/openai');
const { PineconeStore } = require('@langchain/pinecone');
const { getPineconeIndex } = require('../config/pinecone');
const legalData = require('../data/indian_legal_fines.json');
require('dotenv').config();

async function seed() {
  console.log('Seeding Pinecone Vector Database with Indian Legal Fine Data...');

  const docs = legalData.map((item) => ({
    pageContent: `Act/Section: ${item.act_or_section}. Title: ${item.title}. Category: ${item.category}. Fine Amount: ${item.baseFine}. Description: ${item.description}`,
    metadata: {
      id: item.id,
      statute: item.act_or_section,
      title: item.title,
      fine: item.baseFine,
    },
  }));

  const embeddings = new OpenAIEmbeddings({
    modelName: 'text-embedding-3-small',
  });

  const pineconeIndex = getPineconeIndex();

  await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
  });

  console.log('Indian Vector Database Successfully Seeded!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Failed to seed DB:', err);
  process.exit(1);
});
