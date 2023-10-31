// IMPORTS
import { ChangeEvent, FormEvent, Fragment, useRef, useState } from "react";
import { useConvertImages } from "../../../hooks/useConvertImages";
import { useProductsContext } from "../../../hooks/useProductsContext";
import { useCategoriesContext } from "../../../hooks/useCategoriesContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { nanoid } from "nanoid";
import axios from "axios";

// COMPONENTS
import { LoadingSpinner } from "../../index";

// TYPES
type Product = {
  name: string,
  price: number,
  description: string,
  inStock: number,
  categories: string[],
  photoURLs: string[],
  cloudinaryFolderId: string,
}

export default function CreateProduct() {
  // LOCAL STATES
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const [outcome, setOutcome] = useState("");
  const [imageSizes, setImageSizes] = useState<File[]>([]);
  const [imageList, setImageList] = useState<File[] | null>(null);
  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    description: "",
    inStock: 0,
    categories: [],
    photoURLs: [],
    cloudinaryFolderId: nanoid()
  });
  const fileInput = useRef<HTMLInputElement>(null);

  // GLOBAL STATES
  const { convertImageToBase64 } = useConvertImages();
  const { dispatch } = useProductsContext();
  const { state: stateAuth } = useAuthContext();
  const userAuth = stateAuth.user;
  const { state: stateCategories } = useCategoriesContext();
  const caregories = stateCategories.categories;
  

  // ON FILE INPUT CHANGE
  const handleFileChange = (e: ChangeEvent) => {
    setImageList(null);
    setImageSizes([]);
    setError("");

    let files = (e.target as HTMLInputElement).files
    
    // validation
    if (!files || files.length === 0) {
      return 
    }

    let filesArray = Object.values(files);
    setImageSizes(filesArray);

    if (filesArray.length > 5) {
      setError("Można dodać maksymalnie 5 plików");
      return
    }
    if (filesArray.filter(item => { return !item.type.includes("image") }).length > 0) {
      setError("Wszystkie pliki muszą być obrazami");
      return
    }
    if (filesArray.filter(item => { return item.size > 2500000  }).length > 0 ) {
      setError("Żaden obraz nie może być większy niż 2.5 mb");
      return
    }

    setError("");
    setImageList(filesArray);
  }
 
  // CATEGORY CHECKBOX ON CHECK
  const handleCheckboxCheck = (newCategory: string) => {
    if (product.categories.includes(newCategory)) {
      // remove category
      setProduct({
        ...product,
        categories: product.categories.filter(category => category !== newCategory)
      })
    } else {
      // add category
      setProduct({
        ...product,
        categories: [...product.categories, newCategory]
      })
    }
  };

  // RESET FORM DATA
  const resetForm = () => {
    setProduct({
      name: "",
      price: 0,
      description: "",
      inStock: 0,
      categories: [],
      photoURLs: [],
      cloudinaryFolderId: nanoid()
    });
    setImageList(null);
    setImageSizes([]);
    setError("");
    if (fileInput.current != null) {
      fileInput.current.value = "";
    }
  };

  // ADD PRODUCT
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // validation
    if (!product.name || !product.price || !product.description || !product.inStock) {
      setError("Uzupełnij dane produktu");
      return
    }
    if (product.categories.length === 0) {
      setError("Przydziel kategorie do produktu")
      return
    }
    if (!imageList || imageList.length === 0) {
      setError("Dodaj zdjęcia produktu");
      return
    }
    
    setError("");
    setIsAdding(true);

    // convert product images to base64 strings, upload them to storage, and save their urls within product data
    Promise.all(
      imageList.map(item => {
        return new Promise(async (resolve, reject) => {
          const base64String = await convertImageToBase64(item);
          
          axios.post(
            "/api/images",
            { image: base64String, folder: product.cloudinaryFolderId }
          )
          .then((response) => {
            resolve(product.photoURLs.push(response.data));
          })
        })
      })
    ).then(() => {
      // add product to database
      axios.post(
        "/api/products",
        { ...product },
        { headers: {'Authorization': `Bearer ${userAuth?.token}`} }
      )
      .then((response) => {
        dispatch({type: "CREATE_PRODUCT", payload: [response.data]})
        resetForm();
        setIsAdding(false);
        setOutcome("Produkt dodany");
        setTimeout(() => {
          setOutcome("");
        }, 5000);
      })
      .catch((error) => {
        setIsAdding(false);
        setError(error.message);
        console.log(error);
      })
    }).catch(error => {
      setIsAdding(false);
      setError(error.message);
      console.log(error);
    })
  };

  return (
    <form className="flex flex-col p-6 mb-6 text-center text-orange-400 bg-white" onSubmit={(e) => handleSubmit(e)}>
      <h2 className="p-1 px-2 mx-auto mb-6 text-white bg-orange-400 rounded-md">NOWY PRODUKT</h2>
      
      <h3 className="p-1 text-white bg-orange-400">Dane</h3>

      <label className="flex flex-col items-center">
        <span className="m-1 font-bold">Nazwa:</span>
        <input
          className="w-4/12 p-2 my-1 text-center text-black border border-orange-400 rounded-md"
          onChange={(e) => setProduct({...product, name: e.target.value})}
          value={product.name}
          id="product-name"
        />
      </label>

      <label className="flex flex-col items-center">
        <span className="m-1 font-bold">Cena (zł / szt.):</span>
        <input
          type="number"
          value={product.price}
          onChange={(e) => setProduct({...product, price: Number(e.target.value)})}
          className="px-2 py-1 text-center text-black border border-orange-400 rounded-md"
          id="product-price"
        />
      </label>

      <label className="flex flex-col items-center">
        <span className="m-1 font-bold">Ilość na magazynie (szt.):</span>
        <input
          type="number"
          value={product.inStock}
          onChange={(e) => setProduct({...product, inStock: Number(e.target.value)})}
          className="px-2 py-1 text-center text-black border border-orange-400 rounded-md"
          id="product-quantity"
        />
      </label>

      <label className="flex flex-col items-center">
        <span className="m-1 font-bold">Opis:</span>
        <textarea
          className="w-6/12 h-40 text-black border border-orange-400 rounded-md outline-none"
          value={product.description}
          onChange={(e) => setProduct({...product, description: e.target.value})}
          id="product-description"
        />
      </label>

      <h3 className="p-1 m-2 text-white bg-orange-400">Kategorie</h3>

      <div className="grid w-8/12 grid-cols-4 gap-1 mx-auto text-left">
        {caregories.sort().map((item) => (
          <div key={item.name} className="flex items-center">
            <input
              type="checkbox"
              id={item.name}
              checked={product.categories.includes(item.name)}
              readOnly
            />
            <span onClick={() => handleCheckboxCheck(item.name)}/>
            <label className="pl-2" htmlFor={item.name}>{item.name}</label>
          </div>
        ))}
      </div>

      <h3 className="p-1 m-2 text-white bg-orange-400">Zdjęcia</h3>

      <div className="m-2 mb-4 ">
        <input
          ref={fileInput}
          onChange={handleFileChange}
          type="file"
          multiple
        />
        {imageSizes && imageSizes.map(item => (
          <Fragment key={item.name}>
            <br />
            <span>{item.name.slice(0, 25)}</span> - <span>{(item.size / 1000000).toFixed(2)} mb</span>
          </Fragment>
        ))}
      </div>

      <button disabled={isAdding} className={`btn w-2/12 mx-auto `}>
      {isAdding ?
        <LoadingSpinner />
        :
        "Dodaj produkt"
      }
      </button>
      {error && <div className="m-2 mx-auto error">{error}</div>}
      {outcome && <div className="p-2 m-2 mx-auto text-green-500 bg-green-100 border border-green-500">{outcome}</div>}
    </form>
  )
}
