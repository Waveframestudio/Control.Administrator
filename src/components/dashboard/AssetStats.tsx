import { memo } from 'react';
import type { AssetStatsData } from '../../types/assets.types';

interface AssetStatsProps {
  stats: AssetStatsData;
}

export const AssetStats = memo(function AssetStats({ stats }: AssetStatsProps) {
  return (
    <section className="dashboard__stats" aria-label="Estadísticas de Clientes">
      {/* Total de clientes */}
      <div className="stat-card stat-card--accent">
        <div className="stat-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div className="stat-card__info">
          <p className="stat-card__label">Total de clientes</p>
          <p className="stat-card__value">{stats.total}</p>
          <p className="stat-card__trend">Clientes registrados</p>
        </div>
      </div>

      {/* Total en proceso */}
      <div className="stat-card stat-card--success">
        <div className="stat-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div className="stat-card__info">
          <p className="stat-card__label">Total en proceso</p>
          <p className="stat-card__value">{stats.active}</p>
          <p className="stat-card__trend text-success">En producción</p>
        </div>
      </div>

      {/* Total finalizados */}
      <div className="stat-card stat-card--warning">
        <div className="stat-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        </div>
        <div className="stat-card__info">
          <p className="stat-card__label">Total finalizados</p>
          <p className="stat-card__value">{stats.maintenance}</p>
          <p className="stat-card__trend text-warning">Listos para entrega</p>
        </div>
      </div>

      {/* Total entregados */}
      <div className="stat-card stat-card--danger">
        <div className="stat-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <div className="stat-card__info">
          <p className="stat-card__label">Total entregados</p>
          <p className="stat-card__value">{stats.offline}</p>
          <p className="stat-card__trend text-danger">Enviados a clientes</p>
        </div>
      </div>
    </section>
  );
});
