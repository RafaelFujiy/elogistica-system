import { Request, Response } from 'express';
import { dbPool } from '../database';

export class TrackingController {
  // Metodo para consultar o status completo de um pacote
  public async getTrackingByCode(req: Request, res: Response): Promise<Response> {
    const { code } = req.params;

    try {
      // 1. Busca os dados do pacote e informacoes do veiculo associado
      const packageQuery = `
        SELECT 
          p.id,
          p.tracking_code,
          p.recipient_name,
          p.destination_city,
          p.status,
          v.model AS vehicle_model,
          v.plate AS vehicle_plate
        FROM packages p
        LEFT JOIN vehicles v ON p.vehicle_id = v.id
        WHERE p.tracking_code = $1;
      `;

      const packageResult = await dbPool.query(packageQuery, [code]);

      if (packageResult.rows.length === 0) {
        return res.status(404).json({ error: 'Codigo de rastreamento nao localizado.' });
      }

      const pkg = packageResult.rows[0];

      // 2. Busca o historico de movimentacoes (checkpoints)
      const checkpointsQuery = `
        SELECT location_name, status_update, timestamp
        FROM tracking_checkpoints
        WHERE package_id = $1
        ORDER BY timestamp ASC;
      `;

      const checkpointsResult = await dbPool.query(checkpointsQuery, [pkg.id]);

      // 3. Monta a resposta estruturada para o cliente
      return res.status(200).json({
        trackingCode: pkg.tracking_code,
        recipient: pkg.recipient_name,
        destination: pkg.destination_city,
        currentStatus: pkg.status,
        assignedVehicle: pkg.vehicle_model ? `${pkg.vehicle_model} (${pkg.vehicle_plate})` : 'Nao atribuido',
        history: checkpointsResult.rows,
      });
    } catch (error) {
      console.error('[API Error]: Erro ao consultar rastreamento:', error);
      return res.status(500).json({ error: 'Erro interno no servidor ao processar rastreamento.' });
    }
  }

  // Metodo para adicionar um novo ponto de movimentacao (usado pelo galpao/coletores)
  public async addCheckpoint(req: Request, res: Response): Promise<Response> {
    const { trackingCode, locationName, statusUpdate } = req.body;

    if (!trackingCode || !locationName || !statusUpdate) {
      return res.status(400).json({ error: 'Parametros invalidos. Forneca trackingCode, locationName e statusUpdate.' });
    }

    try {
      const packageResult = await dbPool.query('SELECT id FROM packages WHERE tracking_code = $1', [trackingCode]);

      if (packageResult.rows.length === 0) {
        return res.status(404).json({ error: 'Pacote nao encontrado para atualizacao.' });
      }

      const packageId = packageResult.rows[0].id;

      await dbPool.query(
        'INSERT INTO tracking_checkpoints (package_id, location_name, status_update) VALUES ($1, $2, $3)',
        [packageId, locationName, statusUpdate]
      );

      // Atualiza o status geral do pacote
      await dbPool.query('UPDATE packages SET status = $1 WHERE id = $2', [statusUpdate, packageId]);

      return res.status(201).json({ message: 'Checkpoint de rastreamento registrado com sucesso.' });
    } catch (error) {
      console.error('[API Error]: Erro ao registrar checkpoint:', error);
      return res.status(500).json({ error: 'Falha ao salvar atualizacao no banco de dados.' });
    }
  }
}