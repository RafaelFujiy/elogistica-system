import React, { useState } from 'react';
import { Search, Truck, CheckCircle2, Clock, AlertCircle, ShieldCheck } from 'lucide-react';

interface Checkpoint {
  location_name: string;
  status_update: string;
  timestamp: string;
}

interface TrackingData {
  trackingCode: string;
  recipient: string;
  destination: string;
  currentStatus: string;
  assignedVehicle: string;
  history: Checkpoint[];
}

export default function App() {
  const [trackingCode, setTrackingCode] = useState('BR123456789BR');
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingCode.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`http://localhost:3000/api/v1/tracking/${trackingCode.trim()}`);
      if (!response.ok) {
        throw new Error('Código de rastreamento não localizado na base de dados.');
      }
      const result: TrackingData = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'Falha ao conectar com o servidor da API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between font-sans">
      
      {/* Header Institucional */}
      <header className="w-full border-b border-slate-800 bg-slate-950/60 backdrop-blur px-6 py-6" role="banner">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl">
              <Truck className="w-8 h-8 text-blue-400" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Ceregati E-Logística</h1>
              <p className="text-sm text-slate-400">Sistema Distribuído de Rastreamento de Cargas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-xs bg-slate-800/80 px-4 py-2 rounded-full border border-slate-700 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span>Conformidade LGPD & Acessibilidade WCAG</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Central */}
      <main className="max-w-5xl w-full mx-auto px-6 py-12 flex-1 flex flex-col gap-8" role="main">
        
        {/* Card de Busca */}
        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-2">
            Rastrear Encomenda ou Carga Rodoviária
          </h2>
          <p className="text-sm text-slate-400 mb-6">
            Informe o identificador da remessa para consultar o trajeto em tempo real:
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                id="tracking-input"
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Ex: BR123456789BR"
                className="w-full px-5 py-4 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-mono text-base uppercase"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              <Search className="w-5 h-5" aria-hidden="true" />
              <span>{loading ? 'Consultando...' : 'Consultar'}</span>
            </button>
          </form>
        </section>

        {/* Alerta de Erro */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl flex items-center gap-4 text-red-300">
            <AlertCircle className="w-6 h-6 text-red-400 shrink-0" />
            <div>
              <p className="font-semibold text-red-200">Não foi possível carregar os dados</p>
              <p className="text-sm text-red-400 mt-0.5">{error} (Verifique se o backend está ativo na porta 3000)</p>
            </div>
          </div>
        )}

        {/* Painel com Dados do Rastreio */}
        {data && (
          <section className="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-xl animate-fade-in">
            {/* Cabeçalho do Rastreio */}
            <div className="bg-slate-800 px-8 py-6 border-b border-slate-700 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">Código da Carga</span>
                <h3 className="text-2xl font-mono font-bold text-white tracking-wide">{data.trackingCode}</h3>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span>{data.currentStatus}</span>
              </div>
            </div>

            {/* Metadados */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 border-b border-slate-700/60 bg-slate-900/30">
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase">Destinatário</span>
                <p className="text-base font-semibold text-slate-200 mt-1">{data.recipient}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase">Destino Final</span>
                <p className="text-base font-semibold text-slate-200 mt-1">{data.destination}</p>
              </div>
              <div>
                <span className="text-xs font-medium text-slate-400 uppercase">Veículo / Frota</span>
                <p className="text-base font-semibold text-slate-200 mt-1">{data.assignedVehicle}</p>
              </div>
            </div>

            {/* Linha do Tempo / Checkpoints */}
            <div className="p-8">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-8 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Histórico de Movimentação em Tempo Real
              </h4>

              <div className="relative border-l-2 border-slate-700 ml-4 pl-8 space-y-8">
                {data.history.map((cp, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-blue-500 ring-4 ring-slate-800" />
                    <time className="text-xs text-blue-400 font-mono font-medium">
                      {new Date(cp.timestamp).toLocaleString('pt-BR')}
                    </time>
                    <h5 className="text-base font-bold text-white mt-1">{cp.location_name}</h5>
                    <p className="text-sm text-slate-400 mt-0.5">{cp.status_update}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950/40" role="contentinfo">
        <p>Projeto Integrado Multidisciplinar (PIM III) — UNIP | Análise e Desenvolvimento de Sistemas[cite: 3]</p>
      </footer>
    </div>
  );
}