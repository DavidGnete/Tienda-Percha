
interface Product {
  title: string;
  price: number;
  quantity: number;
  size?: string;
  slug: string;
  image?: string;
}

interface OrderSummary {
  subTotal: number;
  tax: number;
  total: number;
  itemsInCart: number;
}

interface OrderData {
  products: Product[];
  summary: OrderSummary | null;
  orderDate?: string;
  checkoutUrl?: string;
}

/**
 * Formatea y envía un pedido a WhatsApp
 * @param orderData - Datos completos del pedido
 * @param phoneNumber - Número de WhatsApp (formato: 573001234567)
 */
export const WhattsapInformation = (
  orderData: OrderData,
  phoneNumber: string,

): void => {
  // Validar que haya productos
  if (!orderData.products || orderData.products.length === 0) {
    console.error('No hay productos en el pedido');
    throw new Error('No hay productos en el carrito para enviar');
    return;
  }

  // Validar que haya resumen
  if (!orderData.summary) {
    console.error('No hay resumen del pedido');
    throw new Error('Error al calcular el resumen del pedido');
    return;
  }

  // Crear el mensaje formateado
  const message = formatOrderMessage(orderData);

  // Codificar el mensaje para URL
  const encodedMessage = encodeURIComponent(message);

  // Crear la URL de WhatsApp
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Abrir WhatsApp en una nueva pestaña
  window.open(whatsappURL,"_blank");
};

/**
 * Formatea el mensaje del pedido para WhatsApp
 */
const formatOrderMessage = (
  orderData: OrderData,
  
): string => {
  const { products, summary, checkoutUrl } = orderData;

  if(!summary) return '';
  // Encabezado
  let message = '¡Hola, Tu Perchita! 🛍️ Vengo de su página web y este es mi pedido:\n';

  


  products.forEach((product, index) => {
    message += `\n${index + 1}. *${product.title}*\n`;
    if (product.size) message += `   • Talla/opción: ${product.size}\n`;
    message += `   • Cantidad: ${product.quantity}\n`;
    message += `   • Precio unitario: $${product.price.toLocaleString('es-CO')}\n`;
    message += `   • Subtotal: $${(product.price * product.quantity).toLocaleString('es-CO')}\n`;
  });

  // Resumen
  message += '\n─────────────────\n';
  message += '*Total DEL PEDIDO:*\n\n';
  message += `TOTAL: $${summary.total.toLocaleString('es-CO')}\n\n`;
  message += `Artículos: ${summary.itemsInCart}\n`;

   if (checkoutUrl) {
    message += '🔗 Ver pedido completo:\n';
    message += `${checkoutUrl}\n`;
  }

  return message;
};

/**
 * Valida el formato del número de teléfono
 */
export const validatePhoneNumber = (phone: string): boolean => {
  // Remover espacios y caracteres especiales
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Validar que solo contenga números y tenga al menos 10 dígitos
  const phoneRegex = /^\d{10,15}$/;
  
  return phoneRegex.test(cleanPhone);
};

/**
 * Limpia el número de teléfono para el formato de WhatsApp
 */
export const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/[\s\-\(\)]/g, '');
};