# Frontend Productos

**Frontend Productos** es una aplicación web para mostrar productos disponibles en stock, permitiendo a los usuarios elegir y comprar productos a través de una integración con la pasarela de pago.

El proyecto está desarrollado con **React** y organizado bajo el patrón de **Atomic Design** para facilitar la escalabilidad y mantenimiento del código. Se utiliza **Bootstrap** para el diseño responsivo y estilizado de la interfaz.

La aplicación está desplegada en **Render** y cuenta con pruebas unitarias utilizando **Vitest** con **Jest**

---

## Tecnologías utilizadas

- **React**: Librería principal para construir la interfaz de usuario.
- **Atomic Design**: Estructura organizada de componentes para facilitar la mantenibilidad.
- **Bootstrap**: Framework CSS para un diseño responsive y componentes estilizados.
- **Vitest**: Framework de pruebas para React, rápido y sencillo para pruebas unitarias y de integración.
- **API**: Pasarela de pago para procesar compras de forma segura.
- **Render**: Plataforma de despliegue y hosting de la aplicación.

---

## Demo en Vivo

Puedes acceder a la aplicación desplegada en el siguiente enlace:

🔗 [https://frontend-products-zpdo.onrender.com/](https://frontend-products-zpdo.onrender.com/)

---
## Guía de uso
1. ingrese al enlace: [https://frontend-products-zpdo.onrender.com/](https://frontend-products-zpdo.onrender.com/)
2. Navega por los productos disponibles en stock.
3. Selecciona el producto que deseas comprar.
4. Ingrese los datos de su tarjeta para comprar el producto.
5. Verifique los detalles de la compra
6. y confirme el pago y espera a que se procese la compra.


---

## Enlaces
- URL del sitio en producción: https://frontend-products-zpdo.onrender.com/
- Repositorio en GitHub: https://github.com/Ymbossio/Frontend-Products

---

## Cobertura Testing

File                        | % Stmts | % Branch | % Funcs | % Lines |
----------------------------|---------|----------|---------|---------|
All files                   |   98.98 |    91.26 |   94.44 |   98.98 |                  
 api                        |     100 |      100 |     100 |     100 |                  
  products.js               |     100 |      100 |     100 |     100 |                  
 components                 |   97.63 |    92.85 |    87.5 |   97.63 |                  
  PaymentModal.jsx          |     100 |    85.71 |     100 |     100 |            
  PaymentSummaryModal.jsx   |   94.64 |      100 |      80 |   94.64 |           
 hooks                      |   98.21 |    81.07 |     100 |   98.21 |                  
  usePaymentForms.js        |     100 |      100 |     100 |     100 |                  
  usePaymentProcess.js      |    97.7 |    85.15 |     100 |    97.7 |        
 pages                      |   96.22 |      100 |      82 |   96.22 |                  
  App.jsx                   |   96.22 |      100 |      97 |   96.22 |            
 redux                      |     100 |      100 |     100 |     100 |                  
  FormCardSlice.js          |     100 |      100 |     100 |     100 |                  
  ProductSlice.js           |     100 |      100 |     100 |     100 |                  
  TransactionSlice.js       |     100 |      100 |     100 |     100 |                  
  store.js                  |     100 |      100 |     100 |     100 |                  
 services                   |     100 |      100 |     100 |     100 |                  
  AcceptToken.js            |     100 |      100 |     100 |     100 |                  
  CreateDeliveries.js       |     100 |      100 |     100 |     100 |                  
  CreateTransferInternal.js |     100 |      100 |     100 |     100 |                  
  GetTransferById.js        |     100 |      100 |     100 |     100 |                  
  SendAcceptToken.js        |     100 |      100 |     100 |     100 |                  
  TokenizacionCard.js       |     100 |      100 |     100 |     100 |                  
  UpdateStock.js            |     100 |      100 |     100 |     100 |                  
  UpdateTransference.js     |     100 |      100 |     100 |     100 |                  
 util                       |     100 |    93.33 |     100 |     100 |                  
  functions.js              |     100 |    93.33 |     100 |     100 | 
  
---

## Autor
Yovanis Manuel Bossio Lambraño
