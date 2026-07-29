import { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { TogglePill } from '../ui/TogglePill';
import { Button } from '../ui/Button';
import type { SystemAsset } from '../../types/assets.types';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (asset: Omit<SystemAsset, 'id' | 'last_inspected'> & { id?: string }) => void;
  assetToEdit: SystemAsset | null;
}

const SI_NO_OPTIONS = [
  { value: 'si', label: 'Sí' },
  { value: 'no', label: 'No' },
];

const CARAS_OPTIONS = [
  { value: '1 cara', label: '1 cara' },
  { value: '2 caras', label: '2 caras' },
];

const CORTE_OPTIONS = [
  { value: 'Lateral', label: 'Lateral' },
  { value: 'Fondo', label: 'Fondo' },
];

const PISTA_OPTIONS = [
  { value: 'Simple', label: 'Simple' },
  { value: 'Doble', label: 'Doble' },
  { value: 'Triple', label: 'Triple' },
];

export function AssetModal({ isOpen, onClose, onSubmit, assetToEdit }: AssetModalProps) {
  // Campos del encabezado horizontal
  const [clientName, setClientName] = useState('');
  const [fechaComienzo, setFechaComienzo] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  // Parte 1: Producto solicitado
  const [descripcion, setDescripcion] = useState('');
  const [largo, setLargo] = useState('');
  const [ancho, setAncho] = useState('');
  const [cantidadUnidades, setCantidadUnidades] = useState('');
  const [cantidadKilos, setCantidadKilos] = useState('');
  const [cantidadMetros, setCantidadMetros] = useState('');
  const [datosExtras, setDatosExtras] = useState('');

  // Parte 2: Datos de extrusión
  const [materialCliente, setMaterialCliente] = useState('no');
  const [tubo, setTubo] = useState('');
  const [tratado, setTratado] = useState('no');
  const [caras, setCaras] = useState('1 cara');
  const [fuelle, setFuelle] = useState('no');
  const [microperforada, setMicroperforada] = useState('no');
  const [materialExtrudar, setMaterialExtrudar] = useState('');
  const [colorTela, setColorTela] = useState('');
  const [kgExtrudados, setKgExtrudados] = useState('');
  const [mtsExtrudados, setMtsExtrudados] = useState('');
  const [cantUnidExtrusion, setCantUnidExtrusion] = useState('');
  const [datoExtraExtrusion, setDatoExtraExtrusion] = useState('');
  const [extrusor, setExtrusor] = useState('');

  // Parte 3: Datos de confección
  const [corte, setCorte] = useState('Lateral');
  const [golpePorMinuto, setGolpePorMinuto] = useState('');
  const [pista, setPista] = useState('Simple');
  const [datoExtraConfeccion, setDatoExtraConfeccion] = useState('');
  const [cantResultante, setCantResultante] = useState('');
  const [bultos, setBultos] = useState('');
  const [confeccionista, setConfeccionista] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (assetToEdit) {
      setClientName(assetToEdit.name || '');
      setDescripcion(assetToEdit.ip_address || '');
      setErrors({});
    } else {
      // Reset form
      setClientName('');
      setFechaComienzo('');
      setFechaFin('');
      setDeliveryDate('');

      setDescripcion('');
      setLargo('');
      setAncho('');
      setCantidadUnidades('');
      setCantidadKilos('');
      setCantidadMetros('');
      setDatosExtras('');

      setMaterialCliente('no');
      setTubo('');
      setTratado('no');
      setCaras('1 cara');
      setFuelle('no');
      setMicroperforada('no');
      setMaterialExtrudar('');
      setColorTela('');
      setKgExtrudados('');
      setMtsExtrudados('');
      setCantUnidExtrusion('');
      setDatoExtraExtrusion('');
      setExtrusor('');

      setCorte('Lateral');
      setGolpePorMinuto('');
      setPista('Simple');
      setDatoExtraConfeccion('');
      setCantResultante('');
      setBultos('');
      setConfeccionista('');
      setErrors({});
    }
  }, [assetToEdit, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clientName.trim()) {
      newErrors.clientName = 'El nombre del cliente es obligatorio.';
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción del producto es obligatoria.';
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
      status: 'Active',
      criticality: 'Medium',
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
        {/* ── Encabezado superior a lo largo (4 campos en una sola línea) ── */}
        <div className="client-form__top-bar">
          <Input
            id="top-cliente"
            label="Cliente"
            type="text"
            placeholder="ej. Industrias Alfa S.A."
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            error={errors.clientName}
            required
          />
          <Input
            id="top-fecha-comienzo"
            label="Fecha comienzo"
            type="date"
            value={fechaComienzo}
            onChange={(e) => setFechaComienzo(e.target.value)}
          />
          <Input
            id="top-fecha-fin"
            label="Fecha fin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
          <Input
            id="top-fecha-entrega"
            label="Fecha entrega"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
          />
        </div>

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

          {/* ── Parte 2: Datos de extrusión (Centro) ── */}
          <section className="client-form__column">
            <header className="client-form__section-header">
              <div className="client-form__badge">2</div>
              <h3 className="client-form__subtitle">Datos de extrusión</h3>
            </header>

            <div className="client-form__fields">
              <div className="client-form__row">
                <TogglePill
                  label="Material del cliente"
                  options={SI_NO_OPTIONS}
                  value={materialCliente}
                  onChange={setMaterialCliente}
                />
                <TogglePill
                  label="Tratado"
                  options={SI_NO_OPTIONS}
                  value={tratado}
                  onChange={setTratado}
                />
              </div>

              <div className="client-form__row">
                <TogglePill
                  label="Caras"
                  options={CARAS_OPTIONS}
                  value={caras}
                  onChange={setCaras}
                />
                <TogglePill
                  label="Fuelle"
                  options={SI_NO_OPTIONS}
                  value={fuelle}
                  onChange={setFuelle}
                />
              </div>

              <div className="client-form__row">
                <TogglePill
                  label="Microperforada"
                  options={SI_NO_OPTIONS}
                  value={microperforada}
                  onChange={setMicroperforada}
                />
                <Input
                  id="extrusion-tubo"
                  label="Tubo"
                  type="text"
                  placeholder="ej. Tubo 50"
                  value={tubo}
                  onChange={(e) => setTubo(e.target.value)}
                />
              </div>

              <div className="client-form__row">
                <Input
                  id="extrusion-material-extrudar"
                  label="Material a extrudar"
                  type="text"
                  placeholder="ej. Polietileno"
                  value={materialExtrudar}
                  onChange={(e) => setMaterialExtrudar(e.target.value)}
                />
                <Input
                  id="extrusion-color-tela"
                  label="Color de tela"
                  type="text"
                  placeholder="ej. Transparente"
                  value={colorTela}
                  onChange={(e) => setColorTela(e.target.value)}
                />
              </div>

              <div className="client-form__row-3">
                <Input
                  id="extrusion-kg"
                  label="Kg extrudados"
                  type="number"
                  placeholder="0.00"
                  value={kgExtrudados}
                  onChange={(e) => setKgExtrudados(e.target.value)}
                />
                <Input
                  id="extrusion-mts"
                  label="Mts extrudados"
                  type="number"
                  placeholder="0.00"
                  value={mtsExtrudados}
                  onChange={(e) => setMtsExtrudados(e.target.value)}
                />
                <Input
                  id="extrusion-cant-unid"
                  label="Cant bobinas"
                  type="number"
                  placeholder="0"
                  value={cantUnidExtrusion}
                  onChange={(e) => setCantUnidExtrusion(e.target.value)}
                />
              </div>

              <Input
                id="extrusion-extrusor"
                label="Extrusor"
                type="text"
                placeholder="ej. Operario / Máquina 01"
                value={extrusor}
                onChange={(e) => setExtrusor(e.target.value)}
              />

              <Textarea
                id="extrusion-dato-extra"
                label="Dato extra"
                rows={1}
                placeholder="Detalles adicionales de extrusión..."
                value={datoExtraExtrusion}
                onChange={(e) => setDatoExtraExtrusion(e.target.value)}
              />
            </div>
          </section>

          {/* ── Parte 3: Datos de confección (Derecha) ── */}
          <section className="client-form__column">
            <header className="client-form__section-header">
              <div className="client-form__badge">3</div>
              <h3 className="client-form__subtitle">Datos de confección</h3>
            </header>

            <div className="client-form__fields">
              <div className="client-form__row">
                <TogglePill
                  label="Corte"
                  options={CORTE_OPTIONS}
                  value={corte}
                  onChange={setCorte}
                />
                <Input
                  id="confeccion-golpe-min"
                  label="Golpe por minuto"
                  type="number"
                  placeholder="0"
                  value={golpePorMinuto}
                  onChange={(e) => setGolpePorMinuto(e.target.value)}
                />
              </div>

              <TogglePill
                label="Pista"
                options={PISTA_OPTIONS}
                value={pista}
                onChange={setPista}
              />

              <div className="client-form__row">
                <Input
                  id="confeccion-cant-resultante"
                  label="Cant resultante"
                  type="number"
                  placeholder="0"
                  value={cantResultante}
                  onChange={(e) => setCantResultante(e.target.value)}
                />
                <Input
                  id="confeccion-bultos"
                  label="Bultos"
                  type="number"
                  placeholder="0"
                  value={bultos}
                  onChange={(e) => setBultos(e.target.value)}
                />
              </div>

              <Input
                id="confeccion-confeccionista"
                label="Confeccionista"
                type="text"
                placeholder="ej. Nombre del operario"
                value={confeccionista}
                onChange={(e) => setConfeccionista(e.target.value)}
              />

              <Textarea
                id="confeccion-dato-extra"
                label="Dato extra"
                rows={1}
                placeholder="Detalles adicionales de confección..."
                value={datoExtraConfeccion}
                onChange={(e) => setDatoExtraConfeccion(e.target.value)}
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
