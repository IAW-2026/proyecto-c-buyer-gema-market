"use client";

import React, { useState, useMemo, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  TopBar,
  Input,
  Icon,
  Pill,
  EmptyState,
  Button,
  ProductGlyph,
} from "@/app/components/ui";
import { ProductCard } from "../components/products/ProductCard";
import {
  UH_PRODUCTS as products,
  UH_CATEGORIES as categoryData,
} from "@/app/lib/data";

const fmtARS = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

export default function SearchPage() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceMax, setPriceMax] = useState(100000);
  const [cats, setCats] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [sort, setSort] = useState("relevant");
  const [view, setView] = useState("grid");

  const updatePriceMax = (value: string | number) => {
    const next = Number(value);
    if (!Number.isFinite(next)) return setPriceMax(0);
    setPriceMax(Math.min(150000, Math.max(0, next)));
  };

  const filtered = useMemo(() => {
    let r = [...products];
    if (q) r = r.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()));
    if (cats.length) r = r.filter((p) => cats.includes(p.category));
    if (conditions.length)
      r = r.filter((p) => conditions.some((c) => p.condition.includes(c)));
    r = r.filter((p) => p.price <= priceMax);

    if (sort === "price-asc") r.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") r.sort((a, b) => b.price - a.price);
    if (sort === "rating") r.sort((a, b) => b.rating - a.rating);

    return r;
  }, [q, cats, conditions, priceMax, sort]);

  const toggle = (
    arr: string[],
    setArr: React.Dispatch<React.SetStateAction<string[]>>,
    v: string,
  ) => setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="pb-6">
      <TopBar back title="Buscar" />
      <div className="px-4 py-3 border-b border-line flex gap-2">
        <div className="flex-1">
          <Input
            icon="search"
            placeholder="Sillón, mesa, lámpara…"
            value={q}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQ(e.target.value)
            }
            autoFocus
          />
        </div>
        <button
          onClick={() => setShowFilters(true)}
          className="w-[46px] h-[46px] rounded-r2 bg-bone flex items-center justify-center relative active:scale-95 transition-transform"
        >
          <Icon name="sliders" size={20} />
          {cats.length + conditions.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-clay" />
          )}
        </button>
      </div>

      <div className="px-4 py-3 flex justify-between items-center">
        <span className="text-[13px] text-ink-3 font-mono">
          {filtered.length} resultados
        </span>
        <div className="flex gap-1.5">
          <select
            value={sort}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setSort(e.target.value)
            }
            className="bg-bone border-0 rounded-full px-3 py-1.5 text-[13px] font-sans outline-none cursor-pointer"
          >
            <option value="relevant">Relevancia</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="rating">Mejor valorados</option>
          </select>
          <button
            onClick={() => setView(view === "grid" ? "list" : "grid")}
            className="w-8 h-8 rounded-full bg-bone flex items-center justify-center active:scale-90 transition-transform"
          >
            <Icon name={view === "grid" ? "list" : "grid"} size={16} />
          </button>
        </div>
      </div>

      <div className="px-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon="search"
            title="Nada por acá"
            body="Probá con otros términos o quitá filtros."
            action={
              <Button
                variant="secondary"
                onClick={() => {
                  setQ("");
                  setCats([]);
                  setConditions([]);
                  setPriceMax(100000);
                }}
              >
                Limpiar filtros
              </Button>
            }
          />
        ) : view === "grid" ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 animate-in fade-in duration-300">
            {filtered.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => router.push("/product/" + p.id)}
                className="flex gap-3.5 p-3 bg-paper border border-line rounded-[18px] cursor-pointer"
              >
                <div
                  className="w-24 h-24 rounded-r2 flex items-center justify-center shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${p.palette[0]}33, ${p.palette[1]}33)`,
                  }}
                >
                  <ProductGlyph kind={p.glyph} palette={p.palette} size={56} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-ink-3 font-mono">
                    {p.seller}
                  </div>
                  <div className="text-sm font-medium mb-1">{p.title}</div>
                  <div className="text-xs text-ink-3">{p.condition}</div>
                  <div className="mt-2 text-base font-semibold">
                    {fmtARS(p.price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showFilters && (
        <div
          onClick={() => setShowFilters(false)}
          className="fixed inset-0 bg-black/40 z-[80] flex items-end animate-in fade-in duration-300"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-paper w-full max-w-[600px] mx-auto rounded-t-[28px] p-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom-full duration-300"
          >
            <div className="w-10 h-1 bg-line-2 rounded-full mx-auto mb-5" />
            <div className="flex justify-between items-center mb-5">
              <h3 className="m-0 text-xl font-semibold">Filtros</h3>
              <button
                onClick={() => {
                  setCats([]);
                  setConditions([]);
                  setPriceMax(100000);
                }}
                className="text-[13px] text-moss font-medium"
              >
                Limpiar
              </button>
            </div>

            <div className="mb-6">
              <h4 className="text-[13px] m-0 mb-3 text-ink-2">Categoría</h4>
              <div className="flex flex-wrap gap-1.5">
                {categoryData.map((c) => (
                  <Pill
                    key={c.id}
                    active={cats.includes(c.id)}
                    onClick={() => toggle(cats, setCats, c.id)}
                    icon={c.icon}
                    size="md"
                  >
                    {c.name}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-[13px] m-0 mb-3 text-ink-2">Condición</h4>
              <div className="flex flex-wrap gap-1.5">
                {["Nuevo", "Usado"].map((c) => (
                  <Pill
                    key={c}
                    active={conditions.includes(c)}
                    onClick={() => toggle(conditions, setConditions, c)}
                    size="md"
                  >
                    {c}
                  </Pill>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <h4 className="text-[13px] m-0 text-ink-2">Precio máximo</h4>
                <span className="text-[13px] font-mono font-semibold">
                  {fmtARS(priceMax)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="150000"
                step="1000"
                value={priceMax}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updatePriceMax(e.target.value)
                }
                className="w-full mb-2.5 [accent-color:#333d29]"
              />
              <Input
                suffix="ARS"
                type="number"
                min="0"
                max="150000"
                step="1000"
                value={priceMax}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  updatePriceMax(e.target.value)
                }
              />
            </div>

            <Button full size="lg" onClick={() => setShowFilters(false)}>
              Mostrar {filtered.length} resultados
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
