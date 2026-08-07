import { useState, useEffect, memo } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import type { SystemAsset } from '../../types/assets.types';
import { getEffectiveStatus } from '../../types/assets.types';

interface AssetTableProps {
  assets: SystemAsset[];
  onEdit: (asset: SystemAsset) => void;
  onDelete: (id: string) => void;
  onPrintIndividual?: (asset: SystemAsset) => void;
}

const PAGE_SIZE = 10;

export const AssetTable = memo(function AssetTable({ assets, onEdit, onDelete, onPrintIndividual }: AssetTableProps) {
  const { isAdmin } = usePermissions();
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever the list of assets (or filter) changes
  useEffect(() => {
    setCurrentPage(1);
  }, [assets]);

  const totalPages = Math.max(1, Math.ceil(assets.length / PAGE_SIZE));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, assets.length);
  const paginatedAssets = assets.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // ── Status helpers ─────────────────────────────────────────────────────────
  const getStatusClass = (asset: SystemAsset): string => {
    const status = getEffectiveStatus(asset);
    switch (status) {
      case 'Active': return 'badge--status-active';
      case 'Maintenance': return 'badge--status-maintenance';
      case 'Offline': return 'badge--status-offline';
      default: return 'badge--status-active';
    }
  };

  const getStatusLabel = (asset: SystemAsset): string => {
    const status = getEffectiveStatus(asset);
    switch (status) {
      case 'Active': return 'En proceso';
      case 'Maintenance': return 'Finalizado';
      case 'Offline': return 'Entregado';
      default: return 'En proceso';
    }
  };

  // ── Date formatter: dd/mm/aaaa (no time) ───────────────────────────────────
  const formatDate = (dateStr: string | undefined | null): string => {
    if (!dateStr) return '—';
    const trimmed = dateStr.trim();
    if (!trimmed) return '—';

    // Si ya viene en formato DD/MM/YYYY o DD/MM/YY
    if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(trimmed)) {
      const [d, m, y] = trimmed.split('/');
      const fullYear = y.length === 2 ? `20${y}` : y;
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${fullYear}`;
    }

    // Si viene en formato YYYY-MM-DD
    const dateOnly = trimmed.split('T')[0].split(' ')[0];
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
      const [y, m, d] = dateOnly.split('-');
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }

    // Fallback Date object
    const date = new Date(trimmed);
    if (!isNaN(date.getTime())) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
    }

    return trimmed;
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
        <h3 className="empty-state__title">No se encontraron clientes registrados</h3>
      </div>
    );
  }

  const renderPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (validCurrentPage > 3) pages.push('...');
      const start = Math.max(2, validCurrentPage - 1);
      const end = Math.min(totalPages - 1, validCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (validCurrentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }

    return pages.map((page, idx) => {
      if (typeof page === 'string') {
        return (
          <span
            key={`ellipsis-${idx}`}
            className="pagination__btn"
            style={{ cursor: 'default', border: 'none', background: 'transparent' }}
          >
            ...
          </span>
        );
      }
      return (
        <button
          key={page}
          type="button"
          className={`pagination__btn ${page === validCurrentPage ? 'pagination__btn--active' : ''}`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      );
    });
  };

  return (
    <div className="table-responsive">
      <table className="data-table">
        <thead>
          <tr>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>ID Cliente</th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>Cliente</th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>Producto</th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>Estado</th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>Fecha inicio</th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>Fecha fin</th>
            <th scope="col" style={{ whiteSpace: 'nowrap' }}>Fecha entrega</th>
            <th scope="col" className="text-right" style={{ whiteSpace: 'nowrap' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAssets.map((asset) => (
            <tr key={asset.id} className="data-table__row">
              {/* ID Cliente */}
              <td className="data-table__cell text-muted">
                {asset.client_id || '—'}
              </td>

              {/* Cliente */}
              <td className="data-table__cell data-table__cell--bold">
                {asset.name}
              </td>

              {/* Producto */}
              <td className="data-table__cell">
                {asset.producto || '—'}
              </td>

              {/* Estado */}
              <td className="data-table__cell">
                <span className={`badge ${getStatusClass(asset)}`}>
                  {getStatusLabel(asset)}
                </span>
              </td>

              {/* Fecha inicio */}
              <td className="data-table__cell text-muted">
                {formatDate(asset.fecha_comienzo)}
              </td>

              {/* Fecha fin */}
              <td className="data-table__cell text-muted">
                {formatDate(asset.fecha_fin)}
              </td>

              {/* Fecha entrega */}
              <td className="data-table__cell text-muted">
                {formatDate(asset.fecha_entrega)}
              </td>

              {/* Acciones – icon only */}
              <td className="data-table__cell text-right">
                <div className="table-actions">
                  {onPrintIndividual && (
                    <button
                      type="button"
                      className="table-btn table-btn--print"
                      onClick={() => onPrintIndividual(asset)}
                      aria-label={`Imprimir ficha de ${asset.name}`}
                      title="Imprimir Ficha Técnica"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 6 2 18 2 18 9"></polyline>
                        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                        <rect x="6" y="14" width="12" height="8"></rect>
                      </svg>
                    </button>
                  )}
                  {isAdmin && (
                    <>
                      <button
                        type="button"
                        className="table-btn table-btn--edit"
                        onClick={() => onEdit(asset)}
                        aria-label={`Editar ${asset.name}`}
                        title="Editar"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                      </button>
                      <button
                        type="button"
                        className="table-btn table-btn--danger"
                        onClick={() => onDelete(asset.id)}
                        aria-label={`Eliminar ${asset.name}`}
                        title="Eliminar"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Pagination Bar ── */}
      <footer className="pagination">
        <div className="pagination__info">
          Mostrando <strong>{startIndex + 1}</strong> a <strong>{endIndex}</strong> de{' '}
          <strong>{assets.length}</strong> clientes
        </div>

        <nav className="pagination__controls" aria-label="Navegación de páginas">
          <button
            type="button"
            className="pagination__btn pagination__btn--nav"
            disabled={validCurrentPage === 1}
            onClick={() => handlePageChange(validCurrentPage - 1)}
            aria-label="Página anterior"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Anterior
          </button>

          {renderPageNumbers()}

          <button
            type="button"
            className="pagination__btn pagination__btn--nav"
            disabled={validCurrentPage === totalPages}
            onClick={() => handlePageChange(validCurrentPage + 1)}
            aria-label="Página siguiente"
          >
            Siguiente
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </nav>
      </footer>
    </div>
  );
});
