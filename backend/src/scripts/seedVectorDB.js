import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { OpenAIEmbeddings } from '@langchain/openai';
import { PineconeStore } from '@langchain/pinecone';
import { Document } from '@langchain/core/documents';
import { getPineconeIndex } from '../config/pinecone.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main seeding function to parse JSON legal data, create LangChain Documents,
 * generate OpenAI embeddings, and populate Pinecone Vector Store.
 */
async function seedVectorDB() {
  console.log('--- Starting Indian Legal Fines Vector DB Seeding ---');

  const openAIApiKey = process.env.OPENAI_API_KEY;
  const pineconeApiKey = process.env.PINECONE_API_KEY;

  if (!openAIApiKey || openAIApiKey === 'your_openai_api_key_here') {
    console.error('❌ Error: OPENAI_API_KEY is missing or invalid in .env!');
    console.log('Please configure your OPENAI_API_KEY in backend/.env before running seed.');
    process.exit(1);
  }

  if (!pineconeApiKey || pineconeApiKey === 'your_pinecone_api_key_here') {
    console.error('❌ Error: PINECONE_API_KEY is missing or invalid in .env!');
    console.log('Please configure your PINECONE_API_KEY in backend/.env before running seed.');
    process.exit(1);
  }

  const pineconeIndex = getPineconeIndex();
  if (!pineconeIndex) {
    console.error('❌ Error: Failed to connect to Pinecone Index.');
    process.exit(1);
  }

  try {
    // 1. Read JSON legal dataset
    const dataPath = path.join(__dirname, '../data/indian_legal_fines.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const legalRecords = JSON.parse(rawData);

    console.log(`📖 Loaded ${legalRecords.length} Indian legal fine records from local JSON database.`);

    // 2. Map records into LangChain Document format with rich legal context text
    const documents = legalRecords.map((record) => {
      const pageContent = `
Title: ${record.title}
Act / Section: ${record.act_or_section}
Category: ${record.category}
Base Fine / Penalty: ${record.baseFine}
Penalty Details: ${record.penaltyDetails}
Description: ${record.description}
      `.trim();

      return new Document({
        pageContent,
        metadata: {
          id: record.id,
          title: record.title,
          act_or_section: record.act_or_section,
          category: record.category,
          baseFine: record.baseFine,
          penaltyDetails: record.penaltyDetails,
        },
      });
    });

    console.log('🧠 Initializing OpenAIEmbeddings (text-embedding-3-small)...');
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: openAIApiKey,
      modelName: 'text-embedding-3-small',
    });

    console.log('🚀 Upserting vector embeddings into Pinecone Vector DB...');
    await PineconeStore.fromDocuments(documents, embeddings, {
      pineconeIndex: pineconeIndex,
      textKey: 'text',
    });

    console.log('✅ Successfully seeded Pinecone Vector DB with Indian Legal records!');
  } catch (error) {
    console.error('❌ Error during Pinecone vector seeding:', error);
    process.exit(1);
  }
}

seedVectorDB();
