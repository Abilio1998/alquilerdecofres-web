import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { encode } from 'js-base64';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button, Form, Spinner, Alert, Toast } from 'react-bootstrap';
import { firestore } from '../../firebase-config';
import { collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, orderBy, limit } from 'firebase/firestore';

const CheckoutForm = ({ 
    totalCost, 
    personalInfo, 
    onPaymentSuccess, 
    city,
    deliveryDate,
    returnCity,
    returnDate,
    referenceNumber,
    product,
    acceptTerms,
    selectedReferenceNumber,
    insuranceCost,
    extraCost,
    deleteLastReservation,
    productImage ,
    deliveryTime,
    Nameproduct
}) => {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState({
        show: false,
        message: '',
        variant: 'success',
    });

    
    const [emailError, setEmailError] = useState('');

    const handleRedirect = (reservationData) => {
        const encodedPath = encode('/payment');
        navigate(`/${encodedPath}`, { state: reservationData });
    };

    const showToastNotification = (message, variant = 'success') => {
        setShowToast({
            show: true,
            message,
            variant,
        });
        setTimeout(() => setShowToast({ show: false, message: '', variant }), 5000);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    

    const confirmReservationCheckoutForm = async () => {
        await deleteLastReservation(); 
    
        // Validar el correo electrónico
        if (!validateEmail(personalInfo.email)) {
            setEmailError('Por favor, introduce un correo electrónico válido.');
            return;
        } else {
            setEmailError(''); // Resetear el error si el email es válido
        }
    
        if (!acceptTerms) {
            showToastNotification('Debes aceptar las condiciones.', 'danger');
            return;
        }
    
        try {
            // Validar valores antes de usarlos
            const safeTotalCost = totalCost || 0; // Usa 0 si totalCost es undefined
            const safeInsuranceCost = insuranceCost || 0; // Usa 0 si insuranceCost es undefined
            const safeExtraCost = extraCost || 0; // Usa 0 si extraCost es undefined
            //const safeTitle = product?.title || "Producto sin título"; // Asegurarse de que `title` no sea undefined
            const safeProductId = product?.productId || "Producto sin ID"; // Asegurarse de que `productId` no sea undefined
    
            // Asegurarse de que la información personal esté bien definida
            const safePersonalInfo = {
                name: personalInfo?.name || "Sin nombre",
                email: personalInfo?.email || "sinemail@ejemplo.com",
                phone: personalInfo?.phone || "0000000000",
            };
    
            const reservationData = {
                productId: safeProductId,
                reservedDate: new Date().toISOString(),
                city,
                deliveryDate,
                returnCity,
                returnDate,
                totalCost: safeTotalCost,
                insuranceCost: safeInsuranceCost,
                extraCost: safeExtraCost,
                personalInfo: safePersonalInfo, // Usar datos personales seguros
                referenceNumber: selectedReferenceNumber,
                deliveryTime,
                Nameproduct
            };
    
            console.log("Datos que se enviarán a Firestore:", reservationData);  // Verificación de los valores
    
            // Agregar reserva a la colección "reserved"
            const reservedCollection = collection(firestore, 'reserved');
            await addDoc(reservedCollection, reservationData);
    
            const productsCollection = collection(firestore, 'products');
            const q = query(productsCollection, where('identifier', '==', product.identifier));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const doc = querySnapshot.docs[0];
                const productData = doc.data();
    
                // Asegurarse de que productData.quantity esté definido
                const currentQuantity = productData.quantity ? parseInt(productData.quantity, 10) : 0;
                if (currentQuantity <= 0) {
                    showToastNotification('No hay suficiente stock para completar la reserva.', 'danger');
                    return;
                }
    
                const updatedQuantity = Math.max(currentQuantity - 1, 0);
                const currentReservedProduct = parseInt(productData.reservedProduct || '0', 10);
                const updatedReservedProduct = currentReservedProduct + 1;
    
                // Actualizar referenceNumbers
                const currentReferenceNumbersArray = (productData.referenceNumbers || '').split(',').map(ref => ref.trim());
                const updatedReferenceNumbersArray = currentReferenceNumbersArray.filter(ref => ref !== selectedReferenceNumber);
                const updatedReferenceNumbersString = updatedReferenceNumbersArray.join(', ');
    
                // Agregar a usedReferenceNumbers
                const currentUsedReferenceNumbersArray = (productData.usedReferenceNumbers || '').split(',').map(ref => ref.trim());
                currentUsedReferenceNumbersArray.push(selectedReferenceNumber);
                const updatedUsedReferenceNumbersString = currentUsedReferenceNumbersArray.join(', ');
    
                // Actualizar documento en Firestore
                await updateDoc(doc.ref, {
                    quantity: updatedQuantity,
                    reservedProduct: updatedReservedProduct,
                    referenceNumbers: updatedReferenceNumbersString,
                    usedReferenceNumbers: updatedUsedReferenceNumbersString
                });
            } else {
                showToastNotification('No se encontró el producto con el identifier:');
            }
    
            // Eliminar la última reserva si es necesario
            const reservationsCollection = collection(firestore, 'reservations');
            const qReservations = query(reservationsCollection, orderBy('createdAt', 'desc'), limit(1));
            const queryReservationsSnapshot = await getDocs(qReservations);
    
            if (!queryReservationsSnapshot.empty) {
                const docToDelete = queryReservationsSnapshot.docs[0];
                await deleteDoc(docToDelete.ref);
            }
    
            showToastNotification('Reserva confirmada');
        } catch (error) {
            showToastNotification('Ocurrió un error al confirmar la reserva.', 'danger');
            console.error("Error al confirmar la reserva:", error);  // Verifica si hay un error en el proceso
        }
    };
    
    

    const handlePayment = async (paymentMethod) => {
        try {
            // Validar que totalCost sea un número positivo
             if (isNaN(totalCost) || totalCost <= 0) {
                setError('El monto debe ser un número positivo.');
                return;
            }
    
            const response = await fetch('https://powerful-island-47968-ef36e59b26b2.herokuapp.com/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: totalCost, // Mantener el totalCost en centavos como cadena
                    personalInfo: {
                        email: personalInfo.email,
                        name: personalInfo.name,
                        phone: personalInfo.phone,
                    },
                    city,
                    deliveryDate,
                    returnCity,
                    returnDate,
                    referenceNumber,
                    extraCost,
                    insuranceCost,
                    deliveryTime,
                    Nameproduct
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en la respuesta del servidor.');
            }
    
            const { clientSecret } = await response.json();
            const { error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethod.id,
            });
    
            if (confirmError) throw new Error(confirmError.message);
    
            // Guardar en Firestore la información del pago primero
            await addDoc(collection(firestore, 'reservedPersonal'), {
                ...personalInfo,
                totalCost: totalCost.toString(), // Asegúrate de que sea cadena
                paymentMethodId: paymentMethod.id,
                reservedDate: new Date().toISOString(), // Almacenar como cadena
                city,
                deliveryDate,
                returnCity,
                returnDate,
                referenceNumber,
                deliveryTime,
                Nameproduct
            });
    
            // Confirmar la reserva después de realizar el pago
            await confirmReservationCheckoutForm();
    
            // Redirigir a la página de pago con los datos de la reserva
            const reservationData = {
                personalInfo,
                city,
                deliveryDate,
                returnCity,
                returnDate,
                referenceNumber,
                totalCost,
                insuranceCost,
                extraCost,
                productImage,
                deliveryTime,
                Nameproduct
            };
    
            // Notificación de éxito y redirección final
            onPaymentSuccess();
            handleRedirect(reservationData);  // Redirigir después de que todo esté completo
    
        } catch (err) {
            setError(err.message || 'Error al procesar el pago. Intenta nuevamente.');
        }
    };
    
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null); // Limpiar errores previos

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            await handlePayment(paymentMethod);
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Detalles de Pago</Form.Label>
                    <CardElement />
                    {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                    {emailError && <Alert variant="danger" className="mt-3">{emailError}</Alert>}
                </Form.Group>
                <Button type="submit" disabled={!stripe || loading}>
                    {loading ? (
                        <>
                            <Spinner as="span" animation="border" size="sm" className="me-2" />
                            Procesando...
                        </>
                    ) : (
                        'Pagar'
                    )}
                </Button>
            </Form>

            {/* Toast Notification */}
            <Toast
                onClose={() => setShowToast({ ...showToast, show: false })}
                show={showToast.show}
                delay={5000}
                autohide
                style={{ position: 'fixed', bottom: '20px', right: '20px', color: 'white', fontSize: '1.8rem', width: '100%', padding: '0 20px' }}
                bg={showToast.variant}
            >
                <Toast.Body>{showToast.message}</Toast.Body>
            </Toast>
        </>
    );
};

export default CheckoutForm;
