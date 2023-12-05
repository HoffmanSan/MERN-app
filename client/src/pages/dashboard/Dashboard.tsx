// ImMPORTS
import { useState } from "react";
import { useProductsContext } from "../../hooks/useContextHooks/useProductsContext";
import { useCategoriesContext } from "../../hooks/useContextHooks/useCategoriesContext";

// COMPONENTS
import { Carousel, FilterForm, ProductList, ProductCard, CategoryCard } from "../../components/index";

// TYPES
type Product = {
  _id: string
  name: string
  price: number
  categories: string[]
  description: string
  inStock: number
  photoURLs: string[]
  createdAt: Date
}

export default function Dashboard() {
  // GLOBAL STATES & UTILITIES
  const { products: allProducts } = useProductsContext();
  const products = allProducts.filter(item => item.inStock > 0);
  const { categories } = useCategoriesContext();

  // LOCAL STATES
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filtersApplied, setFiltersApplied] = useState(false);
  
  // ---- FILTERING LOGIC ---- \\
  const handleFilter = (minPrice: number, maxPrice: number, categories: string[]) => {
    let filteredByPrice = products;
    let filteredByCategory = products;

    if (maxPrice === 0) {
      maxPrice = 99999;
    }

    // filter by price
    if (minPrice > 0 || maxPrice < 99999) {
      filteredByPrice = (products).filter(item => {
        if (item.price >= minPrice && item.price <= maxPrice) {
          return true
        } else {
          return false
        }
      })
    }
    
    // filter by category
    if (categories.length !== 0) {
      filteredByCategory = (products).filter(item => {
        return (item.categories.some(val => categories.includes(val)));
      }) 
    }

    // return products after filtering
    if (filteredByPrice.length !== 0 || filteredByCategory.length !== 0) {
      let result = filteredByPrice.filter(val => filteredByCategory.indexOf(val) > -1);
      setFilteredProducts(result);
      setFiltersApplied(true);
      return
    }
    setFiltersApplied(false);
  };
  
  return (
    <>
      <div className="w-9/12 px-5 py-3 mx-auto my-6 bg-white shadow-md max-mobile:py-2 min-h-max max-mobile:w-11/12">
        <h2 className="max-mobile:text-center max-mobile:text-lg">Najnowsze produkty</h2>
        {products.length > 0 ?
          <Carousel>
            {
              products.map((item) => (
                <ProductCard product={item} key={item._id}/>
              )) || <div/>
            }
          </Carousel>
        :
          <h3 className="pb-3 text-center text-gray-300 max-mobile:text-base">Ładowanie...</h3>
        }
      </div>

      <div className="w-9/12 px-5 pt-3 mx-auto my-6 bg-white shadow-md max-mobile:py-2 max-mobile:w-11/12">
        <h2 className="max-mobile:text-center max-mobile:text-lg">Szukaj wg Kategorii</h2>
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

        <div className="grid w-9/12 grid-cols-4 mx-auto auto-rows-max max-mobile:w-11/12">

          <FilterForm categoryList={categories} handleFilter={handleFilter}/>

          <ProductList filteredProducts={filtersApplied ? filteredProducts : products} />
        </div>

      :

        <div className="flex items-center justify-center w-9/12 h-40 mx-auto bg-white">
          <h3 className="text-gray-300 max-mobile:text-base">Ładowanie...</h3>
        </div>
      }
    </>
  )
}
