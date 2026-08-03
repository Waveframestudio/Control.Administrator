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

export function AssetModal({ isOpen, onClose, onSubmit, assetToEdit }: AssetModalProps) {
  // Campos del encabezado horizontal
  const [clientName, setClientName] = useState('');
  const [clientId, setClientId] = useState('');
  const [fechaComienzo, setFechaComienzo] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  /**
   * Mascara de fecha: auto-inserta '/' al tipear solo dígitos.
   * Resultado: dd/mm/aaaa
   */
  const handleDateInput = (
    raw: string,
    prev: string,
    setter: (v: string) => void
  ) => {
    // Permitir borrado libre
    if (raw.length < prev.length) {
      setter(raw);
      return;
    }
    // Solo dígitos y '/' (filtra el resto)
    const digits = raw.replace(/[^\d]/g, '');
    let formatted = '';
    if (digits.length <= 2) {
      formatted = digits;
    } else if (digits.length <= 4) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    } else {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
    }
    setter(formatted);
  };

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

  // Parte 4: Datos de impresión
  const [impresionCaras, setImpresionCaras] = useState('1 cara');
  const [coloresImpresion, setColoresImpresion] = useState('1C');
  const [mtsPorHora, setMtsPorHora] = useState('');
  const [tPuestaAPunto, setTPuestaAPunto] = useState('');
  const [tImpresion, setTImpresion] = useState('');
  const [cilindro, setCilindro] = useState('');
  const [bobinasImpresas, setBobinasImpresas] = useState('');
  const [colores, setColores] = useState('');
  const [impresor, setImpresor] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

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
      setFechaComienzo(toDMY(assetToEdit.fecha_comienzo));
      setFechaFin(toDMY(assetToEdit.fecha_fin));
      setDeliveryDate(toDMY(assetToEdit.fecha_entrega));

      setDescripcion(assetToEdit.descripcion || assetToEdit.ip_address || '');
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
      setDatoExtraConfeccion(assetToEdit.dato_extra_confeccion || '');
      setCantResultante(assetToEdit.cantidad_resultante?.toString() || '');
      setBultos(assetToEdit.bultos?.toString() || '');
      setConfeccionista(assetToEdit.confeccionista || '');

      setImpresionCaras(assetToEdit.impresion_caras || '1 cara');
      setColoresImpresion(assetToEdit.colores_impresion || '1C');
      setMtsPorHora(assetToEdit.metros_por_hora?.toString() || '');
      setTPuestaAPunto(assetToEdit.t_puesta_a_punto || '');
      setTImpresion(assetToEdit.t_impresion || '');
      setCilindro(assetToEdit.cilindro || '');
      setBobinasImpresas(assetToEdit.bobinas_impresas?.toString() || '');
      setColores(assetToEdit.colores_detalle || '');
      setImpresor(assetToEdit.impresor || '');
      setErrors({});
    } else {
      // Reset form
      setClientName('');
      setClientId('');
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

      setImpresionCaras('1 cara');
      setColoresImpresion('1C');
      setMtsPorHora('');
      setTPuestaAPunto('');
      setTImpresion('');
      setCilindro('');
      setBobinasImpresas('');
      setColores('');
      setImpresor('');
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
      client_id: clientId.trim(),
      ip_address: descripcion.trim(),
      category: 'Workstation',
      status: 'Active',
      criticality: 'Medium',

      fecha_comienzo: fechaComienzo,
      fecha_fin: fechaFin,
      fecha_entrega: deliveryDate,

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
      dato_extra_confeccion: datoExtraConfeccion,
      cantidad_resultante: cantResultante,
      bultos,
      confeccionista,

      impresion_caras: impresionCaras as any,
      colores_impresion: coloresImpresion as any,
      metros_por_hora: mtsPorHora,
      t_puesta_a_punto: tPuestaAPunto,
      t_impresion: tImpresion,
      cilindro,
      bobinas_impresas: bobinasImpresas,
      colores_detalle: colores,
      impresor,
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
          />
          <Input
            id="top-fecha-comienzo"
            label="Fecha comienzo"
            type="text"
            placeholder="dd/mm/aaaa"
            value={fechaComienzo}
            inputMode="numeric"
            maxLength={10}
            onChange={(e) =>
              handleDateInput(e.target.value, fechaComienzo, setFechaComienzo)
            }
          />
          <Input
            id="top-fecha-fin"
            label="Fecha fin"
            type="text"
            placeholder="dd/mm/aaaa"
            value={fechaFin}
            inputMode="numeric"
            maxLength={10}
            onChange={(e) =>
              handleDateInput(e.target.value, fechaFin, setFechaFin)
            }
          />
          <Input
            id="top-fecha-entrega"
            label="Fecha entrega"
            type="text"
            placeholder="dd/mm/aaaa"
            value={deliveryDate}
            inputMode="numeric"
            maxLength={10}
            onChange={(e) =>
              handleDateInput(e.target.value, deliveryDate, setDeliveryDate)
            }
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

          {/* ── Parte 4: Datos de impresión (Extremo derecho) ── */}
          <section className="client-form__column">
            <header className="client-form__section-header">
              <div className="client-form__badge">4</div>
              <h3 className="client-form__subtitle">Datos de impresión</h3>
            </header>

            <div className="client-form__fields">
              <div className="client-form__row">
                <TogglePill
                  label="Impresión"
                  options={IMPRESION_CARAS_OPTIONS}
                  value={impresionCaras}
                  onChange={setImpresionCaras}
                />
                <Input
                  id="impresion-mts-hora"
                  label="Mts por hora"
                  type="number"
                  placeholder="0"
                  value={mtsPorHora}
                  onChange={(e) => setMtsPorHora(e.target.value)}
                />
              </div>

              <TogglePill
                label="1C – 2C – 3C – 4C – 5C – 6C"
                options={COLORES_OPTIONS}
                value={coloresImpresion}
                onChange={setColoresImpresion}
              />

              <div className="client-form__row">
                <Input
                  id="impresion-t-puesta-punto"
                  label="T puesta a punto"
                  type="text"
                  placeholder="ej. 00:30"
                  value={tPuestaAPunto}
                  onChange={(e) => setTPuestaAPunto(e.target.value)}
                />
                <Input
                  id="impresion-t-impresion"
                  label="T de impresión"
                  type="text"
                  placeholder="ej. 02:15"
                  value={tImpresion}
                  onChange={(e) => setTImpresion(e.target.value)}
                />
              </div>

              <div className="client-form__row">
                <Input
                  id="impresion-cilindro"
                  label="Cilindro"
                  type="text"
                  placeholder="ej. C-12"
                  value={cilindro}
                  onChange={(e) => setCilindro(e.target.value)}
                />
                <Input
                  id="impresion-bobinas"
                  label="Bobinas impresas"
                  type="number"
                  placeholder="0"
                  value={bobinasImpresas}
                  onChange={(e) => setBobinasImpresas(e.target.value)}
                />
              </div>

              <Input
                id="impresion-colores"
                label="Colores"
                type="text"
                placeholder="ej. Rojo, azul, blanco"
                value={colores}
                onChange={(e) => setColores(e.target.value)}
              />

              <Input
                id="impresion-impresor"
                label="Impresor"
                type="text"
                placeholder="ej. Nombre del operario"
                value={impresor}
                onChange={(e) => setImpresor(e.target.value)}
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
}
