/**
 * CategoryListServer
 *
 * Server Component que obtiene las categorías desde la API/BD y
 * las pasa al CategoryList (Client Component).
 */

import { getCategories } from "@/app/lib/services/seller";
import { CategoryList } from "@/app/components/features/home/CategoryList";

export default async function CategoryListServer() {
  const categories = await getCategories();
  return <CategoryList categories={categories} />;
}
