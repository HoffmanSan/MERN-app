// ImMPORTS
import { useState, useMemo } from "react";
import { useProductsContext } from "../../hooks/useContextHooks/useProductsContext";
import { useCategoriesContext } from "../../hooks/useContextHooks/useCategoriesContext";

// COMPONENTS
import { Carousel, FilterForm, ProductList, ProductCard, CategoryCard } from "../../components/index";

export default function Dashboard() {
  // LOCAL STATES
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  // GLOBAL STATES & UTILITIES
  const { products: allProducts } = useProductsContext();
  const products = allProducts.filter(item => item.inStock > 0);
  const { categories } = useCategoriesContext();

  // ---- FILTERING LOGIC ---- \\
  const filteredProducts = useMemo(() => {
    if (minPrice === 0 && (maxPrice === 99999 || maxPrice === 0) && filteredCategories.length === 0) {
      return products
    }

    return products.filter(item => 
      item.price >= minPrice
      &&
      item.price <= maxPrice
      &&
      item.categories.some(category => {
        if (filteredCategories.length === 0) {
          return true
        }
        return filteredCategories.includes(category)
      })
    )
  }, [filteredCategories, minPrice, maxPrice, products])
  
  // ---- SET FILTERING PARAMETERS ---- \\
  const handleFilter = (minPrice: number, maxPrice: number, categories: string[]) => {
    setMinPrice(minPrice)
    setMaxPrice(maxPrice)
    if (maxPrice === 0) {
      setMaxPrice(99999)
    }
    setFilteredCategories(categories)
  };
  
  return (
    <>
      <div className="w-9/12 px-5 py-3 mx-auto my-6 bg-white shadow-md max-mobile:py-2 min-h-max max-mobile:w-11/12 max-laptop:w-10/12">
        <h2 className="max-tablet:text-center max-tablet:text-lg">Najnowsze produkty</h2>
        {products.length > 0 ?
          <Carousel>
            {
              products.slice(0, 25).map((item) => (
                <ProductCard product={item} key={item._id}/>
              )) || <div/>
            }
          </Carousel>
        :
          <h3 className="pb-3 text-center text-gray-300 max-mobile:text-base">Ładowanie...</h3>
        }
      </div>

      <div className="w-9/12 px-5 pt-3 mx-auto my-6 bg-white shadow-md max-mobile:py-2 max-mobile:w-11/12 max-laptop:w-10/12">
        <h2 className="max-tablet:text-center max-tablet:text-lg">Szukaj wg Kategorii</h2>
        {categories.length > 0 ?
          <Carousel>
            {
              categories.map(item => (
                <CategoryCard category={item} key={item._id}/>
              ))
            }
          </Carousel>
        :
          <h3 className="pb-5 text-center text-gray-300 max-mobile:text-base">Ładowanie...</h3>
        }
      </div>

      {products.length > 0 ?

        <div className="grid w-9/12 grid-cols-4 mx-auto auto-rows-max max-mobile:w-11/12 max-laptop:w-10/12">

          <FilterForm categoryList={categories} handleFilter={handleFilter}/>

          <ProductList filteredProducts={filteredProducts} />
        </div>

      :

        <div className="flex items-center justify-center w-9/12 h-40 mx-auto bg-white max-mobile:w-11/12 max-laptop:w-10/12">
          <h3 className="text-gray-300 max-mobile:text-base">Ładowanie...</h3>
        </div>
      }
    </>
  )
}
