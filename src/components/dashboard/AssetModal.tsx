import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { SystemAsset, AssetCategory, AssetStatus, AssetCriticality } from '../../types/assets.types';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (asset: Omit<SystemAsset, 'id' | 'last_inspected'> & { id?: string }) => void;
  assetToEdit: SystemAsset | null;
}

const CATEGORY_OPTIONS = [
  { value: 'Server', label: 'Servidor' },
  { value: 'Workstation', label: 'Estación de Trabajo' },
  { value: 'Database', label: 'Base de Datos' },
  { value: 'Network', label: 'Red' },
];

const STATUS_OPTIONS = [
  { value: 'Active', label: 'Activo' },
  { value: 'Maintenance', label: 'Mantenimiento' },
  { value: 'Offline', label: 'Fuera de línea' },
];

const CRITICALITY_OPTIONS = [
  { value: 'Low', label: 'Baja' },
  { value: 'Medium', label: 'Media' },
  { value: 'High', label: 'Alta' },
  { value: 'Critical', label: 'Crítica' },
];

export function AssetModal({ isOpen, onClose, onSubmit, assetToEdit }: AssetModalProps) {
  const [name, setName] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Server');
  const [status, setStatus] = useState<AssetStatus>('Active');
  const [criticality, setCriticality] = useState<AssetCriticality>('Medium');

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate form if editing
  useEffect(() => {
    if (assetToEdit) {
      setName(assetToEdit.name);
      setIpAddress(assetToEdit.ip_address);
      setCategory(assetToEdit.category);
      setStatus(assetToEdit.status);
      setCriticality(assetToEdit.criticality);
      setErrors({});
    } else {
      // Reset to defaults for a new asset
      setName('');
      setIpAddress('');
      setCategory('Server');
      setStatus('Active');
      setCriticality('Medium');
      setErrors({});
    }
  }, [assetToEdit, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre del activo es obligatorio.';
    }

    const ipRegex = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipAddress.trim()) {
      newErrors.ipAddress = 'La dirección IP es obligatoria.';
    } else if (!ipRegex.test(ipAddress.trim())) {
      newErrors.ipAddress = 'Ingresa una dirección IPv4 válida (ej. 192.168.1.5).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      id: assetToEdit?.id,
      name: name.trim(),
      ip_address: ipAddress.trim(),
      category,
      status,
      criticality,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assetToEdit ? 'Editar Activo de Sistema' : 'Nuevo Activo de Sistema'}
    >
      <form onSubmit={handleSubmit} noValidate className="asset-form">
        <div className="asset-form__fields">
          <Input
            id="asset-name"
            label="Nombre del Activo"
            type="text"
            placeholder="ej. Servidor de Base de Datos 01"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
          />

          <Input
            id="asset-ip"
            label="Dirección IP"
            type="text"
            placeholder="ej. 10.0.0.12"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
            error={errors.ipAddress}
            required
          />

          <div className="asset-form__row">
            <Select
              id="asset-category"
              label="Categoría"
              value={category}
              onChange={(e) => setCategory(e.target.value as AssetCategory)}
              options={CATEGORY_OPTIONS}
            />

            <Select
              id="asset-status"
              label="Estado"
              value={status}
              onChange={(e) => setStatus(e.target.value as AssetStatus)}
              options={STATUS_OPTIONS}
            />
          </div>

          <Select
            id="asset-criticality"
            label="Criticidad"
            value={criticality}
            onChange={(e) => setCriticality(e.target.value as AssetCriticality)}
            options={CRITICALITY_OPTIONS}
          />
        </div>

        <footer className="asset-form__actions">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {assetToEdit ? 'Guardar Cambios' : 'Crear Activo'}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}
