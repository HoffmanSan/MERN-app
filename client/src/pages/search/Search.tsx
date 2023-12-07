// IMPORTS
import { useParams } from "react-router-dom";
import { useProductsContext } from "../../hooks/useContextHooks/useProductsContext";

// COMPONENTS
import { ProductCard } from "../../components/index";

export default function Search() {
  // GLOBAL STATES & UTILITIES
  const params = useParams() as { querry: string };
  const querry = params.querry;
  const { products } = useProductsContext();

  // ---- TURN QUERRY STRING INTO ARRAY OF WORDS ---- \\
  const querryArray = querry.split(" ").filter(element => element.length > 2);

  // ---- FIND PRODUCTS THAT INCLUDE QUERRY WORDS ---- \\
  const querriedProducts = products.filter(item => querryArray.filter(element => 
    item.name.toLowerCase().includes(element.toLowerCase())
    ||
    item.description.toLowerCase().includes(element.toLowerCase())
    ||
    item.categories.toString().toLowerCase().includes(element.toLowerCase())
  ).length > 0);

  return (
    querriedProducts.length === 0 ?
      <h3 className="mt-5 text-center text-gray-400 max-mobile:text-base max-tablet:text-lg">Nie znaleziono produktów</h3>
    :
      <>
        
        <div className="w-9/12 p-5 mx-auto mt-6 bg-white shadow-md max-mobile:w-11/12">
          <h2 className="text-center max-tablet:text-lg">Wyniki wyszukiwania dla: {querry}</h2>

          <div className="grid grid-cols-5 max-mobile:grid-cols-2 max-tablet:grid-cols-3">
            {querriedProducts.map(item => (
              <ProductCard key={item._id} product={item}/>
            ))}
          </div>
        </div>
      </>
  )
}
