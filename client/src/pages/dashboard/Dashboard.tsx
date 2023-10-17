// Imports
import { useState, useEffect } from "react";

// Components
import { Carousel, FilterForm } from "../../components/index";

// Page unique styles
import "./dashboard.css"
import ProductsList from "../../components/productsList/ProductsList";

// TS type
type Product = {
  _id: number,
  title: string,
  price: number,
  categories: string[]
}
const PRODUCTS = [
  {
    _id: 1,
    title: "Mikrofalówka",
    price: 50,
    categories: ["Kuchenne AGD", "Elektronika"]
  },
  {
    _id: 2,
    title: "Hamulce rowerowe",
    price: 35,
    categories: ["Mechanika", "Rowery i akcesoria"]
  },
  {
    _id: 3,
    title: "Odpływ garażowy na olej",
    price: 350,
    categories: ["Hydraulika", "Garaż"]
  },
  {
    _id: 4,
    title: "Suwmiarka elektroniczna",
    price: 200,
    categories: ["Garaż", "Elektronika"]
  },
  {
    _id: 5,
    title: "Fontanna ogrodowa",
    price: 250,
    categories: ["Ogród", "Hydraulika"]
  }
  ,{
    _id: 6,
    title: "Lodówka",
    price: 1200,
    categories: ["Kuchenne AGD", "RTV"]
  }
  ,{
    _id: 7,
    title: "Rzeźba ogrodowa",
    price: 175,
    categories: ["Sztuka", "Ogród"]
  }
  ,{
    _id: 8,
    title: "Telewizor",
    price: 800,
    categories: ["Elektronika", "RTV"]
  }
];

const CATEGORIES = ["Kuchenne AGD", "Elektronika", "Rowery i akcesoria", "Mechanika", "Sztuka", "RTV", "Hydraulika", "Ogród", "Garaż"]

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>()
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(PRODUCTS)

  // useEffect(() => {
  //   const getProducts = async () => {
  //     const response = await fetch("/api/products");
  //     const json = await response.json();
  //     console.log(json)
  //     setProducts(json)
  //   }
    
  //   getProducts()
  // }, [])

  const handleFilter = (minPrice: number, maxPrice: number, categories: string[]) => {
    let filteredByPrice: Product[] = PRODUCTS;
    let filteredByCategory: Product[] = PRODUCTS;
    
    // filter by price
    if (minPrice > 0 || maxPrice < 99999) {
      filteredByPrice = PRODUCTS.filter(item => {
        if (item.price > minPrice && item.price < maxPrice) {
          return true
        } else {
          return false
        }
      })
    }
    
    // filter by category
    if (categories.length !== 0) {
      filteredByCategory = PRODUCTS.filter(item => {
        return (item.categories.some(e => categories.includes(e)))
      }) 
    }

    // return products after filtering
    if (filteredByPrice.length !== 0 || filteredByCategory.length !== 0) {
      let result = filteredByPrice.filter(v => filteredByCategory.indexOf(v) > -1);
      setFilteredProducts(result);
    }
  }
  
  
  return (
    <>
      <div className="dashboard-row">
        <h2>Najnowsze produkty</h2>
        <Carousel products={PRODUCTS}/>
      </div>

      <div className="dashboard-row">
        <h2>Najpopularniejsze oferty</h2>
        <Carousel products={PRODUCTS}/>
      </div>

      <div className="dashboard-row">
        <h2>Szukaj produktów wg Kategorii</h2>
        <Carousel products={PRODUCTS}/>
      </div>

      <div className="grid w-9/12 grid-cols-4 mx-auto">
        <FilterForm categoryList={CATEGORIES} handleFilter={handleFilter}/>

        <ProductsList filteredProducts={filteredProducts} />
      </div>

      <div className="sg h-80"></div>
    </>
  )
}
