import React, { useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const PaymentTermsPage = () => {


   useEffect(() => {
    // Crear la meta etiqueta
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex';

    // Añadirla al head
    document.head.appendChild(meta);

    // Limpiar cuando el componente se desmonte (por si acaso)
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <Container className='mt-5'>
      <Row className="justify-content-center">
        <Col md={8}>
            <h4 style={{marginTop:'100px'}}>Términos y Condiciones de Pago</h4>
            <hr />
          <p>
            Al proceder con el pago en nuestro sitio web o aplicación, usted confirma que ha leído, comprendido y aceptado los siguientes términos y condiciones relacionados con el procesamiento de pagos, la política de reembolsos, y otros aspectos importantes del servicio proporcionado por <strong>Alquilo Cofres</strong>.
          </p>
          <h5>Precios y costes asociados</h5>
            <p>
              Todos los precios mostrados en nuestra plataforma incluyen el IVA aplicable y los costes asociados al funcionamiento del servicio, incluyendo:
            </p>
            <ul>
              <li>Comisiones por procesamiento de pagos (Stripe u otros métodos autorizados).</li>
              <li>Gastos tecnológicos y de infraestructura (como alojamiento en servidores Heroku).</li>
            </ul>
            <p>
              El importe final mostrado antes de realizar el pago será el precio total a abonar por el cliente. No se aplicarán cargos adicionales tras confirmar la operación.
            </p>


          <h5>1. Autorización de Pago</h5>
          <p>
            Al hacer clic en el botón "Aceptar y Pagar", usted está autorizando a <strong>Alquilo Cofres</strong> a cargar el monto total especificado en su método de pago seleccionado (ya sea tarjeta de crédito, débito u otro método de pago disponible). Este monto puede incluir impuestos aplicables, tarifas adicionales de servicio o envío, de acuerdo con la política vigente en el momento de la transacción.
          </p>

          <h5>2. Confirmación de Datos</h5>
          <p>
            Usted garantiza que la información proporcionada para el pago es precisa y está actualizada. Cualquier error en la información de la tarjeta de crédito, débito o cualquier otro medio de pago podría dar lugar a la imposibilidad de procesar la transacción. <strong>Alquilo Cofres</strong> no se hace responsable de transacciones fallidas debido a la introducción incorrecta de los datos por parte del usuario.
          </p>

          <h5>3. Política de Reembolsos y Cancelaciones</h5>
          <p>
            a. Todas las transacciones realizadas a través de nuestro sistema son <strong>finales y no reembolsables</strong>, salvo en circunstancias específicas estipuladas en nuestra Política de Reembolsos.
            <br />
            b. En caso de que solicite la cancelación de un pedido antes de su procesamiento o envío, <strong>Alquilo Cofres</strong> evaluará la posibilidad de emitir un reembolso.
          </p>

          <h5>4. Seguridad de Datos y Privacidad</h5>
          <p>
            <strong>Alquilo Cofres</strong> toma muy en serio la protección de su información personal. Todos los datos de pago son procesados a través de una pasarela de pago segura y cumplen con las regulaciones internacionales de protección de datos.
          </p>

          <h5>5. Errores en la Transacción</h5>
          <p>
            En caso de un error en el procesamiento de la transacción, <strong>Alquilo Cofres</strong> se reserva el derecho de corregir cualquier transacción realizada incorrectamente. Si detecta un cargo erróneo, debe contactarnos de inmediato.
          </p>

          <h5>6. Uso del Servicio</h5>
          <p>
            El pago le otorga el derecho a utilizar el servicio o producto por el cual ha pagado, en conformidad con los términos específicos del contrato con <strong>Alquilo Cofres</strong>.
          </p>

          <h5>7. Cambios en los Términos de Pago</h5>
          <p>
            <strong>Alquilo Cofres</strong> se reserva el derecho de modificar estos términos en cualquier momento. Le recomendamos revisar estos términos antes de realizar cada transacción.
          </p>

          <h5>8. Jurisdicción y Legislación Aplicable</h5>
          <p>
            Todos los pagos realizados a <strong>Alquilo Cofres</strong> están sujetos a la legislación aplicable. Las disputas relacionadas con los pagos deberán resolverse en los tribunales competentes de la jurisdicción donde opera la empresa.
          </p>

          <h5>9. Aceptación de Términos</h5>
          <p>
            Al proceder con la transacción, usted acepta estos términos y confirma que es el titular autorizado del método de pago utilizado.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#555' }}>
            Para más información o consultas relacionadas con los pagos, puede contactarnos en: <br />
            <strong>Alquilo Cofres</strong><br />
            Dirección: Cami Ral 218-220, 08301 - Mataró - España<br />
            Email: alquilocofres@gmail.com
          </p>

        </Col>
      </Row>
    </Container>
  );
};

export default PaymentTermsPage;
