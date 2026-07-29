import type { SystemAsset } from '../../types/assets.types';

interface ClientPrintSheetProps {
  asset: SystemAsset;
}

function formatDateDMY(dateStr?: string): string {
  if (!dateStr) return '';
  const trimmed = dateStr.trim();
  if (!trimmed) return '';
  
  // If already in DD/MM/YYYY format
  if (trimmed.includes('/')) return trimmed;

  // If in ISO format YYYY-MM-DD or YYYY-MM-DD HH:mm
  const datePart = trimmed.split('T')[0].split(' ')[0];
  const parts = datePart.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day}/${month}/${year}`;
  }

  return trimmed;
}

export function ClientPrintSheet({ asset }: ClientPrintSheetProps) {
  // Helpers para seleccionar la opción activa o vacía
  const isSelected = (val?: string, target?: string) => {
    if (!val || !target) return false;
    return val.toString().trim().toLowerCase() === target.toString().trim().toLowerCase();
  };

  const matCliente = asset.material_cliente?.toUpperCase() || 'NO';
  const tratadoVal = asset.tratado?.toUpperCase() || 'NO';
  const fuelleVal = asset.fuelle?.toUpperCase() || 'NO';
  const microVal = asset.microperforada?.toUpperCase() || 'NO';

  const carasExtrusion = asset.caras_extrusion || '1 cara';
  const corteVal = asset.corte?.toUpperCase() || 'LATERAL';
  const pistaVal = asset.pista?.toUpperCase() || 'SIMPLE';

  const impresionCaras = asset.impresion_caras?.toUpperCase() || '1 CARA';
  const coloresImp = asset.colores_impresion?.toUpperCase() || '1C';

  return (
    <div className="print-sheet-container">
      <div className="print-sheet">
        {/* ── Encabezado Principal ── */}
        <div className="print-sheet__header">
          <div className="print-sheet__header-cell print-sheet__header-cell--cliente">
            <span className="print-label">CLIENTE:</span>
            <span className="print-value">{asset.name || ''}</span>
          </div>
          <div className="print-sheet__header-cell">
            <span className="print-label">FECHA COMIENZO:</span>
            <span className="print-value">{formatDateDMY(asset.fecha_comienzo)}</span>
          </div>
          <div className="print-sheet__header-cell">
            <span className="print-label">FECHA FIN:</span>
            <span className="print-value">{formatDateDMY(asset.fecha_fin)}</span>
          </div>
          <div className="print-sheet__header-cell">
            <span className="print-label">FECHA ENTREGA:</span>
            <span className="print-value">{formatDateDMY(asset.fecha_entrega || asset.last_inspected)}</span>
          </div>
        </div>

        {/* ── Cuerpo Principal 4 Columnas ── */}
        <div className="print-sheet__body">
          {/* ── Columna 1: Producto Solicitado ── */}
          <div className="print-sheet__column">
            <div className="print-sheet__col-title">PRODUCTO SOLICITADO</div>
            
            <div className="print-field">
              <span className="print-field__label">DESCRIPCIÓN</span>
              <div className="print-field__content print-field__content--multiline">
                {asset.descripcion || asset.ip_address || ''}
              </div>
            </div>

            <div className="print-field print-field--subgrid">
              <span className="print-field__sublabel">MEDIDAS</span>
              <div className="print-field__row">
                <div>
                  <span className="print-micro-label">ANCHO</span>
                  <span className="print-value-box">{asset.ancho || ''}</span>
                </div>
                <div>
                  <span className="print-micro-label">LARGO</span>
                  <span className="print-value-box">{asset.largo || ''}</span>
                </div>
                <div>
                  <span className="print-micro-label">µ</span>
                  <span className="print-value-box">{asset.micrones || ''}</span>
                </div>
              </div>
            </div>

            <div className="print-field">
              <span className="print-field__label">CANTIDAD UNIDADES</span>
              <span className="print-field__val-line">{asset.cantidad_unidades || ''}</span>
            </div>

            <div className="print-field">
              <span className="print-field__label">CANTIDAD KILOS</span>
              <span className="print-field__val-line">{asset.cantidad_kilos || ''}</span>
            </div>

            <div className="print-field">
              <span className="print-field__label">CANTIDAD METROS</span>
              <span className="print-field__val-line">{asset.cantidad_metros || ''}</span>
            </div>

            <div className="print-field print-field--grow">
              <span className="print-field__label">Dato extra:</span>
              <span className="print-field__val-text">{asset.dato_extra_producto || ''}</span>
            </div>
          </div>

          {/* ── Columna 2: Datos de Extrusión ── */}
          <div className="print-sheet__column">
            <div className="print-sheet__col-title">DATOS DE EXTRUSIÓN</div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">MATERIAL DEL CLIENTE</span>
                <span className="print-options">
                  <strong className={isSelected(matCliente, 'SI') ? 'active-opt' : ''}>SI</strong> /{' '}
                  <strong className={isSelected(matCliente, 'NO') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">MATERIAL A EXTRUDAR</span>
                <span className="print-value-sm">{asset.material_a_extrudar || ''}</span>
              </div>
            </div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-options">TUBO / TUBO AB A 1 L / LAMINA</span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">COLOR DE TELA:</span>
                <span className="print-value-sm">{asset.color_tela || ''}</span>
              </div>
            </div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">TRATADO</span>
                <span className="print-options">
                  <strong className={isSelected(tratadoVal, 'SI') ? 'active-opt' : ''}>SI</strong> /{' '}
                  <strong className={isSelected(tratadoVal, 'NO') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">Kilos extrudados</span>
                <span className="print-value-sm">{asset.kilos_extrudados || ''}</span>
              </div>
            </div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-options">
                  <strong className={isSelected(carasExtrusion, '1 cara') ? 'active-opt' : ''}>1 CARA</strong> /{' '}
                  <strong className={isSelected(carasExtrusion, '2 caras') ? 'active-opt' : ''}>2 CARAS</strong>
                </span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">Metros extrudados</span>
                <span className="print-value-sm">{asset.metros_extrudados || ''}</span>
              </div>
            </div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">FUELLE</span>
                <span className="print-options">
                  <strong className={isSelected(fuelleVal, 'SI') ? 'active-opt' : ''}>SI</strong> {asset.fuelle_cm ? `${asset.fuelle_cm} cm` : ''} /{' '}
                  <strong className={isSelected(fuelleVal, 'NO') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">Cantidad de bobinas</span>
                <span className="print-value-sm">{asset.cantidad_bobinas || ''}</span>
              </div>
            </div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">Microperforada</span>
                <span className="print-options">
                  <strong className={isSelected(microVal, 'SI') ? 'active-opt' : ''}>SI</strong> /{' '}
                  <strong className={isSelected(microVal, 'NO') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">Dato extra</span>
                <span className="print-value-sm">{asset.dato_extra_extrusion || ''}</span>
              </div>
            </div>

            <div className="print-field print-field--bottom-box">
              <span className="print-field__label">EXTRUSOR:</span>
              <span className="print-field__val-text">{asset.extrusor || ''}</span>
            </div>
          </div>

          {/* ── Columna 3: Datos de Confección ── */}
          <div className="print-sheet__column">
            <div className="print-sheet__col-title">DATOS DE CONFECCIÓN</div>

            <div className="print-field">
              <span className="print-field__label">CORTE</span>
              <span className="print-options">
                <strong className={isSelected(corteVal, 'LATERAL') ? 'active-opt' : ''}>LATERAL</strong> /{' '}
                <strong className={isSelected(corteVal, 'FONDO') ? 'active-opt' : ''}>FONDO</strong>
              </span>
            </div>

            <div className="print-field">
              <span className="print-field__label">Golpes por minuto</span>
              <span className="print-field__val-line">{asset.golpes_por_minuto || ''}</span>
            </div>

            <div className="print-field">
              <span className="print-field__label">PISTA</span>
              <span className="print-options">
                <strong className={isSelected(pistaVal, 'SIMPLE') ? 'active-opt' : ''}>SIMPLE</strong> /{' '}
                <strong className={isSelected(pistaVal, 'DOBLE') ? 'active-opt' : ''}>DOBLE</strong> /{' '}
                <strong className={isSelected(pistaVal, 'TRIPLE') ? 'active-opt' : ''}>TRIPLE</strong>
              </span>
            </div>

            <div className="print-field">
              <span className="print-field__label">Dato extra</span>
              <span className="print-field__val-text">{asset.dato_extra_confeccion || ''}</span>
            </div>

            <div className="print-field">
              <span className="print-field__label">Cantidad resultante:</span>
              <span className="print-field__val-line">{asset.cantidad_resultante || ''}</span>
            </div>

            <div className="print-field">
              <span className="print-field__label">Bultos:</span>
              <span className="print-field__val-line">{asset.bultos || ''}</span>
            </div>

            <div className="print-field print-field--bottom-box">
              <span className="print-field__label">CONFECCIONISTA:</span>
              <span className="print-field__val-text">{asset.confeccionista || ''}</span>
            </div>
          </div>

          {/* ── Columna 4: Datos de Impresión ── */}
          <div className="print-sheet__column">
            <div className="print-sheet__col-title">DATOS DE IMPRESIÓN</div>

            <div className="print-field">
              <span className="print-field__label">IMPRESIÓN</span>
              <span className="print-options">
                <strong className={isSelected(impresionCaras, '1 CARA') || isSelected(impresionCaras, '1 CARA / 2 CARAS') ? 'active-opt' : ''}>1 CARA</strong> /{' '}
                <strong className={isSelected(impresionCaras, '2 CARAS') ? 'active-opt' : ''}>2 CARAS</strong>
              </span>
            </div>

            <div className="print-field">
              <span className="print-options print-options--colors">
                {['1C', '2C', '3C', '4C', '5C', '6C'].map((c, idx) => (
                  <span key={c}>
                    <strong className={isSelected(coloresImp, c) ? 'active-opt' : ''}>{c}</strong>
                    {idx < 5 ? ' / ' : ''}
                  </span>
                ))}
              </span>
            </div>

            <div className="print-field">
              <span className="print-field__label">Metros por hora</span>
              <span className="print-field__val-line">{asset.metros_por_hora || ''}</span>
            </div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">T puesta a punto</span>
                <span className="print-value-sm">{asset.t_puesta_a_punto || ''}</span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">T de impresión</span>
                <span className="print-value-sm">{asset.t_impresion || ''}</span>
              </div>
            </div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">Cilindro:</span>
                <span className="print-value-sm">{asset.cilindro || ''}</span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">Bobinas impresas</span>
                <span className="print-value-sm">{asset.bobinas_impresas || ''}</span>
              </div>
            </div>

            <div className="print-field">
              <span className="print-field__label">Colores:</span>
              <span className="print-field__val-text">{asset.colores_detalle || ''}</span>
            </div>

            <div className="print-field print-field--bottom-box">
              <span className="print-field__label">IMPRESOR:</span>
              <span className="print-field__val-text">{asset.impresor || ''}</span>
            </div>
          </div>
        </div>

        {/* ── Pie de Página: Observaciones ── */}
        <div className="print-sheet__footer">
          <span className="print-field__label">OBSERVACIONES:</span>
          <span className="print-field__val-text">{asset.observaciones || ''}</span>
        </div>
      </div>
    </div>
  );
}
