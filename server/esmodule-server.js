import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ message: 'CarMax Server is running!', status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`🚀 CarMax Server Started!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
  console.log(`=================================`);
});
