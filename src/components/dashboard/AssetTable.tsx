import { usePermissions } from '../../hooks/usePermissions';
import type { SystemAsset } from '../../types/assets.types';

interface AssetTableProps {
  assets: SystemAsset[];
  onEdit: (asset: SystemAsset) => void;
  onDelete: (id: string) => void;
}

export function AssetTable({ assets, onEdit, onDelete }: AssetTableProps) {
  const { isAdmin } = usePermissions();

  const getStatusClass = (status: SystemAsset['status']) => {
    switch (status) {
      case 'Active':
        return 'badge--status-active';
      case 'Maintenance':
        return 'badge--status-maintenance';
      case 'Offline':
        return 'badge--status-offline';
      default:
        return '';
    }
  };

  const getCriticalityClass = (crit: SystemAsset['criticality']) => {
    switch (crit) {
      case 'Low':
        return 'badge--crit-low';
      case 'Medium':
        return 'badge--crit-medium';
      case 'High':
        return 'badge--crit-high';
      case 'Critical':
        return 'badge--crit-critical';
      default:
        return '';
    }
  };

  const translateCategory = (cat: SystemAsset['category']) => {
    const map: Record<SystemAsset['category'], string> = {
      Server: 'Servidor',
      Workstation: 'Estación de Trabajo',
      Database: 'Base de Datos',
      Network: 'Red',
    };
    return map[cat] || cat;
  };

  const translateStatus = (stat: SystemAsset['status']) => {
    const map: Record<SystemAsset['status'], string> = {
      Active: 'Activo',
      Maintenance: 'Mantenimiento',
      Offline: 'Fuera de línea',
    };
    return map[stat] || stat;
  };

  const translateCriticality = (crit: SystemAsset['criticality']) => {
    const map: Record<SystemAsset['criticality'], string> = {
      Low: 'Baja',
      Medium: 'Media',
      High: 'Alta',
      Critical: 'Crítica',
    };
    return map[crit] || crit;
  };

  if (assets.length === 0) {
    return (
      <div className="empty-state" role="status">
        <div className="empty-state__icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </div>
        <h3 className="empty-state__title">No se encontraron activos</h3>
        <p className="empty-state__message">
          Intenta ajustar los términos de búsqueda o los filtros.
        </p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col">Nombre del Activo</th>
            <th scope="col">Dirección IP</th>
            <th scope="col">Categoría</th>
            <th scope="col">Estado</th>
            <th scope="col">Criticidad</th>
            <th scope="col">Última Inspección</th>
            {isAdmin && <th scope="col" className="text-right">Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => (
            <tr key={asset.id} className="data-table__row">
              <td className="data-table__cell data-table__cell--bold">
                {asset.name}
              </td>
              <td className="data-table__cell data-table__cell--mono">
                {asset.ip_address}
              </td>
              <td className="data-table__cell">
                {translateCategory(asset.category)}
              </td>
              <td className="data-table__cell">
                <span className={`badge ${getStatusClass(asset.status)}`}>
                  {translateStatus(asset.status)}
                </span>
              </td>
              <td className="data-table__cell">
                <span className={`badge ${getCriticalityClass(asset.criticality)}`}>
                  {translateCriticality(asset.criticality)}
                </span>
              </td>
              <td className="data-table__cell text-muted">
                {asset.last_inspected}
              </td>
              {isAdmin && (
                <td className="data-table__cell text-right">
                  <div className="table-actions">
                    <button
                      type="button"
                      className="table-btn table-btn--edit"
                      onClick={() => onEdit(asset)}
                      aria-label={`Editar ${asset.name}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="table-btn table-btn--danger"
                      onClick={() => onDelete(asset.id)}
                      aria-label={`Eliminar ${asset.name}`}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
