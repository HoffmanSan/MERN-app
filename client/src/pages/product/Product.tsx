// IMPORTS
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useProductsContext } from "../../hooks/useContextHooks/useProductsContext"
import { useCategoriesContext } from "../../hooks/useContextHooks/useCategoriesContext"
import { useAuthContext } from "../../hooks/useContextHooks/useAuthContext"
import { useCartContext } from "../../hooks/useContextHooks/useCartContext"
import { useDataAPI } from "../../hooks/useDataAPI"

// COMPONENTS
import { CategoryCard, LoadingSpinner } from "../../components"

// TYPES
type Product = {
  _id: string
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
  // LOCAL STATES
  const [product, setProduct] = useState<Product>()
  const [currentImage, setCurrentImage] = useState<string>();
  const [purchaseQuantity, setPurchaseQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [buttonText, setButtonText] = useState("DODAJ DO KOSZYKA")

  // GLOBAL STATES & UTILITIES
  const { id } = useParams()
  const navigate = useNavigate()
  const { updateDocument } = useDataAPI()
  const { cart, dispatchCart } = useCartContext()
  const { products } = useProductsContext()
  const { categories } = useCategoriesContext()
  const { user } = useAuthContext()
  const userCartId = user ? user.cartId : ""
  
  // ---- FIND PRODUCT IN PRODUCTS CONTEXT ON COMPONENT MOUNT ---- \\
  useEffect(() => {
    const product = products.find(product => product._id === id)
    if (product) {
      setProduct(product)
      setCurrentImage(product.photoURLs[0])
    }

  }, [id, products])

  // ---- UPDATE LOCAL CART ---- \\
  const addProductToCart = async () => {
    if(!user) {
      return navigate("/login")
    }

    if (typeof product === "undefined") {
      return
    }
    
    setIsLoading(true)

    if (cart.cartItems.filter(item => item.cartItemId === product._id).length > 0) {
      // if the product is already in the cart - update it's quantity
      dispatchCart({type: "UPDATE_CART_ITEM", payload: [{ cartItemId: product._id, cartItemQuantity: purchaseQuantity }]})
    } else {
      // if the product is not in the cart - add it
      dispatchCart({type: "ADD_CART_ITEM", payload: [{ cartItemId: product._id, cartItemQuantity: purchaseQuantity }]})
    }
  }

  // ---- UPDATE DATABASE AFTER LOCAL CART CHANGE ---- \\
  useEffect(() => {
    if (!isLoading) {
      return
    }

    const updateCart = async () => {
      await updateDocument("carts", cart, userCartId)
      setIsLoading(false)
      setButtonText("DODANO")
      setTimeout(() => {
        setButtonText("DODAJ DO KOSZYKA")
      }, 2000)
    }

    updateCart()
  }, [isLoading, cart, userCartId, updateDocument])
  
  return (
    <div className="grid w-8/12 grid-cols-4 grid-rows-2 gap-5 mx-auto my-6">
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
                    className={`object-scale-down px-2 h-20 w-20 hover:cursor-pointer ${currentImage === item && "border-4 border-orange-400"}`}
                    onClick={() => setCurrentImage(item)}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center justify-around p-4 bg-white shadow-md">
            <h3 className="p-4 text-center">{product.name}</h3>

            <div className="text-center">
              <h3 className="text-3xl text-center text-orange-400">{(product.price * purchaseQuantity).toFixed(2)} zł</h3>
              
              <div className="flex justify-center">
                <button
                  className={`w-3/12 h-10 font-bold text-orange-400 border-2 border-orange-400 ${purchaseQuantity === 1 && "bg-orange-200"}`}
                  onClick={() => setPurchaseQuantity(prevValue => prevValue - 1)}
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
                  className={`w-3/12 h-10 font-bold text-orange-400 border-2 border-orange-400 ${purchaseQuantity === product.inStock && "bg-orange-200"}`}
                  onClick={() => setPurchaseQuantity(prevValue => prevValue + 1)}
                  disabled={purchaseQuantity === product.inStock}
                >
                  +
                </button>
              </div>
              
              <small className="text-gray-400 ">{product.inStock === 1 ? "ostatni produkt" : `z ${product.inStock} sztuk`}</small>
            </div>
            
            <div className="pt-2 text-center">
              <button
                className="!min-w-full my-1 btn"
                onClick={() => addProductToCart()}
              >
                {isLoading ? <LoadingSpinner /> : buttonText}
              </button>
            </div>
            
          </div>

          <div className="row-span-1 p-4 bg-white shadow-md">
            <h3 className="text-center">Sprawdź inne produkty:</h3>
            <CategoryCard category={categories.find(category => category.name === product.categories[0])}/>
          </div>
          
          <div className="col-span-4 p-4 pb-2 bg-white shadow-md">
            <h2 className="pb-3">Opis</h2>
            <article>
              {product.description}
            </article>
          </div>

        </>
      )}
      {!product && <h3 className="col-span-4 text-center text-gray-400">Ładowanie...</h3>}
    </div>
  )
}
