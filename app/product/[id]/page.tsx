import { notFound } from "next/navigation";
import { getProductById } from "@/app/lib/services/seller";
import ProductDetailClient from "../../components/products/ProductDetailClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const p = await getProductById(resolvedParams.id);

  if (!p) {
    notFound();
  }

  return <ProductDetailClient p={p} />;
}
