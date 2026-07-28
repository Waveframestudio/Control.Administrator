import { useState, useMemo } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { Button } from '../components/ui/Button';
import { AssetStats } from '../components/dashboard/AssetStats';
import { AssetFilters } from '../components/dashboard/AssetFilters';
import { AssetTable } from '../components/dashboard/AssetTable';
import { AssetModal } from '../components/dashboard/AssetModal';
import { usePermissions } from '../hooks/usePermissions';
import type { SystemAsset, AssetFiltersState, AssetStatsData } from '../types/assets.types';

// ─── Initial Mock Data ────────────────────────────────────────────────────────
const INITIAL_ASSETS: SystemAsset[] = [
  {
    id: '1',
    name: 'Servidor de Base de Datos Principal',
    ip_address: '10.0.4.15',
    category: 'Database',
    status: 'Active',
    criticality: 'Critical',
    last_inspected: '2026-07-27 14:32',
  },
  {
    id: '2',
    name: 'Firewall de Puerta de Enlace Externa',
    ip_address: '192.168.1.1',
    category: 'Network',
    status: 'Active',
    criticality: 'Critical',
    last_inspected: '2026-07-28 09:15',
  },
  {
    id: '3',
    name: 'SO de Sandbox de Desarrollo',
    ip_address: '172.16.42.8',
    category: 'Workstation',
    status: 'Maintenance',
    criticality: 'Low',
    last_inspected: '2026-07-25 18:00',
  },
  {
    id: '4',
    name: 'Proxy Web Corporativo',
    ip_address: '10.0.1.250',
    category: 'Network',
    status: 'Offline',
    criticality: 'High',
    last_inspected: '2026-07-28 10:44',
  },
  {
    id: '5',
    name: 'Gateway de API de Analíticas',
    ip_address: '10.0.2.110',
    category: 'Server',
    status: 'Active',
    criticality: 'High',
    last_inspected: '2026-07-27 22:11',
  },
];

export function DashboardPage() {
  const { isAdmin } = usePermissions();

  // Assets and Filters State
  const [assets, setAssets] = useState<SystemAsset[]>(INITIAL_ASSETS);
  const [filters, setFilters] = useState<AssetFiltersState>({
    search: '',
    category: 'all',
    status: 'all',
    criticality: 'all',
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<SystemAsset | null>(null);

  // ── Calculate Stats ────────────────────────────────────────────────────────
  const stats = useMemo<AssetStatsData>(() => {
    return {
      total: assets.length,
      active: assets.filter((a) => a.status === 'Active').length,
      maintenance: assets.filter((a) => a.status === 'Maintenance').length,
      offline: assets.filter((a) => a.status === 'Offline').length,
    };
  }, [assets]);

  // ── Filter Assets ──────────────────────────────────────────────────────────
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Search search filter (matches name or IP)
      const searchMatch =
        filters.search === '' ||
        asset.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        asset.ip_address.includes(filters.search);

      // Category filter
      const categoryMatch =
        filters.category === 'all' || asset.category === filters.category;

      // Status filter
      const statusMatch =
        filters.status === 'all' || asset.status === filters.status;

      // Criticality filter
      const criticalityMatch =
        filters.criticality === 'all' || asset.criticality === filters.criticality;

      return searchMatch && categoryMatch && statusMatch && criticalityMatch;
    });
  }, [assets, filters]);

  // ── CRUD Handlers (Simulating Supabase Writes) ──────────────────────────────
  const handleOpenCreateModal = () => {
    if (!isAdmin) return;
    setAssetToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (asset: SystemAsset) => {
    if (!isAdmin) return;
    setAssetToEdit(asset);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData: Omit<SystemAsset, 'id' | 'last_inspected'> & { id?: string }) => {
    if (!isAdmin) return;

    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);

    if (formData.id) {
      // Update
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === formData.id
            ? {
                ...asset,
                ...formData,
                last_inspected: timestamp, // update timestamp on edit
              } as SystemAsset
            : asset
        )
      );
    } else {
      // Insert
      const newAsset: SystemAsset = {
        ...formData,
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        last_inspected: timestamp,
      } as SystemAsset;
      setAssets((prev) => [newAsset, ...prev]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteAsset = (id: string) => {
    if (!isAdmin) return;
    if (window.confirm('¿Estás seguro de que deseas eliminar este activo?')) {
      setAssets((prev) => prev.filter((asset) => asset.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="dashboard">
        {/* ── Header ── */}
        <section className="dashboard__header" aria-labelledby="dashboard-title">
          <div className="dashboard__title-group">
            <h1 id="dashboard-title" className="dashboard__title">
              Activos del Sistema
            </h1>
            <p className="dashboard__subtitle">
              Gestiona nodos de red, servidores, bases de datos y estaciones de trabajo.
            </p>
          </div>

          {isAdmin && (
            <Button
              id="btn-new-asset"
              variant="primary"
              size="md"
              onClick={handleOpenCreateModal}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '4px' }}>
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Nuevo Activo
            </Button>
          )}
        </section>

        {/* ── Stats Indicators ── */}
        <AssetStats stats={stats} />

        {/* ── Filter Controls ── */}
        <AssetFilters filters={filters} onChange={setFilters} />

        {/* ── Records Table ── */}
        <AssetTable
          assets={filteredAssets}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteAsset}
        />

        {/* ── Admin Edit/Create Modal ── */}
        {isAdmin && (
          <AssetModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleFormSubmit}
            assetToEdit={assetToEdit}
          />
        )}
      </div>
    </AppLayout>
  );
}
