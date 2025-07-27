export enum TipoInforme {
  REGISTRO_COMPRAS = 'REGISTRO_COMPRAS',
  REGISTRO_VENTAS = 'REGISTRO_VENTAS',
}

export const TipoInformeDescripcion: { [key in TipoInforme]: string } = {
  [TipoInforme.REGISTRO_COMPRAS]: 'Registro de Compras (SIRE)',
  [TipoInforme.REGISTRO_VENTAS]: 'Registro de Ventas (SIRE)'
};


