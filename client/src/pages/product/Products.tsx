// IMPORTS
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react";
import axios from "axios";

// COMPONENTS
import { CategoryCard } from "../../components";

// TYPES
type Product = {
  _id: number
  name: string
  price: number
  categories: string[]
  description: string
  inStock: number
  photoURLs: string[]
  cloudinaryFolderId: string
  createdAt: Date 
}

export default function Products() {
  const [product, setProduct] = useState<Product>()
  const [currentImage, setCurrentImage] = useState<string>("");
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [error, setError] = useState("");
  const { id } = useParams();

  useEffect(() => {
    const getProduct = async () => {
      axios.get(`/api/products/${id}`)
      .then(response => {
        setProduct(response.data)
        setCurrentImage(response.data.photoURLs[0])
      })
      .catch(error => {
        setError(error.message);
      })
    }

    getProduct();
  }, [id])
  
  return (
    <div className="grid w-8/12 grid-cols-4 gap-5 mx-auto my-6 auto-rows-auto">
      {product && (
      <>

        <div className="col-span-3 row-span-2 bg-white shadow-md">
          <h2 className="p-4">{product.name}</h2>
          <img
            src={currentImage}
            alt={product.name}
            className="object-scale-down px-2 mx-auto h-160"
          />
          <ul className="flex justify-center py-2">
            {product.photoURLs.map(item => (
              <li key={item}>
                <img
                  src={item} 
                  alt={`product ${product.photoURLs.indexOf(item) + 1}`} 
                  loading="lazy"
                  className={`object-scale-down px-2 h-14 w-14 hover:cursor-pointer ${currentImage === item && "border-4 border-orange-400"}`}
                  onClick={() => setCurrentImage(item)}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center justify-around col-span-1 p-4 bg-white shadow-md">
          <h3 className="p-4 text-center">{product.name}</h3>

          <div className="text-center">
            <h3 className="text-3xl text-center text-orange-400">{(product.price * purchaseQuantity).toFixed(2)} zł</h3>
            
            <button
              className={`h-10 font-bold text-orange-400 border-2 border-orange-400 w-9 ${purchaseQuantity === 1 && "bg-orange-200"}`}
              onClick={() => setPurchaseQuantity(purchaseQuantity - 1)}
              disabled={purchaseQuantity === 1}
            >
             -
            </button>

            <input
              type="number"
              className="w-3/12 h-10 font-bold text-center border-orange-400 border-y-2"
              value={purchaseQuantity}
              readOnly
            />

            <button
              className={`h-10 font-bold text-orange-400 border-2 border-orange-400 w-9 ${purchaseQuantity === product.inStock && "bg-orange-200"}`}
              onClick={() => setPurchaseQuantity(purchaseQuantity + 1)}
              disabled={purchaseQuantity === product.inStock}
            >
              +
            </button>
            
            <br />
            <small className="text-gray-400">{product.inStock === 1 ? "ostatni produkt" : `z ${product.inStock} sztuk`}</small>
          </div>
          
          <div className="pt-2 text-center">
            <button className="w-5/6 my-1 btn">DODAJ DO KOSZYKA</button>
            <button className="w-5/6 my-1 btn">KUP I ZAPŁAĆ</button>
          </div>
          
        </div>

        <div className="p-4 bg-white shadow-md">
          <h3 className="text-center">Sprawdź inne produkty z kategorii:</h3>
          <CategoryCard />
        </div>
        
        <div className="col-span-4 p-4 bg-white shadow-md">
          <h2 className="pb-3">Opis</h2>
          <article>
            {product.description}
          </article>
        </div>

      </>
      )}
    </div>
  )
}
