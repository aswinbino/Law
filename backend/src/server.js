const express = require('express');
const cors = require('cors');
require('dotenv').config();

const chatRoutes = require('./routes/chatRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/chat', chatRoutes);

app.get('/health', (req, res) => res.json({ status: 'OK', location: 'India', timestamp: new Date() }));

app.listen(PORT, () => {
  console.log(`JurisBot India Backend running on port ${PORT}`);
});
