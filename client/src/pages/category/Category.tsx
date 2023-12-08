// IMPORTS
import { useParams } from "react-router-dom";
import { useState, useMemo } from "react";
import { useProductsContext } from "../../hooks/useContextHooks/useProductsContext";
import { useDebounce } from "../../hooks/useDebounce";

// COMPONENTS
import { ProductCard } from "../../components";

export default function Category() {
  // LOCAL STATES
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);

  // GLOBAL STATES & UTILITIES
  const { products } = useProductsContext();
  const params = useParams() as { categoryName: string };
  const categoryName = params.categoryName;
  
  // ---- DEBOUNCED FILTERING BY PRICE ---- \\
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  if (maxPrice === 0) {
    setMaxPrice(99999);
  }

  // ---- GET PRODUCTS THAT BELONG IN SEARCHED CATEGORY ---- \\
  const categoryProducts = useMemo(() => {
    return products.filter(item => item.categories.includes(categoryName));
  }, [products, categoryName]);
  
  // ---- FILTER CATEGORY PRODUCTS BY PRICE ---- \\
  const categoryProductsFilteredByPrice = categoryProducts.filter(item => item.price >= Number(debouncedMinPrice) && item.price <= Number(debouncedMaxPrice));
  
  return (
    <>
      {categoryProducts.length !== 0 ? 
        <>
          <div className="w-3/12 p-3 mx-auto mt-6 bg-white shadow-md max-mobile:w-9/12 max-laptop:w-5/12">
            <h2 className="text-center max-tablet:text-lg">Cena</h2>
            <form className="text-center">

              <input 
                type="number"
                placeholder="od"
                className="w-3/12 px-2 py-1 my-1 border border-black max-mobile:w-5/12 max-tablet:w-4/12 max-laptop:w-3/12"
                onChange={(e) => setMinPrice(Number(e.target.value))}
              />

              <span className="mx-3">-</span>
              
              <input 
                type="number"
                placeholder="do"
                className="w-3/12 px-2 py-1 my-1 border border-black max-mobile:w-5/12 max-tablet:w-4/12 max-laptop:w-3/12"
                onChange={(e) => setMaxPrice(Number(e.target.value))}
              />
            
            </form>
          </div>

          <div className="grid w-9/12 grid-cols-5 px-5 pt-3 pb-5 mx-auto my-6 bg-white shadow-md max-mobile:w-11/12 max-mobile:grid-cols-2 max-laptop:w-10/12 max-tablet:grid-cols-3">
            <h2 className="col-span-5 text-center max-mobile:col-span-2 max-tablet:col-span-3 max-tablet:text-lg">Produkty z kategorii: {categoryName}</h2>
            {categoryProductsFilteredByPrice.length === 0 ?
              minPrice === 0 && maxPrice === 99999 ?
                <h3 className="col-span-5 mt-5 text-center text-gray-400 max-mobile:text-base max-tablet:text-lg">Ładowanie...</h3>
              :
                <h3 className="col-span-5 mt-5 text-center text-gray-400 max-mobile:text-base max-tablet:text-lg">Brak produktów spełniających podane kryteria</h3>
            :
              categoryProductsFilteredByPrice.map(item => (
                <ProductCard key={item._id} product={item} />
              ))
            }
          </div>
        </>
      :
        <h3 className="mt-5 text-center text-gray-400 max-mobile:text-base">Brak produktów z tej kategorii</h3>
      }
    </>
  )
}
