import { getCategories } from "@/app/lib/services/seller";

export default async function CategoryFilter() {
  const categories = await getCategories();

  return (
    <ul className="space-y-2">
      {categories.map((cat) => (
        <li key={cat.category_id}>
          <label
            htmlFor={`filter-cat-${cat.category_id}`}
            className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <input
              id={`filter-cat-${cat.category_id}`}
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
            />
            {cat.name}
          </label>
        </li>
      ))}
    </ul>
  );
}
