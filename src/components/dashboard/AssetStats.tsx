import type { AssetStatsData } from '../../types/assets.types';

interface AssetStatsProps {
  stats: AssetStatsData;
}

export function AssetStats({ stats }: AssetStatsProps) {
  return (
    <section className="dashboard__stats" aria-label="Estadísticas de Activos">
      {/* Total Assets */}
      <div className="stat-card stat-card--accent">
        <div className="stat-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
        </div>
        <div className="stat-card__info">
          <p className="stat-card__label">Total de Activos</p>
          <p className="stat-card__value">{stats.total}</p>
          <p className="stat-card__trend">Sistemas monitoreados</p>
        </div>
      </div>

      {/* Active Assets */}
      <div className="stat-card stat-card--success">
        <div className="stat-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div className="stat-card__info">
          <p className="stat-card__label">Activos</p>
          <p className="stat-card__value">{stats.active}</p>
          <p className="stat-card__trend text-success">Operación saludable</p>
        </div>
      </div>

      {/* Maintenance Assets */}
      <div className="stat-card stat-card--warning">
        <div className="stat-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
          </svg>
        </div>
        <div className="stat-card__info">
          <p className="stat-card__label">En Mantenimiento</p>
          <p className="stat-card__value">{stats.maintenance}</p>
          <p className="stat-card__trend text-warning">Actualizaciones en curso</p>
        </div>
      </div>

      {/* Offline Assets */}
      <div className="stat-card stat-card--danger">
        <div className="stat-card__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <div className="stat-card__info">
          <p className="stat-card__label">Fuera de Línea</p>
          <p className="stat-card__value">{stats.offline}</p>
          <p className="stat-card__trend text-danger">Acción requerida</p>
        </div>
      </div>
    </section>
  );
}
