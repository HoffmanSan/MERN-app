// IMPORTS
import { useState, useEffect, useMemo } from "react";
import { useDataAPI } from "../../hooks/useDataAPI";
import { useAuthContext } from "../../hooks/useContextHooks/useAuthContext";
import { useCartContext } from "../../hooks/useContextHooks/useCartContext";
import { useProductsContext } from "../../hooks/useContextHooks/useProductsContext";
import axios from "axios";

// COMPONENTS
import { CartCard, LoadingSpinner } from "../../components";

export default function Cart() {
  // LOCAL STATES
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // GLOBAL STATES & UTILITIES
  const { updateDocument } = useDataAPI();
  const { products } = useProductsContext();
  const { user } = useAuthContext();
  const userCartId = user ? user.cartId : "";
  const userToken = user ? user.token : "";
  const { cart, dispatchCart } = useCartContext();
  const cartId = cart._id;

  // ---- FILTER CART ITEMS BASED ON WHETHER THEY HAVE BEEN REMOVED FROM DATABASE OR ARE OUT OF STOCK ---- \\
  const cartItems = useMemo(() => cart.cartItems.filter((cartItem) => {
    return products.some((product => {
      return product._id === cartItem.cartItemId && product.inStock > 0
    }));
  }), [cart.cartItems, products]);
  
  // ---- UPDATE CART IN DATABASE AFTER LOCAL CART CHANGES (DEBOUNCED) ---- \\
  useEffect(() => {
    
    if (!isLoading) {
      return
    }

    const updateCart = setTimeout(async () => {
      await updateDocument("carts", cart, userCartId)
      setIsLoading(false)
    }, 1000);

    return () => clearTimeout(updateCart);

  }, [cart, isLoading, userCartId, updateDocument]);

  // ---- GET TOTAL CART VALUE ---- \\
  const getTotalCartValue = () => {
    let eachCartItemPrice = cartItems.map(item => {
      let product = products.find(product => product._id === item.cartItemId);

      if (product) {
        return product.price;
      } else {
        return 0;
      } 
    });
    
    let eachCartItemPriceTimesQuantity = eachCartItemPrice.map((item, index) => item * cartItems[index].cartItemQuantity);
    let entireCartValue = 0;

    eachCartItemPriceTimesQuantity.forEach(item => {
      entireCartValue += item;
    });
    
    return entireCartValue.toFixed(2);
  };
  
  // ---- START THE PAYMENT PROCESS ---- \\
  const startPayment = async () => {
    setIsRedirecting(true);
    
    axios.post(
      `${process.env.REACT_APP_API_SERVER_URI}/api/payments/create-checkout-session`,
      cartItems,
      { headers: {'Authorization': `Bearer ${userToken}`} }
    )
    .then(response => window.location.href = response.data.url)
    .catch(error => console.log(error));
  };
  
  return (
    <div className="grid w-9/12 grid-cols-3 gap-4 mx-auto my-6 max-mobile:w-11/12 max-tablet:w-10/12">

      {/* if the cart is already loaded... */}
      {cartId ?
        <>
          {/* ...and empty */}
          {cartItems.length === 0 && <h3 className="col-span-3 text-center text-gray-400 max-tablet:text-lg">Twój koszyk jest pusty</h3>}

          {/* ...and contains items */}
          {cartItems.length !== 0 &&
            <>
              <div className="col-span-2 p-5 bg-white shadow-md h-min max-tablet:col-span-3 max-mobile:p-3">
                <h2 className="pb-2 border-b border-orange-400 max-tablet:text-xl max-tablet:text-center">Twój koszyk</h2>
                <div className={`grid grid-rows-${cartItems.length}`}>
                  {cartItems.map(item =>
                    <CartCard key={item.cartItemId} cartItem={item} setIsLoading={setIsLoading} dispatchCart={dispatchCart}/>
                  )}
                </div>
              </div>

              <div className="col-span-1 p-5 bg-white shadow-md h-min max-tablet:col-span-3">
                <h2 className="pb-2 border-b border-orange-400 max-tablet:text-xl max-tablet:text-center">Razem</h2>

                <div className="flex flex-col items-center justify-center">
                  {isLoading ?
                    <LoadingSpinner classNames="!h-20 !w-20 my-10"/>
                  :
                    <>
                      <h2 className="py-10 my-auto text-4xl tracking-wider max-tablet:text-2xl max-mobile:py-5">{getTotalCartValue()} zł</h2>
                      <button
                        className="w-full btn max-tablet:text-sm"
                        onClick={() => startPayment()}
                        disabled={isRedirecting}
                      >
                        {isRedirecting ? <LoadingSpinner /> : "PŁATNOŚĆ"}
                      </button>
                    </>
                  }
                </div>
                
              </div>
            </>
          }
        </>
      : 
        // if the cart is not loaded yet
        <h3 className="col-span-3 mt-5 text-center text-gray-400">Ładowanie...</h3>
      }
      
    </div>
  )
};
