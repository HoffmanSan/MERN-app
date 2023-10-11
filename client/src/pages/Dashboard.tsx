// Imports
import { useState, useEffect, Fragment } from "react";

// Components
import { Carousel, CheckboxInput } from "../components/index";

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
  },
  {
    _id: 2,
    title: "Nazwa 2",
    price: 100
  },
  {
    _id: 2,
    title: "Nazwa 2",
    price: 100
  },
  {
    _id: 2,
    title: "Nazwa 2",
    price: 100
  }
  ,{
    _id: 2,
    title: "Nazwa 2",
    price: 100
  }
  ,{
    _id: 2,
    title: "Nazwa 2",
    price: 100
  }
  ,{
    _id: 2,
    title: "Nazwa 2",
    price: 100
  }
]

const CATEGORIES = ["Kuchenne AGD", "Elektronika", "Rowery i akcesoria", "Mechanika"]

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
 
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  // useEffect(() => {
  //   const getProducts = async () => {
  //     const response = await fetch("/api/products");
  //     const json = await response.json();
  //     console.log(json)
  //     setProducts(json)
  //   }
    
  //   getProducts()
  // }, [])

  const handleClick = (category:string) => {
    if (categoryFilter.includes(category)) {
      setCategoryFilter(categoryFilter.filter(el => {
        if (el === category) {
          return false;
        }
        return true;
      }))
    } else {
      setCategoryFilter((prev) => {
        let newCategoryFilter = [];
        newCategoryFilter.push(category);
        return prev.concat(newCategoryFilter);
      })
    }
  }
  
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
        <form className="col-span-1 bg-white p-5">
          <h2 className="text-2xl pb-3 font-bold">Filtry</h2>

          <h3 className="text-lg py-1 font-bold">Cena</h3>
          <input
            type="number"
            name="min-price"
            placeholder="od"
            onChange={(e) => setMinPrice(Number(e.target.value))}
            className="inline-block w-4/12 py-1 px-2 border border-black"
          />
          <span className="mx-1">-</span>
          <input
            type="number"
            name="max-price"
            placeholder="do"
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="inline-block w-4/12 py-1 px-2 border border-black"
          />

          <h3 className="text-lg py-1 font-bold">Kategorie</h3>
          <div className="grid grid-cols-2 gap-y-2">
            {CATEGORIES.map((item) => (
              <div className="flex justify-center items-center" key={item}>
                <CheckboxInput category={item} handleClick={() => handleClick(item)}/>
                <label className="pl-2" htmlFor={`category-${item}`}>{item}</label>
              </div>
            ))}
          </div>

        </form>
        

        <div className="col-span-3 bg-white h-60 ml-6 p-5">
        <h2 className="text-2xl pb-3 font-bold">Wszystkie oferty</h2>

        </div>

      </div>

      <div className="sg h-80"></div>
      
    </>
  )
}
