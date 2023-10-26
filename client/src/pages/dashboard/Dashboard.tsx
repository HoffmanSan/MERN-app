// Imports
import { useState, useEffect } from "react";
import { useProductsContext } from "../../hooks/useProductsContext";
import { useCategoriesContext } from "../../hooks/useCategoriesContext";

// Components
import { Carousel, FilterForm, ProductList } from "../../components/index";

// Unique styles
import "./dashboard.css"

// TS types
type Product = {
  _id: number,
  name: string,
  price: number,
  categories: string[],
  description: string,
  inStock: number,
  photoURLs: string[]
}

const CATEGORIES = ["Kuchenne AGD", "Elektronika", "Rowery i akcesoria", "Mechanika", "Sztuka", "RTV", "Hydraulika", "Ogród", "Garaż"]

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
      <div className="dashboard-row">
        <h2>Najnowsze produkty</h2>
        <Carousel products={stateProducts.products}/>
      </div>

      <div className="dashboard-row">
        <h2>Szukaj produktów wg Kategorii</h2>
        <Carousel products={stateProducts.products}/>
      </div>

      <div className="grid w-9/12 grid-cols-4 mx-auto auto-rows-max">
        <FilterForm categoryList={stateCategories.categories} handleFilter={handleFilter}/>

        <ProductList filteredProducts={filtersApplied ? filteredProducts : stateProducts.products} />
      </div>

      <div className="sg h-80"></div>
    </>
  )
}
