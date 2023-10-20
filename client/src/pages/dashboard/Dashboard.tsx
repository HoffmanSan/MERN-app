// Imports
import { useState, useEffect } from "react";
import { useProductsContext } from "../../hooks/useProductsContext";

// Components
import { Carousel, FilterForm, ProductList } from "../../components/index";

// Unique styles
import "./dashboard.css"

// TS types
type Product = {
  _id: number,
  title: string,
  price: number,
  categories: string[],
  description: string,
  inStock: number,
  photoURLS: string[]
}

const CATEGORIES = ["Kuchenne AGD", "Elektronika", "Rowery i akcesoria", "Mechanika", "Sztuka", "RTV", "Hydraulika", "Ogród", "Garaż"]

export default function Dashboard() {
  const {state, dispatch} = useProductsContext();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(state.products)
  const [filtersApplied, setFiltersApplied] = useState(false)

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch("/api/products");
      const json = await response.json();

      if (response.ok) {
      dispatch({type: "SET_PRODUCTS", payload: json});
      }
    }

    getProducts()
  }, [dispatch])

  const handleFilter = (minPrice: number, maxPrice: number, categories: string[]) => {
    let filteredByPrice = state.products;
    let filteredByCategory = state.products;

    // if maxPrice === 0, show all products
    if (maxPrice === 0) {
      maxPrice = 99999 
    }
    
    // filter by price
    if (minPrice > 0 || maxPrice < 99999) {
      filteredByPrice = (state.products).filter(item => {
        if (item.price >= minPrice && item.price <= maxPrice) {
          return true
        } else {
          return false
        }
      })
    }
    
    // filter by category
    if (categories.length !== 0) {
      filteredByCategory = (state.products).filter(item => {
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
        <Carousel products={state.products}/>
      </div>

      <div className="dashboard-row">
        <h2>Najpopularniejsze oferty</h2>
        <Carousel products={state.products}/>
      </div>

      <div className="dashboard-row">
        <h2>Szukaj produktów wg Kategorii</h2>
        <Carousel products={state.products}/>
      </div>

      <div className="grid w-9/12 grid-cols-4 mx-auto auto-rows-max">
        <FilterForm categoryList={CATEGORIES} handleFilter={handleFilter}/>

        <ProductList filteredProducts={filtersApplied ? filteredProducts : state.products} />
      </div>

      <div className="sg h-80"></div>
    </>
  )
}
