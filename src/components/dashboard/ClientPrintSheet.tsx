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
  const impresionCaras = (asset.impresion_caras || '1 CARA').toUpperCase();
  const coloresImp = (asset.colores_impresion || '').toUpperCase();

  return (
    <div className="print-sheet-container">
      <div className="print-sheet">
        {/* ── Encabezado Principal ── */}
        <div className="print-sheet__header">
          <div className="print-sheet__header-cell print-sheet__header-cell--cliente">
            <img src="/logo.png" alt="RD Plast" className="print-sheet__logo" style={{ width: '18px', height: '18px', maxWidth: '18px', maxHeight: '18px', objectFit: 'contain', marginRight: '6px' }} />
            <div className="print-client-box">
              <div className="print-client-row">
                <span className="print-label">CLIENTE:</span>
                <span className="print-value">{asset.name || ''}</span>
              </div>
              {asset.client_id ? (
                <div className="print-client-id">
                  ID: {asset.client_id}
                </div>
              ) : null}
            </div>
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
            
            {asset.producto ? (
              <div className="print-field">
                <span className="print-field__label">PRODUCTO</span>
                <span className="print-field__val-line">{asset.producto}</span>
              </div>
            ) : null}

            <div className="print-field">
              <span className="print-field__label">DESCRIPCIÓN</span>
              <div className="print-field__content print-field__content--multiline">
                {asset.descripcion || asset.ip_address || ''}
              </div>
            </div>

            <div className="print-field print-field--subgrid">
              <div className="print-field__sublabel-bar">MEDIDAS</div>
              <div className="print-field__row" style={{ gridTemplateColumns: asset.micrones ? 'repeat(3, 1fr)' : '1fr 1fr' }}>
                <div>
                  <span className="print-micro-label">ANCHO</span>
                  <span className="print-value-box">{asset.ancho || ''}</span>
                </div>
                <div>
                  <span className="print-micro-label">LARGO</span>
                  <span className="print-value-box">{asset.largo || ''}</span>
                </div>
                {asset.micrones ? (
                  <div>
                    <span className="print-micro-label">MICRONES (µ)</span>
                    <span className="print-value-box">{asset.micrones}</span>
                  </div>
                ) : null}
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

            <div className="print-field print-field--grow">
              <span className="print-field__label">CANTIDAD METROS</span>
              <span className="print-field__val-line">{asset.cantidad_metros || ''}</span>
            </div>
          </div>

          {/* ── Columna 2: Datos de Extrusión ── */}
          <div className="print-sheet__column">
            <div className="print-sheet__col-title">DATOS DE EXTRUSIÓN</div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">MATERIAL CLIENTE</span>
                <span className="print-options">
                  <strong className={isSelected(matCliente, 'SI') ? 'active-opt' : ''}>SI</strong> /{' '}
                  <strong className={isSelected(matCliente, 'NO') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">TRATADO</span>
                <span className="print-options">
                  <strong className={isSelected(tratadoVal, 'SI') ? 'active-opt' : ''}>SI</strong> /{' '}
                  <strong className={isSelected(tratadoVal, 'NO') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
            </div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">CARAS</span>
                <span className="print-options">
                  <strong className={isSelected(carasExtrusion, '1 cara') ? 'active-opt' : ''}>1 CARA</strong> /{' '}
                  <strong className={isSelected(carasExtrusion, '2 caras') ? 'active-opt' : ''}>2 CARAS</strong>
                </span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">FUELLE</span>
                <span className="print-options">
                  <strong className={isSelected(fuelleVal, 'SI') ? 'active-opt' : ''}>SI</strong> /{' '}
                  <strong className={isSelected(fuelleVal, 'NO') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
            </div>

            <div className="print-field">
              <span className="print-field__label">MICROPERFORADA</span>
              <span className="print-options">
                <strong className={isSelected(microVal, 'SI') ? 'active-opt' : ''}>SI</strong> /{' '}
                <strong className={isSelected(microVal, 'NO') ? 'active-opt' : ''}>NO</strong>
              </span>
            </div>

            <div className="print-field">
              <span className="print-field__label">TUBO:</span>
              <span className="print-field__val-line">{asset.tubo_tipo || ''}</span>
            </div>

            <div className="print-field print-field--grow">
              <span className="print-field__label">COLOR DE TELA:</span>
              <span className="print-field__val-line">{asset.color_tela || ''}</span>
            </div>
          </div>

          {/* ── Columna 3: Datos de Confección ── */}
          <div className="print-sheet__column">
            <div className="print-sheet__col-title">DATOS DE CONFECCIÓN</div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">CORTE</span>
                <span className="print-options">
                  <strong className={isSelected(corteVal, 'LATERAL') ? 'active-opt' : ''}>LATERAL</strong> /{' '}
                  <strong className={isSelected(corteVal, 'FONDO') ? 'active-opt' : ''}>FONDO</strong>
                </span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">GOLPES / MIN</span>
                <span className="print-value-sm">{asset.golpes_por_minuto || ''}</span>
              </div>
            </div>

            <div className="print-field">
              <span className="print-field__label">PISTA</span>
              <span className="print-options">
                <strong className={isSelected(pistaVal, 'SIMPLE') ? 'active-opt' : ''}>SIMPLE</strong> /{' '}
                <strong className={isSelected(pistaVal, 'DOBLE') ? 'active-opt' : ''}>DOBLE</strong> /{' '}
                <strong className={isSelected(pistaVal, 'TRIPLE') ? 'active-opt' : ''}>TRIPLE</strong>
              </span>
            </div>

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">FUELLE</span>
                <span className="print-options">
                  <strong className={isSelected(asset.fuelle_confeccion, 'si') ? 'active-opt' : ''}>SI</strong> /{' '}
                  <strong className={isSelected(asset.fuelle_confeccion, 'no') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">PERFORADO</span>
                <span className="print-options">
                  <strong className={isSelected(asset.perforado, 'si') ? 'active-opt' : ''}>SI</strong> /{' '}
                  <strong className={isSelected(asset.perforado, 'no') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
            </div>

            <div className="print-field print-field--grow">
              <span className="print-field__label">BOLSA EXHIBIDORA</span>
              <span className="print-options">
                <strong className={isSelected(asset.bolsa_exhibidora, 'si') ? 'active-opt' : ''}>SI</strong> /{' '}
                <strong className={isSelected(asset.bolsa_exhibidora, 'no') ? 'active-opt' : ''}>NO</strong>
              </span>
            </div>
          </div>

          {/* ── Columna 4: Datos de Impresión ── */}
          <div className="print-sheet__column">
            <div className="print-sheet__col-title">DATOS DE IMPRESIÓN</div>

            <div className="print-field">
              <span className="print-field__label">IMPRESIÓN</span>
              <span className="print-options">
                <strong className={isSelected(impresionCaras, '1 CARA') ? 'active-opt' : ''}>1 CARA</strong> /{' '}
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

            <div className="print-split-row">
              <div className="print-split-cell">
                <span className="print-label-sm">LATERAL</span>
                <span className="print-options">
                  <strong className={isSelected(asset.impresion_lateral, 'si') ? 'active-opt' : ''}>SI</strong> /{' '}
                  <strong className={isSelected(asset.impresion_lateral, 'no') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
              <div className="print-split-cell">
                <span className="print-label-sm">FONDO</span>
                <span className="print-options">
                  <strong className={isSelected(asset.impresion_fondo, 'si') ? 'active-opt' : ''}>SI</strong> /{' '}
                  <strong className={isSelected(asset.impresion_fondo, 'no') ? 'active-opt' : ''}>NO</strong>
                </span>
              </div>
            </div>

            <div className="print-field">
              <span className="print-field__label">CILINDRO:</span>
              <span className="print-field__val-line">{asset.cilindro || ''}</span>
            </div>

            <div className="print-field print-field--grow">
              <span className="print-field__label">COLORES:</span>
              <span className="print-field__val-text">{asset.colores_detalle || ''}</span>
            </div>
          </div>
        </div>

        {/* ── Pie de Página: Observaciones ── */}
        <div className="print-sheet__footer">
          <span className="print-field__label">OBSERVACIONES:</span>
          <span className="print-field__val-text">{asset.observaciones || asset.dato_extra_producto || ''}</span>
        </div>
      </div>
    </div>
  );
}
