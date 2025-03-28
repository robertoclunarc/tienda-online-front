// Interfaces de productos
export interface Producto {
    idproducto?: number;
    nombreproducto: string;
    descproducto: string | null;
    precio: string;
    cantinventario: number;
    fkmodelo: number;
    fksubcategoria: number;
    estatus: string;
    nombremarca?: string;
    nombremodelo?: string;
    nombrecategoria?: string;
    nombresubcategoria?: string;
  }
  
  // Interfaces de categorías
  export interface Categoria {
    idcategoria: number;
    desccategoria: string;
  }
  
  export interface Subcategoria {
    idsubcategoria: number;
    descsubcategoria: string;
    fkcategoria: number;
  }
  
  // Interfaces de marcas y modelos
  export interface Marca {
    idmarca: number;
    descmarca: string;
  }
  
  export interface Modelo {
    idmodelo: number;
    descmodelo: string;
    fkmarca: number;
    nombremarca?: string;
  }
  
  // Interfaces de ofertas
  export interface Oferta {
    idoferta: number;
    descoferta: string;
    descuento: string;
    iniciooferta: string;
    finoferta: string;
    estatusoferta: string;
  }
  
  // Interfaces de usuario
  export interface Usuario {
    idcuentauser: number;
    nombreuser: string | null;
    emailuser: string;
    tlfuser: string | null;
    estatus: string;
    roleuser: string;
  }
  
  // Interfaces de carrito
  export interface ItemCarrito {
    idcarrito: number;
    fkproducto: number;
    cantproducto: number;
    montototal: string;
    fkcuentaUser: number;
    estatuscarrito: string;
    nombreproducto?: string;
    precio?: string;
    nombrecategoria?: string;
  }
  
  // Interfaces de lista de deseos
  export interface ItemListaDeseos {
    idlista: number;
    fkcuentauser: number;
    fkproducto: number;
    fecharegsitro: string;
    nombreproducto?: string;
    precio?: string;
    nombrecategoria?: string;
  }

  export interface ProductoImagen {
    idimagen?: number;
    descimagen?: string;
    imagen: string;
    miniatura?: number; // 1 o 0 para true o false
    principal?: number; // 1 o 0 para true o false
    fkproducto: number;
  }