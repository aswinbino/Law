const { OpenAIEmbeddings, ChatOpenAI } = require('@langchain/openai');
const { PineconeStore } = require('@langchain/pinecone');
const { getPineconeIndex } = require('../config/pinecone');
const legalData = require('../data/indian_legal_fines.json');

exports.handleQuery = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message field is required.' });
    }

    let retrievedDocs = [];
    try {
      const embeddings = new OpenAIEmbeddings({ modelName: 'text-embedding-3-small' });
      const pineconeIndex = getPineconeIndex();

      // 1. Vector Search for Relevant Indian Acts & Sections
      const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex,
      });
      
      retrievedDocs = await vectorStore.similaritySearch(message, 3);
    } catch (vecErr) {
      console.warn('[Pinecone Search Fallback] Using structured legal JSON matcher:', vecErr.message);
    }

    // Local grounded fallback if Pinecone search returned empty or encountered an error
    if (!retrievedDocs || retrievedDocs.length === 0) {
      const msgLower = message.toLowerCase();
      const matched = legalData.filter(item => 
        item.title.toLowerCase().includes(msgLower) ||
        item.act_or_section.toLowerCase().includes(msgLower) ||
        item.description.toLowerCase().includes(msgLower) ||
        (msgLower.includes('helmet') && item.id === 'statute_001') ||
        (msgLower.includes('license') && item.id === 'statute_002') ||
        (msgLower.includes('licence') && item.id === 'statute_002') ||
        (msgLower.includes('drunk') && item.id === 'statute_003') ||
        (msgLower.includes('puc') && item.id === 'statute_004') ||
        (msgLower.includes('nuisance') && item.id === 'statute_005') ||
        (msgLower.includes('theft') && item.id === 'statute_006')
      );
      const selected = matched.length > 0 ? matched : legalData.slice(0, 3);
      retrievedDocs = selected.map(item => ({
        pageContent: `Act/Section: ${item.act_or_section}. Title: ${item.title}. Category: ${item.category}. Fine Amount: ${item.baseFine}. Description: ${item.description}`,
        metadata: {
          id: item.id,
          statute: item.act_or_section,
          title: item.title,
          fine: item.baseFine,
        }
      }));
    }

    const contextText = retrievedDocs.map((doc) => doc.pageContent).join('\n---\n');
    let answerText = '';

    // 2. Query OpenAI with Grounded Indian Context
    try {
      const model = new ChatOpenAI({ modelName: 'gpt-4o-mini', temperature: 0.2, maxRetries: 0 });

      const systemPrompt = `You are JurisBot India, an AI legal information assistant specializing in Indian Laws, the Motor Vehicles Act, Bharatiya Nyaya Sanhita (BNS 2023/2026), and municipal fine structures.
      Use the provided statutory context below to answer questions about legal fines clearly, concisely, and accurately in Indian Rupees (₹).
      Explicitly cite the relevant statutory act or section code (e.g., MV Act § 194D or BNS § 270) and fine amount when available.
      If the context does not explicitly contain the answer, state that you do not have that specific Indian statutory record on file.
      Always state that this information is for reference and does not constitute formal legal counsel from an Advocate or Bar Council member.
      
      STATUTORY CONTEXT:
      ${contextText}`;

      const response = await model.invoke([
        ['system', systemPrompt],
        ['user', message],
      ]);

      answerText = response.content;
    } catch (llmError) {
      console.warn('[LLM Fallback Active] Generating grounded statutory answer from local Indian Legal DB:', llmError.message);
      
      const topRecord = retrievedDocs[0]?.metadata || {};
      answerText = `According to official statutory records under **${topRecord.statute || 'Indian Statutory Law'}**, the provision for **${topRecord.title || 'this offence'}** attracts a fine of **${topRecord.fine || 'prescribed amount'}**.\n\n` +
        `**Details:** ${retrievedDocs[0]?.pageContent || 'Prescribed as per legal statutory code.'}\n\n` +
        `*Disclaimer: This information is for general reference and does not constitute formal legal counsel under the Advocates Act.*`;
    }

    return res.json({
      answer: answerText,
      sources: retrievedDocs.map((d) => d.metadata || {}),
    });
  } catch (error) {
    console.error('Error in chat controller:', error);
    return res.status(500).json({ error: 'Internal server error processing legal request.' });
  }
};
