import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore } from '../../firebase-config';
import { Modal } from 'react-bootstrap';
import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchBar from './SearchBar';
import ReservaForm from './ReservaForm';

const InsertProduct = () => {

  const [showModal, setShowModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
const [showReservaForm, setShowReservaForm] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });


  const [productId, setProductId] = useState('');
  const [title, setTitle] = useState('');
  const [Nameproduct, setNameproduct] = useState(true);
  const [identifierPrefix, setIdentifierPrefix] = useState('PRD'); // Valor por defecto PRD
  const [usedReferenceNumbers, setUsedReferenceNumbers] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reservedProduct, setReservedProduct] = useState('');
  const [referenceNumbers, setReferenceNumbers] = useState('');
  const [blockedNumbers, setBlockedNumbers] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [pricing, setPricing] = useState('');
  const [pricingUnitary, setPricingUnitary] = useState('');
  const [dayliPrice, setDayliPrice] = useState('');
  const [availability, setAvailability] = useState(true);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [details, setDetails] = useState({
    detail1: '',
    detail2: '',
    detail3: '',
    detail4: '',
    detail5: '',
    detail6: '',
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'products'), (snapshot) => {
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
      setFilteredProducts(productsList);
    });

    return () => unsubscribe();
  }, []);

  const generateId = () => {
    const uniqueId = uuidv4();
    setProductId(uniqueId);
  };

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const handleDetailChange = (e) => {
    setDetails({
      ...details,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!productId || !title || !referenceNumbers) {
      setAlert({ show: true, message: 'Por favor, complete los campos obligatorios: ID, Título, Números de referencia.', type: 'danger' });
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 10000);
      
      return;
    }
  
    const referenceNumbersString = typeof referenceNumbers === 'string' ? referenceNumbers : '';
  
    let uploadedImageUrl = '';
    if (image) {
      const imageRef = ref(storage, `products/${productId}/${image.name}`);
      await uploadBytes(imageRef, image);
      uploadedImageUrl = await getDownloadURL(imageRef);
      setImageUrl(uploadedImageUrl);
    }
  
    const referenceNumbersArray = referenceNumbersString.split(',').map(num => num.trim()).filter(num => num !== '');
  
    const productData = {
      productId,
      title,
      Nameproduct,
      identifier: referenceNumbersArray[0] ? `${identifierPrefix}${referenceNumbersArray[0]}` : '', // Aquí se usa el prefijo seleccionado
      quantity: quantity ? `${quantity}` : '',
      reservedProduct: reservedProduct ? `${reservedProduct}` : '',
      usedReferenceNumbers: usedReferenceNumbers ? `${usedReferenceNumbers}` : '',
      referenceNumbers: referenceNumbersArray.join(', '),
      blockedNumbers: blockedNumbers ? blockedNumbers : '',
      dimensions: dimensions ? ` ${dimensions}` : '',
      pricing: pricing ? ` ${pricing}` : '',
      pricingUnitary: pricingUnitary ? ` ${pricingUnitary}` : '',
      dayliPrice: dayliPrice ? ` ${dayliPrice}` : '',
      availability,
    };
  
    if (uploadedImageUrl) productData.imageUrl = uploadedImageUrl;
    Object.keys(details).forEach((key) => {
      if (details[key]) productData[key] = details[key];
    });
  
    try {
      if (editingProductId) {
        // Actualizar producto existente
        await updateDoc(doc(firestore, 'products', editingProductId), productData);
        setAlert({ show: true, message: 'Producto actualizado exitosamente', type: 'success' });
        setTimeout(() => {
          setAlert({ show: false, message: '', type: '' });
        }, 10000);
        setEditingProductId(null);
      } else {
        // Agregar nuevo producto
        await addDoc(collection(firestore, 'products'), productData);
        setAlert({ show: true, message: 'Producto agregado exitosamente', type: 'success' });
        setTimeout(() => {
          setAlert({ show: false, message: '', type: '' });
        }, 10000);
      }
      clearForm();
    } catch (error) {
      setAlert({ show: true, message: `Error al agregar/actualizar el producto: ${error}`, type: 'danger' });
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
      }, 10000);
    }
  };
  

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setProductId(product.productId);
    setTitle(product.title);
    setNameproduct(product.Nameproduct)
    setQuantity(product.quantity);
    setReservedProduct(product.reservedProduct);
    setUsedReferenceNumbers(product.usedReferenceNumbers);
    setReferenceNumbers(product.referenceNumbers);
    setBlockedNumbers(product.blockedNumbers);
    setDimensions(product.dimensions);
    setPricing(product.pricing);
    setPricingUnitary(product.pricingUnitary);
    setDayliPrice(product.dayliPrice);
    setAvailability(product.availability);
    setImageUrl(product.imageUrl);
    setDetails({
      detail1: product.detail1 || '',
      detail2: product.detail2 || '',
      detail3: product.detail3 || '',
      detail4: product.detail4 || '',
      detail5: product.detail5 || '',
      detail6: product.detail6 || '',
    });
  };

  

  const handleConfirmDelete = (productId) => {
    setProductIdToDelete(productId);
    setShowModal(true);
  };
  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(firestore, 'products', productId));
      setAlert({ show: true, message: 'Producto eliminado exitosamente', type: 'success' });
      // Cerrar la alerta después de 10 segundos
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
    }, 10000); // 10000 milisegundos = 10 segundos
      setShowModal(false); // Esto debe cerrar el modal

    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      setAlert({ show: true, message: `Error al eliminar el producto ${error}`, type: 'danger' });
       // Cerrar la alerta después de 10 segundos
       setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
    }, 10000); // 10000 milisegundos = 10 segundos
    }
  };
  const clearForm = () => {
    setProductId('');
    setTitle('');
    setNameproduct('');
    setQuantity('');
    setReservedProduct('');
    setReferenceNumbers('');
    setUsedReferenceNumbers('');
    setBlockedNumbers('');
    setDimensions('');
    setPricing('');
    setPricingUnitary('');
    setDayliPrice('');
    setAvailability(true);
    setImage(null);
    setImageUrl('');
    setDetails({
      detail1: '',
      detail2: '',
      detail3: '',
      detail4: '',
      detail5: '',
      detail6: '',
    });
  };

  const handlePricingUnitaryChange = (e) => {
    let value = e.target.value;
  
    // Elimina símbolos de moneda existentes si los hay y cualquier espacio innecesario
    value = value.replace(/[^0-9.,]/g, '').trim();
  
    // Asegúrate de que el valor tiene formato correcto (opcional)
    setPricingUnitary(value ? `${value} €` : '');
  };

  const handleDayliPriceChange = (e) => {
    let value = e.target.value;
  
    // Elimina símbolos de moneda existentes si los hay y cualquier espacio innecesario
    value = value.replace(/[^0-9.,]/g, '').trim();
  
    // Asegúrate de que el valor tiene formato correcto (opcional)
    setDayliPrice(value ? `${value} €` : '');
  };

  return (
    <div className="container mt-5">
      <h2>{editingProductId ? 'Modificar Producto' : 'Insertar Producto'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <button type="button" className="btn btn-primary" onClick={generateId}>
            Generar ID
          </button>
          <p className="mt-2">ID: {productId}</p>
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de Identificador: Ej"PRD = COFRE || PBC = PORTABICICLETA || BRA = BARRA || SBB = SILLA BEBE"</label>
          <select
            className="form-select"
            value={identifierPrefix}
            onChange={(e) => setIdentifierPrefix(e.target.value)} // Actualiza el prefijo
            required
          >
            <option value="PRD">PRD</option>
            <option value="PBC">PBC</option>
            <option value="SBB">SBB</option>
            <option value="BRA">BRA</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Selecciona una opción:</label>
          <select
            className="form-select"
            value={Nameproduct}
            onChange={(e) => setNameproduct(e.target.value)}
          >
            <option value="cofre">Cofre</option>
            <option value="portabicicletas">Portabicicletas</option>
            <option value="sillaBebe">Silla bebé</option>
            <option value="barra">Barra</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Número de Cofre (sueltos, separados por comas):</label>
          <input
            type="text"
            className="form-control"
            value={referenceNumbers}
            onChange={(e) => setReferenceNumbers(e.target.value)}
            placeholder="Ejemplo: 221, 265, 266"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Número de Cofre "RESERVADO":</label>
          <input
            type="text"
            className="form-control"
            value={usedReferenceNumbers}
            onChange={(e) => setUsedReferenceNumbers(e.target.value)}
            placeholder=""
            
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Título del producto (obligatorio):</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Cantidad:</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))} // Asegurar que sea un número
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Producto Alquilado:</label>
          <input
            type="number"
            className="form-control"
            value={reservedProduct}
            onChange={(e) => setReservedProduct(Number(e.target.value))} // Asegurar que sea un número
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Medidas:</label>
          <input
            type="text"
            className="form-control"
            value={dimensions}
            onChange={(e) => setDimensions(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Gama de precios:</label>
          <input
            type="text"
            className="form-control"
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precios Unitarios:</label>
          <input
            type="text"
            className="form-control"
            value={pricingUnitary}
            onChange={handlePricingUnitaryChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Precios diarios:</label>
          <input
            type="text"
            className="form-control"
            value={dayliPrice}
            onChange={handleDayliPriceChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Disponibilidad:</label>
          <select
            className="form-select"
            value={availability}
            onChange={(e) => setAvailability(e.target.value === 'true')}
          >
            <option value="true">Disponible</option>
            <option value="false">No disponible</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Imagen del producto:</label>
          <input
            type="file"
            className="form-control"
            onChange={handleImageUpload}
          />
          {imageUrl && <img src={imageUrl} alt="Imagen del producto" className="img-fluid mt-2" />}
        </div>
        {[...Array(6)].map((_, i) => (
          <div className="mb-3" key={i}>
            <label className="form-label">Detalle {i + 1}:</label>
            <input
              type="text"
              className="form-control"
              name={`detail${i + 1}`}
              value={details[`detail${i + 1}`]}
              onChange={handleDetailChange}
            />
          </div>
        ))}
        <button type="submit" className="btn btn-success">
          {editingProductId ? 'Modificar Producto' : 'Agregar Producto'}
        </button>
      </form>
      <hr />
      {/* Componente de búsqueda */}
      <SearchBar products={products} onFilteredProducts={setFilteredProducts} />
      <button className="btn btn-primary" onClick={() => setShowReservaForm(true)}>
        Reservar
      </button>

      {showReservaForm && (
        <ReservaForm onClose={() => setShowReservaForm(false)} />
      )}
      {/* Lista de productos filtrados */}
      <div className="mt-5">
        <h3>Lista de Productos</h3>
        <div className="row">
          {filteredProducts.length > 0 ? filteredProducts.map((product) => (
            <div className="col-md-4" key={product.id}>
              <Card className="mb-3">
                {product.imageUrl && <Card.Img variant="top" src={product.imageUrl} />} 
                <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">ID: {product.productId}</Card.Subtitle>
                  <Card.Text><strong>Número de Cofre:</strong> {product.referenceNumbers}</Card.Text>
                  <Card.Text><strong>Número de Cofre "RESERVADO":</strong> {product.usedReferenceNumbers}</Card.Text>
                  <Card.Text><strong>Cantidad:</strong> {product.quantity}</Card.Text>
                  <Card.Text><strong>Producto Alquilado:</strong> {product.reservedProduct}</Card.Text>
                  <Card.Text><strong>Medidas:</strong> {product.dimensions}</Card.Text>
                  <Card.Text><strong>Gama de precios:</strong> {product.pricing}</Card.Text>
                  <Card.Text><strong>Precios Unitarios:</strong> {product.pricingUnitary}</Card.Text>
                  <Card.Text><strong>Precios diarios:</strong> {product.dayliPrice}</Card.Text>
                  <Card.Text><strong>Disponibilidad:</strong> {product.availability ? 'Disponible' : 'No disponible'}</Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => handleEdit(product)} 
                    disabled={editingProductId !== null && editingProductId !== product.id} // Deshabilitar si se está editando otro producto
                  >
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleConfirmDelete(product.id)}>Eliminar</Button>
                </Card.Body>
              </Card>
              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  ¿Estás seguro de que deseas eliminar este producto?
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancelar
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(productIdToDelete)}>
                    Eliminar
                  </Button>
                </Modal.Footer>
              </Modal>
              {alert.show && (
                  <div className={`alert alert-${alert.type} mt-3`} role="alert">
                    {alert.message}
                  </div>
                )}
            </div>
          )) : (
            <p>No se encontraron productos.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsertProduct;
