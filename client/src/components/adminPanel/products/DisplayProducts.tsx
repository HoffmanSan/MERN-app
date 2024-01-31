// IMPORTS
import { useState, useMemo } from "react";
import { useProductsContext } from "../../../hooks/useContextHooks/useProductsContext";
import { useImagesAPI } from "../../../hooks/useImagesAPI";
import { useDataAPI } from "../../../hooks/useDataAPI";
import { useDebounce } from "../../../hooks/useDebounce";

// COMPONENTS
import { LoadingSpinner } from "../../index";

// TYPES
import { Product } from "../../../types/types";
type DisplayProductsProps = {
  changePanel: (v: string) => void
  setUpdatedProduct: (product: Product) => void
}

export default function DisplayProducts({changePanel, setUpdatedProduct}: DisplayProductsProps) {
  // LOCAL STATES
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  // GLOBAL STATES & UTILITIES
  const { products, dispatchProducts } = useProductsContext();
  const { deleteImages } = useImagesAPI();
  const { deleteDocument } = useDataAPI();

  // ---- SEARCH BAR LOGIC ---- \\
  const debouncedQuery = useDebounce(query, 500);

  const filteredProducts = useMemo(() => {
    if (!debouncedQuery) {
      return products
    }
    return products.filter(item => {
      return Object.values(item).some(el => 
        el.toString().toLowerCase().includes(debouncedQuery.toString().toLowerCase())
      )
    })
  }, [debouncedQuery, products]);

  // ---- DELETE PRODUCT ---- \\
  const deleteProduct = async (product: Product) => {
    setIsDeleting(product._id);
    setError("");

    try {
      const response = await deleteDocument("products", product._id);
      await deleteImages("products", product.cloudinaryFolderId);
      dispatchProducts({ type: "DELETE_PRODUCT", payload: [response.product] });
    }
    catch (error: any) {
      console.log(error);
      setError(error.message);
    }
    finally {
      setIsDeleting(null);
    }
  };

  return (
    <>
      <div className="flex justify-center m-6 text-white">

        {/* search bar */}
        <input
          type="text"
          id="product-search-bar"
          className="w-3/12 p-2 text-center text-black border border-orange-400 rounded-md max-tablet:text-sm max-mobile:w-full max-tablet:w-6/12"
          placeholder="Szukaj..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

      </div>

      {error && <div className="mx-auto mb-5 error max-tablet:text-sm">{error}</div>}

      {/* products table */}
      <table id="products-table" className="w-11/12 mx-auto border border-orange-400">

        <thead className="text-lg font-bold text-white max-tablet:hidden">
          <tr>
            <td>Nazwa</td>
            <td>Cena</td>
            <td>Pozostało</td>
            <td>Dodano</td>
            <td>Kategorie</td>
            <td>Opis</td>
            <td>Obrazy</td>
            <td>Opcje</td>
          </tr>
        </thead>

        <tbody className="max-tablet:flex max-tablet:flex-col">
          {filteredProducts && filteredProducts.map(product => (
            <tr key={product._id} className="max-tablet:flex max-tablet:flex-col max-tablet:items-center max-tablet:h-fit">
              <td className="w-2/12 max-tablet:bg-orange-400 max-tablet:text-white max-tablet:font-bold">{product.name.slice(0, 50)}{product.name.length >= 50 && "..."}</td>
              <td className="w-2/12">{product.price} zł / szt.</td>
              <td className="w-1/12">{product.inStock} szt.</td>
              <td className="w-1/12">{(new Date(product.createdAt)).toLocaleDateString('pl-PL')}</td>
              <td className="w-2/12">
                {product.categories.map(category => {
                  if (product.categories.indexOf(category)!== product.categories.length - 1) {
                    return category + ", "
                  }
                    return category
                })}
              </td>
              <td className="w-3/12">{product.description.slice(0, 75)}{product.description.length >= 75 && "..."}</td>
              <td className="w-2/12">
                {product.photoURLs.map(item => (
                  <a key={item}
                    href={item}
                    target="_blank"
                    rel="noreferrer"
                    className="m-1 !p-1 !rounded-none btn max-tablet:text-xs"
                  >
                    {1 + product.photoURLs.indexOf(item)}
                  </a>
                ))}
              </td>
              <td>

                <button
                  className="m-1 btn max-tablet:text-xs"
                  onClick={() => {
                    setUpdatedProduct(product);
                    changePanel("Edit");
                  }}
                >
                  Edytuj
                </button>

                <button
                  className="m-1 btn max-tablet:text-xs"
                  disabled={isDeleting !== null}
                  onClick={() => deleteProduct(product)}
                >
                  {isDeleting === product._id ? <LoadingSpinner /> : "Usuń"}
                </button>

              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </>
  )
}
