import type { AssetStatsData } from '../../types/assets.types';

interface AssetStatsProps {
  stats: AssetStatsData;
}

export function AssetStats({ stats }: AssetStatsProps) {
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
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
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
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
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
}
