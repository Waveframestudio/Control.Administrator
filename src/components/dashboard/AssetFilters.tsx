import { memo } from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import type { AssetFiltersState } from '../../types/assets.types';

interface AssetFiltersProps {
  filters: AssetFiltersState;
  onChange: (filters: AssetFiltersState) => void;
}

export const AssetFilters = memo(function AssetFilters({ filters, onChange }: AssetFiltersProps) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...filters, search: e.target.value });
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...filters, field: e.target.value });
  };

  const handleReset = () => {
    onChange({
      search: '',
      field: 'all',
    });
  };

  const hasActiveFilters = filters.search !== '' || filters.field !== 'all';

  return (
    <div className="filters-bar">
      <div className="filters-bar__inputs">
        {/* Search Input */}
        <div className="filters-bar__search">
          <Input
            id="filter-search"
            placeholder="Buscar por cliente, producto, fecha, estado..."
            value={filters.search}
            onChange={handleSearchChange}
            className="filter-input-search"
          />
        </div>

        {/* Field Filter Select */}
        <Select
          id="filter-field"
          value={filters.field || 'all'}
          onChange={handleFieldChange}
          options={[
            { value: 'all', label: 'Todos los campos' },
            { value: 'client_id', label: 'ID Cliente' },
            { value: 'name', label: 'Cliente' },
            { value: 'producto', label: 'Producto' },
            { value: 'status', label: 'Estado' },
            { value: 'fecha_comienzo', label: 'Fecha inicio' },
            { value: 'fecha_fin', label: 'Fecha fin' },
            { value: 'fecha_entrega', label: 'Fecha entrega' },
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
});
