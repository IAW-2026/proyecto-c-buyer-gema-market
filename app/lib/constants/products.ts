/**
 * Tamaño de página fijo para la grilla de productos de la home.
 *
 * Se trata como valor invariable del frontend: siempre se refleja en la URL y
 * cualquier intento del usuario de modificarlo via query param es ignorado
 * (page.tsx redirige al valor correcto).
 */
export const PRODUCTS_PAGE_SIZE = 8;
