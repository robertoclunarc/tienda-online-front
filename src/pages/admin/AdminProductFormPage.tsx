import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ProductosService } from '../../services/productos.service';
import { ProductosImagenesService } from '../../services/productosImagenes.service';
import { CategoriasService } from '../../services/categorias.service';
import { SubCategoriasService } from '../../services/subcategorias.service'
import { Producto, Categoria, Subcategoria, Marca, Modelo, ProductoImagen } from '../../types';
import { MarcasService } from '../../services/marcas.service';
import { ModelosService } from '../../services/modelos.service';

interface ProductFormValues {
  idProducto?: number;
  nombreProducto: string;
  descProducto: string;
  precio: string;
  cantInventario: number;
  fkModelo: number;
  fkSubCategoria: number;
  estatus: string;
  imagenes: {
    id?: number;
    url: string;
    descripcion: string;
    esMiniatura: boolean;
    esPrincipal: boolean;
    isNew?: boolean;
    isDeleted?: boolean;
  }[];
}

const validationSchema = Yup.object({
  nombreProducto: Yup.string().required('El nombre es requerido'),
  precio: Yup.string().required('El precio es requerido')
    .test('is-price', 'Debe ser un precio válido', (value) => /^\d+(\.\d{1,2})?$/.test(value || '')),
  cantInventario: Yup.number().required('La cantidad en inventario es requerida')
    .min(0, 'La cantidad no puede ser negativa'),
  fkModelo: Yup.number().required('Debe seleccionar un modelo'),
  fkSubCategoria: Yup.number().required('Debe seleccionar una subcategoría'),
  estatus: Yup.string().required('El estatus es requerido'),
  imagenes: Yup.array().of(
    Yup.object().shape({
      url: Yup.string().required('La URL de la imagen es requerida'),
      descripcion: Yup.string(),
    })
  )
});

const AdminProductFormPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isEditing = !!productId;
  
  const [product, setProduct] = useState<Producto | null>(null);
  const [productImages, setProductImages] = useState<ProductoImagen[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategoria[]>([]);
  const [brands, setBrands] = useState<Marca[]>([]);
  const [models, setModels] = useState<Modelo[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategoria[]>([]);
  const [filteredModels, setFilteredModels] = useState<Modelo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [initialValues, setInitialValues] = useState<ProductFormValues>({
    nombreProducto: '',
    descProducto: '',
    precio: '',
    cantInventario: 0,
    fkModelo: 0,
    fkSubCategoria: 0,
    estatus: 'ACTIVO',
    imagenes: []
  });

  // Cargar datos iniciales
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [categoriesData, subcategoriesData, brandsData, modelsData] = await Promise.all([
          CategoriasService.getAll(),
          SubCategoriasService.getAll(),
          MarcasService.getAll(),
          ModelosService.getAll()
        ]);

        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setBrands(brandsData);
        setModels(modelsData);

        if (isEditing) {
          const productData = await ProductosService.getById(parseInt(productId));
          setProduct(productData);
          
          // Cargar imágenes del producto
          const productImagesData = await ProductosImagenesService.getByProductId(parseInt(productId));
          setProductImages(productImagesData);
          
          // Encontrar la categoría basada en la subcategoría
          const subcategory = subcategoriesData.find(sc => sc.idSubCategoria === productData.fkSubCategoria);
          if (subcategory) {
            setSelectedCategory(subcategory.fkCategoria);
            setFilteredSubcategories(subcategoriesData.filter(sc => sc.fkCategoria === subcategory.fkCategoria));
          }
          
          // Encontrar la marca basada en el modelo
          const model = modelsData.find((m: Modelo) => m.idModelo === productData.fkModelo);
          if (model) {
            setSelectedBrand(model.fkMarca);
            setFilteredModels(modelsData.filter((m: Modelo) => m.fkMarca === model.fkMarca));
          }
          
          // Preparar valores iniciales del formulario
          setInitialValues({
            idProducto: productData.idProducto,
            nombreProducto: productData.nombreProducto,
            descProducto: productData.descProducto || '',
            precio: productData.precio,
            cantInventario: productData.cantInventario,
            fkModelo: productData.fkModelo,
            fkSubCategoria: productData.fkSubCategoria,
            estatus: productData.estatus,
            imagenes: productImagesData.map(img => ({
              id: img.idImagen,
              url: img.imagen,
              descripcion: img.descImagen || '',
              esMiniatura: img.miniatura === 1,
              esPrincipal: img.principal === 1,
              isNew: false,
              isDeleted: false
            }))
          });
        }
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        toast.error('Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [productId, isEditing]);

  // Manejar cambio de categoría
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setFilteredSubcategories(subcategories.filter(sc => sc.fkCategoria === categoryId));
  };

  // Manejar cambio de marca
  const handleBrandChange = (brandId: number) => {
    setSelectedBrand(brandId);
    setFilteredModels(models.filter(m => m.fkMarca === brandId));
  };

  // Manejar envío del formulario
  const handleSubmit = async (values: ProductFormValues) => {
    
    try {
      let productId: number;

      // Convertir precio a string si es necesario
      let productData: Producto = {        
        nombreProducto:values.nombreProducto,
        descProducto: values.descProducto,
        precio: values.precio.toString(),
        cantInventario: values.cantInventario,
        fkModelo: values.fkModelo,
        fkSubCategoria: values.fkSubCategoria,
        estatus: values.estatus,
      };

      if (isEditing) {
        // Actualizar producto existente
        productId = values.idProducto!;
        productData.idProducto =  productId!;
        await ProductosService.update(productData.idProducto, productData);
      } else {
        // Crear nuevo producto
        const data = await ProductosService.create(productData);
        productId = data.id;
      }

      // Procesar imágenes
      const imagenPromises = values.imagenes.map(async (img) => {
        if (img.isDeleted && img.id) {
          // Eliminar imagen
          await ProductosImagenesService.delete(img.id);
          return null;
        } else if (img.isNew) {
          // Crear nueva imagen
          const imagenData: ProductoImagen = {
            descImagen: img.descripcion,
            imagen: img.url,
            miniatura: img.esMiniatura ? 1 : 0,
            principal: img.esPrincipal ? 1 : 0,
            fkProducto: productId
          };
          return ProductosImagenesService.create(imagenData);
        } else if (img.id) {
          // Actualizar imagen existente
          const imagenData: Partial<ProductoImagen> = {
            descImagen: img.descripcion,
            imagen: img.url,
            miniatura: img.esMiniatura ? 1 : 0,
            principal: img.esPrincipal ? 1 : 0
          };
          return ProductosImagenesService.update(img.id, imagenData);
        }
        return null;
      });

      await Promise.all(imagenPromises.filter(p => p !== null));

      toast.success(isEditing ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
      navigate('/admin/productos');
    } catch (error) {
      console.error('Error al guardar producto:', error);
      toast.error(isEditing ? 'Error al actualizar producto' : 'Error al crear producto');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={handleSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre del producto */}
                <div>
                  <label htmlFor="nombreProducto" className="block text-sm font-medium text-gray-700">
                    Nombre del producto*
                  </label>
                  <Field
                    type="text"
                    name="nombreProducto"
                    id="nombreProducto"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <ErrorMessage name="nombreProducto" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Precio */}
                <div>
                  <label htmlFor="precio" className="block text-sm font-medium text-gray-700">
                    Precio*
                  </label>
                  <Field
                    type="text"
                    name="precio"
                    id="precio"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <ErrorMessage name="precio" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Cantidad en inventario */}
                <div>
                  <label htmlFor="cantInventario" className="block text-sm font-medium text-gray-700">
                    Cantidad en inventario*
                  </label>
                  <Field
                    type="number"
                    name="cantInventario"
                    id="cantInventario"
                    min="0"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                  <ErrorMessage name="cantInventario" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Estado */}
                <div>
                  <label htmlFor="estatus" className="block text-sm font-medium text-gray-700">
                    Estado*
                  </label>
                  <Field
                    as="select"
                    name="estatus"
                    id="estatus"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="ACTIVO">Activo</option>
                    <option value="INACTIVO">Inactivo</option>
                  </Field>
                  <ErrorMessage name="estatus" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Categoría */}
                <div>
                  <label htmlFor="categoria" className="block text-sm font-medium text-gray-700">
                    Categoría*
                  </label>
                  <select
                    id="categoria"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={selectedCategory || ''}
                    onChange={(e) => handleCategoryChange(parseInt(e.target.value))}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categories.map(category => (
                      <option key={category.idCategoria} value={category.idCategoria}>
                        {category.descCategoria}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subcategoría */}
                <div>
                  <label htmlFor="fkSubCategoria" className="block text-sm font-medium text-gray-700">
                    Subcategoría*
                  </label>
                  <Field
                    as="select"
                    name="fkSubCategoria"
                    id="fkSubCategoria"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    disabled={!selectedCategory}
                  >
                    <option value="">Seleccione una subcategoría</option>
                    {filteredSubcategories.map(subcategory => (
                      <option key={subcategory.idSubCategoria} value={subcategory.idSubCategoria}>
                        {subcategory.descSubCategoria}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="fkSubCategoria" component="div" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Marca */}
                <div>
                  <label htmlFor="marca" className="block text-sm font-medium text-gray-700">
                    Marca*
                  </label>
                  <select
                    id="marca"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    value={selectedBrand || ''}
                    onChange={(e) => handleBrandChange(parseInt(e.target.value))}
                  >
                    <option value="">Seleccione una marca</option>
                    {brands.map(brand => (
                      <option key={brand.idMarca} value={brand.idMarca}>
                        {brand.descMarca}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Modelo */}
                <div>
                  <label htmlFor="fkModelo" className="block text-sm font-medium text-gray-700">
                    Modelo*
                  </label>
                  <Field
                    as="select"
                    name="fkModelo"
                    id="fkModelo"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    disabled={!selectedBrand}
                  >
                    <option value="">Seleccione un modelo</option>
                    {filteredModels.map(model => (
                      <option key={model.idModelo} value={model.idModelo}>
                        {model.descModelo}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="fkModelo" component="div" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label htmlFor="descProducto" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <Field
                  as="textarea"
                  name="descProducto"
                  id="descProducto"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Imágenes */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Imágenes del producto
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setFieldValue('imagenes', [
                        ...values.imagenes,
                        {
                          url: '',
                          descripcion: '',
                          esMiniatura: false,
                          esPrincipal: values.imagenes.length === 0, // Primera imagen es principal por defecto
                          isNew: true,
                          isDeleted: false
                        }
                      ]);
                    }}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <i className="fas fa-plus mr-1"></i> Añadir imagen
                  </button>
                </div>

                <FieldArray name="imagenes">
                  {({ remove }) => (
                    <div className="space-y-4">
                      {values.imagenes.map((_, index) => (
                        !values.imagenes[index].isDeleted && (
                          <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {/* URL de la imagen */}
                              <div className="md:col-span-2">
                                <label htmlFor={`imagenes.${index}.url`} className="block text-sm font-medium text-gray-700">
                                  URL de la imagen*
                                </label>
                                <Field
                                  type="text"
                                  name={`imagenes.${index}.url`}
                                  id={`imagenes.${index}.url`}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                                <ErrorMessage name={`imagenes.${index}.url`} component="div" className="mt-1 text-sm text-red-600" />
                              </div>

                              {/* Vista previa */}
                              <div className="flex justify-center items-center">
                                {values.imagenes[index].url && (
                                  <img 
                                    src={values.imagenes[index].url} 
                                    alt="Vista previa" 
                                    className="h-20 w-auto object-contain" 
                                    onError={(e) => (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Error+de+imagen'}
                                  />
                                )}
                              </div>

                              {/* Descripción */}
                              <div className="md:col-span-3">
                                <label htmlFor={`imagenes.${index}.descripcion`} className="block text-sm font-medium text-gray-700">
                                  Descripción
                                </label>
                                <Field
                                  type="text"
                                  name={`imagenes.${index}.descripcion`}
                                  id={`imagenes.${index}.descripcion`}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>

                              {/* Opciones */}
                              <div className="md:col-span-2 flex items-center space-x-4">
                                <label className="inline-flex items-center">
                                  <Field
                                    type="checkbox"
                                    name={`imagenes.${index}.esMiniatura`}
                                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Es miniatura</span>
                                </label>
                                <label className="inline-flex items-center">
                                  <Field
                                    type="checkbox"
                                    name={`imagenes.${index}.esPrincipal`}
                                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                                    onClick={() => {
                                      // Desmarcar otras imágenes como principales
                                      if (!values.imagenes[index].esPrincipal) {
                                        values.imagenes.forEach((_, i) => {
                                          if (i !== index) {
                                            setFieldValue(`imagenes.${i}.esPrincipal`, false);
                                          }
                                        });
                                      }
                                    }}
                                  />
                                  <span className="ml-2 text-sm text-gray-700">Es principal</span>
                                </label>
                              </div>

                              {/* Botón eliminar */}
                              <div className="md:col-span-1 flex justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (values.imagenes[index].id) {
                                      // Si tiene ID, marcar como eliminada
                                      setFieldValue(`imagenes.${index}.isDeleted`, true);
                                    } else {
                                      // Si es nueva, eliminar del array
                                      remove(index);
                                    }
                                  }}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <i className="fas fa-trash mr-1"></i> Eliminar
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  )}
                </FieldArray>
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate('/admin/productos')}
                  className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#1a3870] hover:bg-[#15305e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  {isEditing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AdminProductFormPage;