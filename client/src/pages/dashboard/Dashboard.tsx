// Imports
import { useState } from "react";
import { useProductsContext } from "../../hooks/useContextHooks/useProductsContext";
import { useCategoriesContext } from "../../hooks/useContextHooks/useCategoriesContext";

// Components
import { Carousel, FilterForm, ProductList, ProductCard, CategoryCard } from "../../components/index";

// TS types
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
  const { state: stateProducts } = useProductsContext();
  const { state: stateCategories } = useCategoriesContext();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(stateProducts.products)
  const [filtersApplied, setFiltersApplied] = useState(false)
  
  const handleFilter = (minPrice: number, maxPrice: number, categories: string[]) => {
    let filteredByPrice = stateProducts.products;
    let filteredByCategory = stateProducts.products;

    if (maxPrice === 0) {
      maxPrice = 99999;
    }

    // filter by price
    if (minPrice > 0 || maxPrice < 99999) {
      filteredByPrice = (stateProducts.products).filter(item => {
        if (item.price >= minPrice && item.price <= maxPrice) {
          return true
        } else {
          return false
        }
      })
    }
    
    // filter by category
    if (categories.length !== 0) {
      filteredByCategory = (stateProducts.products).filter(item => {
        return (item.categories.some(val => categories.includes(val)))
      }) 
    }

    // return products after filtering
    if (filteredByPrice.length !== 0 || filteredByCategory.length !== 0) {
      let result = filteredByPrice.filter(val => filteredByCategory.indexOf(val) > -1);
      setFilteredProducts(result);
      setFiltersApplied(true);
      return
    }
    setFiltersApplied(false)
  }
  
  return (
    <>
      <div className="w-9/12 p-5 mx-auto my-6 bg-white shadow-md min-h-max">
        <h2>Najnowsze produkty</h2>
        {stateProducts.products.length > 0 ?
          <Carousel>
            {
              stateProducts.products.map((item) => (
                <ProductCard product={item} key={item._id}/>
              )) || <div/>
            }
          </Carousel>
          :
          <h3 className="text-center text-gray-300">Ładowanie...</h3>
        }
      </div>

      <div className="w-9/12 p-5 mx-auto mb-6 bg-white shadow-md">
        <h2>Szukaj produktów wg Kategorii</h2>
        {stateCategories.categories.length > 0 ?
          <Carousel>
            {
              stateCategories.categories.map(item => (
                <CategoryCard category={item} key={item._id}/>
              ))
            }
          </Carousel>
          :
          <h3 className="text-center text-gray-300">Ładowanie...</h3>
        }
      </div>

      {stateProducts.products.length > 0 ?

      <div className="grid w-9/12 grid-cols-4 mx-auto auto-rows-max">
        <FilterForm categoryList={stateCategories.categories} handleFilter={handleFilter}/>

        <ProductList filteredProducts={filtersApplied ? filteredProducts : stateProducts.products} />
      </div>

      :

      <div className="flex items-center justify-center w-9/12 h-40 mx-auto bg-white">
        <h3 className="text-gray-300">Ładowanie...</h3>
      </div>

      }

      <div className="h-80"></div>
    </>
  )
}
