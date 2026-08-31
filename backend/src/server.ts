import express from 'express';
import cors from 'cors';
import { trackingRoutes } from './routes/tracking.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas da API
app.use('/api/v1', trackingRoutes);

// Health Check (Rota de verificacao de integridade do servico)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Ceregati Logistics API', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`[CEREGATI E-LOGISTICA] API em execucao na porta ${PORT}`);
  console.log(`Endpoints disponiveis:`);
  console.log(`- GET  http://localhost:${PORT}/api/v1/tracking/:code`);
  console.log(`- POST http://localhost:${PORT}/api/v1/tracking/checkpoint`);
  console.log(`=======================================================`);
});