import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import type { SystemAsset } from '../../types/assets.types';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (asset: Omit<SystemAsset, 'id' | 'last_inspected'> & { id?: string }) => void;
  assetToEdit: SystemAsset | null;
}

const CLIENT_STATUS_OPTIONS = [
  { value: 'Active', label: 'Activo' },
  { value: 'Pending', label: 'En proceso' },
  { value: 'Inactive', label: 'Inactivo' },
];

const PRIORITY_OPTIONS = [
  { value: 'Low', label: 'Baja' },
  { value: 'Medium', label: 'Normal' },
  { value: 'High', label: 'Alta' },
  { value: 'Critical', label: 'Urgente' },
];

export function AssetModal({ isOpen, onClose, onSubmit, assetToEdit }: AssetModalProps) {
  // Parte 1: Producto solicitado
  const [descripcion, setDescripcion] = useState('');
  const [largo, setLargo] = useState('');
  const [ancho, setAncho] = useState('');
  const [cantidadUnidades, setCantidadUnidades] = useState('');
  const [cantidadKilos, setCantidadKilos] = useState('');
  const [cantidadMetros, setCantidadMetros] = useState('');
  const [datosExtras, setDatosExtras] = useState('');

  // Parte 2: Datos del Cliente
  const [clientName, setClientName] = useState('');
  const [rutCuit, setRutCuit] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [clientStatus, setClientStatus] = useState('Active');

  // Parte 3: Condiciones y Entrega
  const [deliveryDate, setDeliveryDate] = useState('');
  const [shippingMethod, setShippingMethod] = useState('');
  const [paymentTerms, setPaymentTerms] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (assetToEdit) {
      setClientName(assetToEdit.name || '');
      setDescripcion(assetToEdit.ip_address || '');
      setErrors({});
    } else {
      // Reset form
      setDescripcion('');
      setLargo('');
      setAncho('');
      setCantidadUnidades('');
      setCantidadKilos('');
      setCantidadMetros('');
      setDatosExtras('');

      setClientName('');
      setRutCuit('');
      setPhone('');
      setEmail('');
      setAddress('');
      setClientStatus('Active');

      setDeliveryDate('');
      setShippingMethod('');
      setPaymentTerms('');
      setDeliveryAddress('');
      setPriority('Medium');
      setNotes('');
      setErrors({});
    }
  }, [assetToEdit, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción del producto es obligatoria.';
    }

    if (!clientName.trim()) {
      newErrors.clientName = 'El nombre del cliente es obligatorio.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      id: assetToEdit?.id,
      name: clientName.trim(),
      ip_address: descripcion.trim(),
      category: 'Workstation',
      status: clientStatus as any,
      criticality: priority as any,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assetToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
      size="xl"
    >
      <form onSubmit={handleSubmit} noValidate className="client-form">
        <div className="client-form__grid">
          {/* ── Parte 1: Producto solicitado (Izquierda) ── */}
          <section className="client-form__column">
            <header className="client-form__section-header">
              <div className="client-form__badge">1</div>
              <h3 className="client-form__subtitle">Producto solicitado</h3>
            </header>

            <div className="client-form__fields">
              <Textarea
                id="product-description"
                label="Descripción"
                rows={1}
                placeholder="Escribe la descripción detallada..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                error={errors.descripcion}
                required
              />

              <div className="client-form__row">
                <Input
                  id="product-largo"
                  label="Largo"
                  type="text"
                  placeholder="ej. 120 cm"
                  value={largo}
                  onChange={(e) => setLargo(e.target.value)}
                />
                <Input
                  id="product-ancho"
                  label="Ancho"
                  type="text"
                  placeholder="ej. 80 cm"
                  value={ancho}
                  onChange={(e) => setAncho(e.target.value)}
                />
              </div>

              <div className="client-form__row-3">
                <Input
                  id="product-unidades"
                  label="Cant. Unid."
                  type="number"
                  placeholder="0"
                  value={cantidadUnidades}
                  onChange={(e) => setCantidadUnidades(e.target.value)}
                />
                <Input
                  id="product-kilos"
                  label="Cant. Kg."
                  type="number"
                  placeholder="0.00"
                  value={cantidadKilos}
                  onChange={(e) => setCantidadKilos(e.target.value)}
                />
                <Input
                  id="product-metros"
                  label="Cant. Mts."
                  type="number"
                  placeholder="0.00"
                  value={cantidadMetros}
                  onChange={(e) => setCantidadMetros(e.target.value)}
                />
              </div>

              <Textarea
                id="product-extras"
                label="Datos extras"
                rows={1}
                placeholder="Especificaciones adicionales..."
                value={datosExtras}
                onChange={(e) => setDatosExtras(e.target.value)}
              />
            </div>
          </section>

          {/* ── Parte 2: Datos del Cliente (Centro) ── */}
          <section className="client-form__column">
            <header className="client-form__section-header">
              <div className="client-form__badge">2</div>
              <h3 className="client-form__subtitle">Datos del Cliente</h3>
            </header>

            <div className="client-form__fields">
              <Input
                id="client-name"
                label="Nombre / Razón Social"
                type="text"
                placeholder="ej. Industrias Alfa S.A."
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                error={errors.clientName}
                required
              />

              <Input
                id="client-rut"
                label="RUT / CUIT / ID"
                type="text"
                placeholder="ej. 21-12345678-9"
                value={rutCuit}
                onChange={(e) => setRutCuit(e.target.value)}
              />

              <div className="client-form__row">
                <Input
                  id="client-phone"
                  label="Teléfono"
                  type="tel"
                  placeholder="+54 11 1234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Input
                  id="client-email"
                  label="Email"
                  type="email"
                  placeholder="contacto@cliente.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Input
                id="client-address"
                label="Dirección Principal"
                type="text"
                placeholder="ej. Av. Corrientes 1234, CABA"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <Select
                id="client-status"
                label="Estado del Cliente"
                value={clientStatus}
                onChange={(e) => setClientStatus(e.target.value)}
                options={CLIENT_STATUS_OPTIONS}
              />
            </div>
          </section>

          {/* ── Parte 3: Condiciones y Entrega (Derecha) ── */}
          <section className="client-form__column">
            <header className="client-form__section-header">
              <div className="client-form__badge">3</div>
              <h3 className="client-form__subtitle">Condiciones y Entrega</h3>
            </header>

            <div className="client-form__fields">
              <div className="client-form__row">
                <Input
                  id="delivery-date"
                  label="Fecha de Entrega"
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                />
                <Select
                  id="order-priority"
                  label="Prioridad"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  options={PRIORITY_OPTIONS}
                />
              </div>

              <Input
                id="shipping-method"
                label="Método de Envío"
                type="text"
                placeholder="ej. Flete Propio / Retira en Depósito"
                value={shippingMethod}
                onChange={(e) => setShippingMethod(e.target.value)}
              />

              <Input
                id="payment-terms"
                label="Condición de Pago"
                type="text"
                placeholder="ej. 30 días fecha factura"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
              />

              <Input
                id="delivery-address"
                label="Lugar de Entrega"
                type="text"
                placeholder="Misma que dirección principal o depósito"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />

              <Textarea
                id="order-notes"
                label="Observaciones Internas"
                rows={1}
                placeholder="Comentarios adicionales para logística o administración..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </section>
        </div>

        <footer className="client-form__actions">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary">
            {assetToEdit ? 'Guardar Cambios' : 'Guardar Cliente'}
          </Button>
        </footer>
      </form>
    </Modal>
  );
}
