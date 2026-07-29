import { useState, useMemo, useEffect } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { Button } from '../components/ui/Button';
import { AssetStats } from '../components/dashboard/AssetStats';
import { AssetFilters } from '../components/dashboard/AssetFilters';
import { AssetTable } from '../components/dashboard/AssetTable';
import { AssetModal } from '../components/dashboard/AssetModal';
import { usePermissions } from '../hooks/usePermissions';
import { supabase } from '../lib/supabase';
import type { SystemAsset, AssetFiltersState, AssetStatsData } from '../types/assets.types';

export function DashboardPage() {
  const { isAdmin } = usePermissions();

  // Assets and Filters State
  const [assets, setAssets] = useState<SystemAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<AssetFiltersState>({
    search: '',
    category: 'all',
    status: 'all',
    criticality: 'all',
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<SystemAsset | null>(null);

  // ── Fetch Assets from Supabase ─────────────────────────────────────────────
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('assets')
          .select('*')
          .order('created_at', { ascending: false });

        if (supabaseError) {
          throw new Error(supabaseError.message);
        }

        // Format date timestamps to UI friendly strings "YYYY-MM-DD HH:mm"
        const formattedAssets: SystemAsset[] = (data || []).map((item) => {
          let dateStr = item.last_inspected;
          if (dateStr) {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) {
              const pad = (n: number) => n.toString().padStart(2, '0');
              dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
            }
          }
          return {
            ...item,
            last_inspected: dateStr,
          } as SystemAsset;
        });

        setAssets(formattedAssets);
      } catch (err: any) {
        console.error('[DashboardPage] Error fetching assets:', err);
        setError(err.message || 'Error al cargar los activos desde la base de datos.');
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

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

  const handleFormSubmit = async (formData: Omit<SystemAsset, 'id' | 'last_inspected'> & { id?: string }) => {
    if (!isAdmin) return;

    // Use current time in UTC/ISO format for Postgres TIMESTAMP WITH TIME ZONE
    const isoTimestamp = new Date().toISOString();
    const uiTimestamp = isoTimestamp.replace('T', ' ').substring(0, 16);

    try {
      setError(null);
      if (formData.id) {
        // Update in Supabase
        const { error: updateError } = await supabase
          .from('assets')
          .update({
            name: formData.name,
            ip_address: formData.ip_address,
            category: formData.category,
            status: formData.status,
            criticality: formData.criticality,
            last_inspected: isoTimestamp,
          })
          .eq('id', formData.id);

        if (updateError) throw new Error(updateError.message);

        // Update local state
        setAssets((prev) =>
          prev.map((asset) =>
            asset.id === formData.id
              ? ({
                ...asset,
                ...formData,
                last_inspected: uiTimestamp,
              } as SystemAsset)
              : asset
          )
        );
      } else {
        // Insert in Supabase
        const { data, error: insertError } = await supabase
          .from('assets')
          .insert({
            name: formData.name,
            ip_address: formData.ip_address,
            category: formData.category,
            status: formData.status,
            criticality: formData.criticality,
            last_inspected: isoTimestamp,
          })
          .select()
          .single();

        if (insertError) throw new Error(insertError.message);

        const newAsset: SystemAsset = {
          ...formData,
          id: data.id,
          last_inspected: uiTimestamp,
        } as SystemAsset;

        setAssets((prev) => [newAsset, ...prev]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('[DashboardPage] Error saving asset:', err);
      alert(`Error al guardar el activo: ${err.message}`);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!isAdmin) return;
    if (window.confirm('¿Estás seguro de que deseas eliminar este activo?')) {
      try {
        setError(null);
        const { error: deleteError } = await supabase
          .from('assets')
          .delete()
          .eq('id', id);

        if (deleteError) throw new Error(deleteError.message);

        setAssets((prev) => prev.filter((asset) => asset.id !== id));
      } catch (err: any) {
        console.error('[DashboardPage] Error deleting asset:', err);
        alert(`Error al eliminar el activo: ${err.message}`);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <AppLayout>
      <div className="dashboard">
        {/* ── Header ── */}
        <section className="dashboard__header" aria-labelledby="dashboard-title">
          <div className="dashboard__title-group">
            <h1 id="dashboard-title" className="dashboard__title">
              Clientes
            </h1>
            <p className="dashboard__subtitle">
              Gestiona tus clientes y productos.
            </p>
          </div>

          <div className="dashboard__header-actions">
            <Button
              id="btn-export-pdf"
              variant="secondary"
              size="md"
              onClick={handleExportPDF}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Exportar PDF
            </Button>

            <Button
              id="btn-print"
              variant="secondary"
              size="md"
              onClick={handlePrint}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Imprimir
            </Button>

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
                Nuevo Cliente
              </Button>
            )}
          </div>
        </section>

        {/* ── Stats Indicators ── */}
        <AssetStats stats={stats} />

        {/* ── Filter Controls ── */}
        <AssetFilters filters={filters} onChange={setFilters} />

        {/* ── Error Alert ── */}
        {error && (
          <div className="dashboard-error-alert" role="alert">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* ── Records Table or Loader ── */}
        {loading ? (
          <div className="dashboard-loader">
            <div className="spinner"></div>
            <p>Cargando clientes...</p>
          </div>
        ) : (
          <AssetTable
            assets={filteredAssets}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteAsset}
          />
        )}

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
