import { useState, useEffect, memo } from 'react';
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

const IMPRESION_CARAS_OPTIONS = [
  { value: '1 cara', label: '1 cara' },
  { value: '2 caras', label: '2 caras' },
];

const COLORES_OPTIONS = [
  { value: '1C', label: '1C' },
  { value: '2C', label: '2C' },
  { value: '3C', label: '3C' },
  { value: '4C', label: '4C' },
  { value: '5C', label: '5C' },
  { value: '6C', label: '6C' },
];

export const AssetModal = memo(function AssetModal({ isOpen, onClose, onSubmit, assetToEdit }: AssetModalProps) {
  // Campos del encabezado horizontal
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState('');
  const [fechaComienzo, setFechaComienzo] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  /**
   * Permite ingresar números con punto o coma decimal (hasta 2 decimales).
   */
  const handleDecimalInput = (
    raw: string,
    setter: (v: string) => void
  ) => {
    let clean = raw.replace(',', '.');
    clean = clean.replace(/[^0-9.]/g, '');
    const parts = clean.split('.');
    if (parts.length > 2) {
      clean = parts[0] + '.' + parts.slice(1).join('');
    }
    if (parts.length === 2 && parts[1].length > 2) {
      clean = `${parts[0]}.${parts[1].slice(0, 2)}`;
    }
    setter(clean);
  };

  // Parte 1: Producto solicitado
  const [producto, setProducto] = useState('');
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
  const [fuelleConfeccion, setFuelleConfeccion] = useState('no');
  const [perforado, setPerforado] = useState('no');
  const [bolsaExhibidora, setBolsaExhibidora] = useState('no');

  // Parte 4: Datos de impresión
  const [impresionCaras, setImpresionCaras] = useState('1 cara');
  const [coloresImpresion, setColoresImpresion] = useState('1C');
  const [impresionLateral, setImpresionLateral] = useState('no');
  const [impresionFondo, setImpresionFondo] = useState('no');
  const [cilindro, setCilindro] = useState('');
  const [colores, setColores] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const toYYYYMMDD = (dateStr?: string): string => {
    if (!dateStr) return '';
    const trimmed = dateStr.trim();
    if (!trimmed) return '';
    if (trimmed.includes('/')) {
      const parts = trimmed.split('/');
      if (parts.length === 3) {
        const [day, month, year] = parts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    const datePart = trimmed.split('T')[0].split(' ')[0];
    const parts = datePart.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      return datePart;
    }
    return '';
  };

  const toDMY = (dateStr?: string): string => {
    if (!dateStr) return '';
    const trimmed = dateStr.trim();
    if (!trimmed) return '';
    if (trimmed.includes('/')) return trimmed;
    const datePart = trimmed.split('T')[0].split(' ')[0];
    const parts = datePart.split('-');
    if (parts.length === 3 && parts[0].length === 4) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    return trimmed;
  };

  useEffect(() => {
    if (assetToEdit) {
      setClientName(assetToEdit.name || '');
      setClientId(assetToEdit.client_id || '');
      setFechaComienzo(toYYYYMMDD(assetToEdit.fecha_comienzo));
      setFechaFin(toYYYYMMDD(assetToEdit.fecha_fin));
      setDeliveryDate(toYYYYMMDD(assetToEdit.fecha_entrega));

      setDescripcion(assetToEdit.descripcion || assetToEdit.ip_address || '');
      setProducto(assetToEdit.producto || '');
      setLargo(assetToEdit.largo || '');
      setAncho(assetToEdit.ancho || '');
      setCantidadUnidades(assetToEdit.cantidad_unidades?.toString() || '');
      setCantidadKilos(assetToEdit.cantidad_kilos?.toString() || '');
      setCantidadMetros(assetToEdit.cantidad_metros?.toString() || '');
      setDatosExtras(assetToEdit.dato_extra_producto || '');

      setMaterialCliente(assetToEdit.material_cliente || 'no');
      setTubo(assetToEdit.tubo_tipo || '');
      setTratado(assetToEdit.tratado || 'no');
      setCaras(assetToEdit.caras_extrusion || '1 cara');
      setFuelle(assetToEdit.fuelle || 'no');
      setMicroperforada(assetToEdit.microperforada || 'no');
      setMaterialExtrudar(assetToEdit.material_a_extrudar || '');
      setColorTela(assetToEdit.color_tela || '');
      setKgExtrudados(assetToEdit.kilos_extrudados?.toString() || '');
      setMtsExtrudados(assetToEdit.metros_extrudados?.toString() || '');
      setCantUnidExtrusion(assetToEdit.cantidad_bobinas?.toString() || '');
      setDatoExtraExtrusion(assetToEdit.dato_extra_extrusion || '');
      setExtrusor(assetToEdit.extrusor || '');

      setCorte(assetToEdit.corte || 'Lateral');
      setGolpePorMinuto(assetToEdit.golpes_por_minuto?.toString() || '');
      setPista(assetToEdit.pista || 'Simple');
      setFuelleConfeccion(assetToEdit.fuelle_confeccion || 'no');
      setPerforado(assetToEdit.perforado || 'no');
      setBolsaExhibidora(assetToEdit.bolsa_exhibidora || 'no');

      setImpresionCaras(assetToEdit.impresion_caras || '1 cara');
      setColoresImpresion(assetToEdit.colores_impresion || '1C');
      setImpresionLateral(assetToEdit.impresion_lateral || 'no');
      setImpresionFondo(assetToEdit.impresion_fondo || 'no');
      setCilindro(assetToEdit.cilindro || '');
      setColores(assetToEdit.colores_detalle || '');
      setErrors({});
    } else {
      // Reset form
      setClientName('');
      setClientId('');
      setFechaComienzo('');
      setFechaFin('');
      setDeliveryDate('');

      setDescripcion('');
      setProducto('');
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
      setFuelleConfeccion('no');
      setPerforado('no');
      setBolsaExhibidora('no');

      setImpresionCaras('1 cara');
      setColoresImpresion('1C');
      setImpresionLateral('no');
      setImpresionFondo('no');
      setCilindro('');
      setColores('');
      setErrors({});
    }
  }, [assetToEdit, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!clientName.trim()) {
      newErrors.clientName = 'El nombre del cliente es obligatorio.';
    }

    if (!clientId.trim()) {
      newErrors.clientId = 'El ID de cliente es obligatorio.';
    }

    if (!producto.trim()) {
      newErrors.producto = 'El producto es obligatorio.';
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
      client_id: clientId.trim(),
      ip_address: descripcion.trim(),
      category: 'Workstation',
      status: 'Active',
      criticality: 'Medium',

      fecha_comienzo: toDMY(fechaComienzo),
      fecha_fin: toDMY(fechaFin),
      fecha_entrega: toDMY(deliveryDate),

      producto: producto.trim(),
      descripcion: descripcion.trim(),
      largo,
      ancho,
      cantidad_unidades: cantidadUnidades,
      cantidad_kilos: cantidadKilos,
      cantidad_metros: cantidadMetros,
      dato_extra_producto: datosExtras,

      material_cliente: materialCliente as any,
      tubo_tipo: tubo,
      tratado: tratado as any,
      caras_extrusion: caras,
      fuelle: fuelle as any,
      microperforada: microperforada as any,
      material_a_extrudar: materialExtrudar,
      color_tela: colorTela,
      kilos_extrudados: kgExtrudados,
      metros_extrudados: mtsExtrudados,
      cantidad_bobinas: cantUnidExtrusion,
      dato_extra_extrusion: datoExtraExtrusion,
      extrusor,

      corte: corte as any,
      golpes_por_minuto: golpePorMinuto,
      pista: pista as any,
      fuelle_confeccion: fuelleConfeccion as any,
      perforado: perforado as any,
      bolsa_exhibidora: bolsaExhibidora as any,

      impresion_caras: impresionCaras as any,
      colores_impresion: coloresImpresion as any,
      impresion_lateral: impresionLateral as any,
      impresion_fondo: impresionFondo as any,
      cilindro,
      colores_detalle: colores,
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
        {/* ── Encabezado superior a lo largo (5 campos en una sola línea) ── */}
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
            id="top-cliente-id"
            label="ID Cliente"
            type="text"
            placeholder="ej. 00123"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            error={errors.clientId}
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
              <Input
                id="product-nombre"
                label="Producto"
                type="text"
                placeholder="ej. Bolsa polietileno 30x40"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                error={errors.producto}
                required
              />

              <Textarea
                id="product-description"
                label="Descripción"
                rows={1}
                placeholder="Escribe la descripción detallada..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />

              <div className="client-form__row">
                <Input
                  id="product-largo"
                  label="Largo"
                  type="text"
                  placeholder="ej. 120 cm o n/a"
                  value={largo}
                  suffix="cm"
                  onChange={(e) => setLargo(e.target.value)}
                />
                <Input
                  id="product-ancho"
                  label="Ancho"
                  type="text"
                  placeholder="ej. 80 cm"
                  value={ancho}
                  suffix="cm"
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
                  type="text"
                  placeholder="0.00"
                  value={cantidadKilos}
                  suffix="kg"
                  inputMode="decimal"
                  onChange={(e) =>
                    handleDecimalInput(e.target.value, setCantidadKilos)
                  }
                />
                <Input
                  id="product-metros"
                  label="Cant. Mts."
                  type="text"
                  placeholder="0.00"
                  value={cantidadMetros}
                  suffix="mts"
                  inputMode="decimal"
                  onChange={(e) =>
                    handleDecimalInput(e.target.value, setCantidadMetros)
                  }
                />
              </div>

              <Textarea
                id="product-extras"
                label="Observaciones"
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

              <TogglePill
                label="Microperforada"
                options={SI_NO_OPTIONS}
                value={microperforada}
                onChange={setMicroperforada}
              />

              <div className="client-form__row">
                <Input
                  id="extrusion-tubo"
                  label="Tubo"
                  type="text"
                  placeholder="ej. Tubo 50"
                  value={tubo}
                  onChange={(e) => setTubo(e.target.value)}
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
                <TogglePill
                  label="Fuelle"
                  options={SI_NO_OPTIONS}
                  value={fuelleConfeccion}
                  onChange={setFuelleConfeccion}
                />
                <TogglePill
                  label="Perforado"
                  options={SI_NO_OPTIONS}
                  value={perforado}
                  onChange={setPerforado}
                />
              </div>

              <TogglePill
                label="Bolsa exhibidora"
                options={SI_NO_OPTIONS}
                value={bolsaExhibidora}
                onChange={setBolsaExhibidora}
              />
            </div>
          </section>

          {/* ── Parte 4: Datos de impresión (Extremo derecho) ── */}
          <section className="client-form__column">
            <header className="client-form__section-header">
              <div className="client-form__badge">4</div>
              <h3 className="client-form__subtitle">Datos de impresión</h3>
            </header>

            <div className="client-form__fields">
              <TogglePill
                label="Impresión"
                options={IMPRESION_CARAS_OPTIONS}
                value={impresionCaras}
                onChange={setImpresionCaras}
              />

              <TogglePill
                label="1C – 2C – 3C – 4C – 5C – 6C"
                options={COLORES_OPTIONS}
                value={coloresImpresion}
                onChange={setColoresImpresion}
              />

              <div className="client-form__row">
                <TogglePill
                  label="Lateral"
                  options={SI_NO_OPTIONS}
                  value={impresionLateral}
                  onChange={setImpresionLateral}
                />
                <TogglePill
                  label="Fondo"
                  options={SI_NO_OPTIONS}
                  value={impresionFondo}
                  onChange={setImpresionFondo}
                />
              </div>

              <Input
                id="impresion-cilindro"
                label="Cilindro"
                type="text"
                placeholder="ej. C-12"
                value={cilindro}
                onChange={(e) => setCilindro(e.target.value)}
              />

              <Input
                id="impresion-colores"
                label="Colores"
                type="text"
                placeholder="ej. Rojo, azul, blanco"
                value={colores}
                onChange={(e) => setColores(e.target.value)}
              />
            </div>
          </section>
        </div>

        <footer className="client-form__actions">
          <Button type="submit" variant="primary">
            {assetToEdit ? 'Guardar Cambios' : 'Guardar Cliente'}
          </Button>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
        </footer>
      </form>
    </Modal>
  );
});
