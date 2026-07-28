import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { AssetFiltersState } from '../../types/assets.types';

interface AssetFiltersProps {
  filters: AssetFiltersState;
  onChange: (filters: AssetFiltersState) => void;
}

export function AssetFilters({ filters, onChange }: AssetFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleSelectChange = (key: keyof Omit<AssetFiltersState, 'search'>) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, [key]: e.target.value });
  };

  const handleReset = () => {
    onChange({
      search: '',
      category: 'all',
      status: 'all',
      criticality: 'all',
    });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.status !== 'all';

  return (
    <div className="filters-bar">
      <div className="filters-bar__inputs">
        {/* Search */}
        <div className="filters-bar__search">
          <Input
            id="filter-search"
            placeholder="Buscar por usuario, producto, fecha, estado..."
            value={filters.search}
            onChange={handleSearchChange}
            className="filter-input-search"
          />
        </div>

        {/* Category */}
        <Select
          id="filter-category"
          value={filters.category}
          onChange={handleSelectChange('category')}
          options={[
            { value: 'all', label: 'Todas las Categorías' },
            { value: 'Server', label: 'Servidores' },
            { value: 'Workstation', label: 'Estaciones de Trabajo' },
            { value: 'Database', label: 'Bases de Datos' },
            { value: 'Network', label: 'Redes' },
          ]}
          className="filter-select"
        />

        {/* Status */}
        <Select
          id="filter-status"
          value={filters.status}
          onChange={handleSelectChange('status')}
          options={[
            { value: 'all', label: 'Todos los Estados' },
            { value: 'Active', label: 'Activo' },
            { value: 'Maintenance', label: 'Mantenimiento' },
            { value: 'Offline', label: 'Fuera de línea' },
          ]}
          className="filter-select"
        />

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            type="button"
            className="filters-bar__reset"
            onClick={handleReset}
            aria-label="Limpiar todos los filtros"
          >
            Limpiar Filtros
          </button>
        )}
      </div>
    </div>
  );
}
