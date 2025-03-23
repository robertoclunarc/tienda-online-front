// Interfaces de productos
export interface Producto {
    idProducto?: number;
    nombreProducto: string;
    descProducto: string | null;
    precio: string;
    cantInventario: number;
    fkModelo: number;
    fkSubCategoria: number;
    estatus: string;
    nombreMarca?: string;
    nombreModelo?: string;
    nombreCategoria?: string;
    nombreSubCategoria?: string;
  }
  
  // Interfaces de categorías
  export interface Categoria {
    idCategoria: number;
    descCategoria: string;
  }
  
  export interface Subcategoria {
    idSubCategoria: number;
    descSubCategoria: string;
    fkCategoria: number;
  }
  
  // Interfaces de marcas y modelos
  export interface Marca {
    idMarca: number;
    descMarca: string;
  }
  
  export interface Modelo {
    idModelo: number;
    descModelo: string;
    fkMarca: number;
    nombreMarca?: string;
  }
  
  // Interfaces de ofertas
  export interface Oferta {
    idOferta: number;
    descOferta: string;
    descuento: string;
    inicioOferta: string;
    finOferta: string;
    estatusOferta: string;
  }
  
  // Interfaces de usuario
  export interface Usuario {
    idCuentaUser: number;
    nombreUser: string | null;
    emailUser: string;
    tlfUser: string | null;
    estatus: string;
    roleUser: string;
  }
  
  // Interfaces de carrito
  export interface ItemCarrito {
    idCarrito: number;
    fkProducto: number;
    cantProducto: number;
    montoTotal: string;
    fkCuentaUser: number;
    estatusCarrito: string;
    nombreProducto?: string;
    precio?: string;
    nombreCategoria?: string;
  }
  
  // Interfaces de lista de deseos
  export interface ItemListaDeseos {
    idLista: number;
    fkCuentaUser: number;
    fkProducto: number;
    fechaRegsitro: string;
    nombreProducto?: string;
    precio?: string;
    nombreCategoria?: string;
  }

  export interface ProductoImagen {
    idImagen?: number;
    descImagen?: string;
    imagen: string;
    miniatura?: number; // 1 o 0 para true o false
    principal?: number; // 1 o 0 para true o false
    fkProducto: number;
  }