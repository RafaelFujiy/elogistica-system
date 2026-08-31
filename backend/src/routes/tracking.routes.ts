import { Router } from 'express';
import { TrackingController } from '../controllers/tracking.controller';

const trackingRoutes = Router();
const controller = new TrackingController();

// GET: Consulta status por codigo de rastreamento
trackingRoutes.get('/tracking/:code', (req, res) => {
  controller.getTrackingByCode(req, res);
});

// POST: Registro de nova movimentacao de carga
trackingRoutes.post('/tracking/checkpoint', (req, res) => {
  controller.addCheckpoint(req, res);
});

export { trackingRoutes };