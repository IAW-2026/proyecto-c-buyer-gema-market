// proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// =========================
// RUTAS PÚBLICAS
// =========================
// Agregá acá todas las rutas que NO requieren login.
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/seller(.*)",
  "/api/shipping(.*)",
  "/api/payments(.*)",
  "/product(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Si la ruta NO es pública, requiere autenticación
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    /*
     * Ejecuta el middleware en todas las rutas excepto:
     * - archivos estáticos
     * - _next
     * - imágenes
     */
    "/((?!_next|.*\\..*).*)",

    // También protege API routes y server actions
    "/(api|trpc)(.*)",
  ],
};
