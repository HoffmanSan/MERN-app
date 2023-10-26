// Imports
import { ChangeEvent, FormEvent, Fragment, useRef, useState } from "react";
import { useConvertImages } from "../../../hooks/useConvertImages";
import axios from "axios";
import { nanoid } from "nanoid";
import { useProductsContext } from "../../../hooks/useProductsContext";
import { useCategoriesContext } from "../../../hooks/useCategoriesContext";
import { InputFiles } from "typescript";

// TS types
type Product = {
  name: string,
  price: number,
  description: string,
  inStock: number,
  categories: string[],
  photoURLs: string[],
  photoCloudinaryId: string,
}

export default function CreateProduct() {
  const { convertImageToBase64 } = useConvertImages();
  const { state } = useCategoriesContext();
  const { dispatch } = useProductsContext();
  const fileInput = useRef<HTMLInputElement>(null);

  // States
  const [error, setError] = useState("");
  const [imgInformation, setImgInformation] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [imageList, setImageList] = useState<File[] | null>(null);
  const [product, setProduct] = useState<Product>({
    name: "",
    price: 0,
    description: "",
    inStock: 0,
    categories: [],
    photoURLs: [],
    photoCloudinaryId: nanoid()
  });

  const handleFileChange = (e: ChangeEvent) => {
    setImageList(null);
    setError("");
    let files = (e.target as HTMLInputElement).files
    
    // Validation
    if (!files || files.length === 0) {
      return 
    }

    let filesArray = Object.values(files);
    setImgInformation(filesArray);

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
 
  
  const handleCheckboxClick = (newCategory: string) => {
    if (product.categories.includes(newCategory)) {
      // remove category from product categories
      setProduct({
        ...product,
        categories: product.categories.filter(category => category !== newCategory)
      })
    } else {
      // add category to product categories
      setProduct({
        ...product,
        categories: [...product.categories, newCategory]
      })
    }
  };

  const resetForm = () => {
    setProduct({
      name: "",
      price: 0,
      description: "",
      inStock: 0,
      categories: [],
      photoURLs: [],
      photoCloudinaryId: nanoid()
    });
    setImageList(null);
    setImgInformation([]);
    setError("");
    if (fileInput.current != null) {
      fileInput.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
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
    
    // Start process if validation is passed
    setError("");
    setIsLoading(true);

    // Convert images in imageArray to base64 strings, upload them to storage, and save their urls in urlArray
    Promise.all(
      imageList.map(item => {
        return new Promise(async (resolve, reject) => {
          const base64String = await convertImageToBase64(item);
          
          axios.post("/api/images", { image: base64String, folder: product.photoCloudinaryId })
            .then((response) => {
              resolve(product.photoURLs.push(response.data));
            })
        })
      })
    ).then(() => {
      
      // Add product to database
      axios.post("/api/products", { ...product })
        .then((response) => {
          dispatch({type: "CREATE_PRODUCT", payload: [response.data]})
          resetForm();
          setIsLoading(false);
          setOutcome("Produkt dodany");
          setTimeout(() => {
            setOutcome("");
          }, 5000);
        })
        .catch((err) => {
          setError(err.message);
          console.log(err)
        })

    }).catch(error => {
      setIsLoading(false);
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
        {state.categories.sort().map((item) => (
          <div key={item.name} className="flex items-center">
            <input
              type="checkbox"
              id={item.name}
              checked={product.categories.includes(item.name)}
              readOnly
            />
            <span onClick={() => handleCheckboxClick(item.name)}/>
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
        {imgInformation && imgInformation.map(item => (
          <Fragment key={item.name}>
            <br />
            <span>{item.name.slice(0, 25)}</span> - <span>{(item.size / 1000000).toFixed(2)} mb</span>
          </Fragment>
        ))}
      </div>

      <button disabled={isLoading} className={`btn w-2/12 mx-auto `}>{isLoading ? "Ładowanie..." : "Dodaj produkt"}</button>
      {error && <div className="m-2 mx-auto error">{error}</div>}
      {outcome && <div className="p-2 m-2 mx-auto text-green-500 bg-green-100 border border-green-500">{outcome}</div>}
    </form>
  )
}
