// Imports
import { useState, useEffect } from "react";

// Components
import { Carousel } from "../components/index";

const product_array = [
  {
    _id: 1,
    title: "Nazwa 1",
    price: 50
  },
  {
    _id: 2,
    title: "Nazwa 2",
    price: 100
  }
]

export default function Dashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch("/api/products");
      const json = await response.json();
      console.log(json)
      setProducts(json)
    }
    
    getProducts()
  }, [])
  
  return (
    <>
      <div className="bg-white w-9/12 mx-auto p-5 m-6">
        <h2 className="text-2xl pb-3 font-bold">Najnowsze produkty</h2>
        <Carousel products={products}/>
        <button onClick={() => console.log(products)}>produkty</button>
      </div>

      <div className="bg-white w-9/12 mx-auto p-5 m-6">
        <h2 className="text-2xl pb-3 font-bold">Najpopularniejsze oferty</h2>
        <Carousel products={product_array}/>
      </div>

      <div className="bg-white w-9/12 mx-auto p-5 m-6">
        <h2 className="text-2xl pb-3 font-bold">Szukaj produktów wg Kategorii</h2>
        <Carousel products={product_array}/>
      </div>

      <div className="grid grid-cols-4 w-9/12 mx-auto">
        <div className="col-span-1 bg-blue-300 h-60">

        </div>
        <div className="col-span-3 bg-red-300 h-60">

        </div>

      </div>
      
    </>
  )
}
