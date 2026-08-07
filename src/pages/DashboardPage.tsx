import { useState, useMemo, useEffect, useCallback } from 'react';
import { AppLayout } from '../layouts/AppLayout';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { AssetStats } from '../components/dashboard/AssetStats';
import { AssetFilters } from '../components/dashboard/AssetFilters';
import { AssetTable } from '../components/dashboard/AssetTable';
import { AssetModal } from '../components/dashboard/AssetModal';
import { ClientPrintSheet } from '../components/dashboard/ClientPrintSheet';
import { usePermissions } from '../hooks/usePermissions';
import { supabase } from '../lib/supabase';
import type { SystemAsset, AssetFiltersState, AssetStatsData } from '../types/assets.types';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export function DashboardPage() {
  const { isAdmin } = usePermissions();

  // Assets and Filters State
  const [assets, setAssets] = useState<SystemAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<AssetFiltersState>({
    search: '',
    field: 'all',
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState<SystemAsset | null>(null);

  // Delete Confirm Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Print State
  const [selectedClientForPrint, setSelectedClientForPrint] = useState<SystemAsset | null>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  // ── Fetch Assets from Supabase ─────────────────────────────────────────────
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: supabaseError } = await supabase
          .from('assets')
          .select('*')
          .order('created_at', { ascending: true });

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
      active: assets.filter((a) => {
        const s = (a.status || '').toLowerCase().trim();
        return s === 'active' || s === 'en proceso';
      }).length,
      maintenance: assets.filter((a) => {
        const s = (a.status || '').toLowerCase().trim();
        return s === 'maintenance' || s === 'finalizado';
      }).length,
      offline: assets.filter((a) => {
        const s = (a.status || '').toLowerCase().trim();
        return s === 'offline' || s === 'entregado';
      }).length,
    };
  }, [assets]);

  // ── Filter Assets ──────────────────────────────────────────────────────────
  const filteredAssets = useMemo(() => {
    const query = filters.search.toLowerCase().trim();
    const selectedField = filters.field || 'all';

    const formatDateStr = (val?: string | null) => {
      if (!val) return '';
      const d = new Date(val);
      if (isNaN(d.getTime())) return val;
      const pad = (n: number) => n.toString().padStart(2, '0');
      return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
    };

    const getStatusLabel = (status?: string) => {
      switch (status) {
        case 'Active': return 'En proceso';
        case 'Maintenance': return 'Finalizado';
        case 'Offline': return 'Entregado';
        default: return status || '';
      }
    };

    return assets.filter((asset) => {
      if (!query) return true;

      const matchText = (val?: string | null) => {
        if (!val) return false;
        return val.toLowerCase().includes(query);
      };

      const matchDate = (dateVal?: string | null) => {
        if (!dateVal) return false;
        const formatted = formatDateStr(dateVal);
        return dateVal.toLowerCase().includes(query) || formatted.includes(query);
      };

      switch (selectedField) {
        case 'client_id':
          return matchText(asset.client_id);
        case 'name':
          return matchText(asset.name);
        case 'producto':
          return matchText(asset.producto);
        case 'status':
          return matchText(getStatusLabel(asset.status)) || matchText(asset.status);
        case 'fecha_comienzo':
          return matchDate(asset.fecha_comienzo);
        case 'fecha_fin':
          return matchDate(asset.fecha_fin);
        case 'fecha_entrega':
          return matchDate(asset.fecha_entrega);
        case 'all':
        default:
          return (
            matchText(asset.client_id) ||
            matchText(asset.name) ||
            matchText(asset.producto) ||
            matchText(getStatusLabel(asset.status)) ||
            matchText(asset.status) ||
            matchDate(asset.fecha_comienzo) ||
            matchDate(asset.fecha_fin) ||
            matchDate(asset.fecha_entrega) ||
            matchText(asset.descripcion) ||
            matchText(asset.ip_address)
          );
      }
    });
  }, [assets, filters]);

  // ── CRUD Handlers ──────────────────────────────────────────────────────────
  const handleOpenCreateModal = useCallback(() => {
    if (!isAdmin) return;
    setAssetToEdit(null);
    setIsModalOpen(true);
  }, [isAdmin]);

  const handleOpenEditModal = useCallback((asset: SystemAsset) => {
    if (!isAdmin) return;
    setAssetToEdit(asset);
    setIsModalOpen(true);
  }, [isAdmin]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleFormSubmit = useCallback(async (formData: Omit<SystemAsset, 'id' | 'last_inspected'> & { id?: string }) => {
    if (!isAdmin) return;

    const isoTimestamp = new Date().toISOString();
    const uiTimestamp = isoTimestamp.replace('T', ' ').substring(0, 16);

    try {
      setError(null);
      const { id, ...dataToSave } = formData;
      const payload = {
        ...dataToSave,
        last_inspected: isoTimestamp,
      };

      if (id) {
        const { error: updateError } = await supabase
          .from('assets')
          .update(payload)
          .eq('id', id);

        if (updateError) throw new Error(updateError.message);

        setAssets((prev) =>
          prev.map((asset) =>
            asset.id === id
              ? ({
                ...asset,
                ...formData,
                last_inspected: uiTimestamp,
              } as SystemAsset)
              : asset
          )
        );
      } else {
        const { data, error: insertError } = await supabase
          .from('assets')
          .insert(payload)
          .select()
          .single();

        if (insertError) throw new Error(insertError.message);

        const newAsset: SystemAsset = {
          ...formData,
          ...data,
          last_inspected: uiTimestamp,
        } as SystemAsset;

        setAssets((prev) => [...prev, newAsset]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error('[DashboardPage] Error saving asset:', err);
      alert(`Error al guardar el activo: ${err.message}`);
    }
  }, [isAdmin]);

  const handleDeleteAsset = (id: string) => {
    if (!isAdmin) return;
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDeleteId) return;
    setConfirmOpen(false);
    try {
      setError(null);
      const { error: deleteError } = await supabase
        .from('assets')
        .delete()
        .eq('id', pendingDeleteId);

      if (deleteError) throw new Error(deleteError.message);

      setAssets((prev) => prev.filter((asset) => asset.id !== pendingDeleteId));
    } catch (err: any) {
      console.error('[DashboardPage] Error deleting asset:', err);
      alert(`Error al eliminar el cliente: ${err.message}`);
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  // ── PDF & Print Handlers (Using html2pdf for 100% identical PDF & Print output) ──
  const generatePDF = (
    mode: 'download' | 'print',
    filename = 'Fichas_Clientes.pdf',
    orientation: 'landscape' | 'portrait' = 'landscape'
  ) => {
    const element = document.querySelector('.printable-sheets-area');
    if (!element) return;

    // Clone the element and make it visible for html2pdf
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.display = 'block';
    clone.style.position = 'relative';
    clone.style.left = '0';
    clone.style.top = '0';

    const opt: any = {
      margin:       4,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#ffffff'
      },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: orientation },
      pagebreak:    { mode: ['css', 'legacy'] }
    };

    const worker = html2pdf().from(clone).set(opt);

    if (mode === 'download') {
      worker.save();
    } else {
      worker.toPdf().get('pdf').then((pdf: any) => {
        pdf.autoPrint();
        const blobUrl = pdf.output('bloburl');
        window.open(blobUrl, '_blank');
      });
    }
  };

  const handlePrintAll = () => {
    setSelectedClientForPrint(null);
    setIsPrinting(true);
    setTimeout(() => {
      generatePDF('print', 'Fichas_Clientes.pdf', 'landscape');
      setTimeout(() => setIsPrinting(false), 2000);
    }, 100);
  };

  const handleExportPDF = () => {
    setSelectedClientForPrint(null);
    setIsPrinting(true);
    setTimeout(() => {
      generatePDF('download', 'Fichas_Clientes.pdf', 'landscape');
      setTimeout(() => setIsPrinting(false), 2000);
    }, 100);
  };

  const handlePrintIndividual = (client: SystemAsset) => {
    setSelectedClientForPrint(client);
    setIsPrinting(true);
    setTimeout(() => {
      generatePDF('print', `Ficha_${client.name || 'Cliente'}.pdf`, 'landscape');
      setTimeout(() => setIsPrinting(false), 2000);
    }, 100);
  };

  // ── Batch Print Pairs (2 clients per page) ────────────────────────────────
  const clientPairs = useMemo(() => {
    const pairs: SystemAsset[][] = [];
    for (let i = 0; i < filteredAssets.length; i += 2) {
      pairs.push(filteredAssets.slice(i, i + 2));
    }
    return pairs;
  }, [filteredAssets]);

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
              onClick={handlePrintAll}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}>
                <polyline points="6 9 6 2 18 2 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              Imprimir Fichas
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
            onPrintIndividual={handlePrintIndividual}
          />
        )}

        {/* ── Admin Edit/Create Modal ── */}
        {isAdmin && (
          <AssetModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleFormSubmit}
            assetToEdit={assetToEdit}
          />
        )}

        {/* ── Delete Confirmation Dialog ── */}
        <ConfirmDialog
          isOpen={confirmOpen}
          title="Eliminar cliente"
          message="¿Estás seguro de que deseas eliminar este cliente? Esta acción no se puede deshacer."
          confirmLabel="Sí, eliminar"
          cancelLabel="Cancelar"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />

        {/* ── Printable Technical Sheets Container (Rendered On Demand) ── */}
        {isPrinting && (
          <div className="printable-sheets-area">
            {selectedClientForPrint ? (
              <div className="print-page-pair print-page-pair--single">
                <div className="print-sheet-item">
                  <ClientPrintSheet asset={selectedClientForPrint} />
                </div>
              </div>
            ) : (
              clientPairs.map((pair, pairIdx) => (
                <div key={`print-pair-${pairIdx}`} className="print-page-pair">
                  {pair.map((asset, idx) => (
                    <div key={`print-${asset.id}`} className="print-sheet-wrapper">
                      <div className="print-sheet-item">
                        <ClientPrintSheet asset={asset} />
                      </div>
                      {idx === 0 && pair.length > 1 && (
                        <div className="print-cut-line">
                          <span className="print-cut-line__scissors">✂</span>
                          <span className="print-cut-line__dashed"></span>
                          <span className="print-cut-line__label">LÍNEA DE CORTE</span>
                          <span className="print-cut-line__dashed"></span>
                          <span className="print-cut-line__scissors">✂</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

