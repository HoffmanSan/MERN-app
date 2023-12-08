// IMPORTS
import { ChangeEvent, FormEvent, Fragment, useRef, useState } from "react";
import { useImagesAPI } from "../../../hooks/useImagesAPI";
import { useDataAPI } from "../../../hooks/useDataAPI";
import { useProductsContext } from "../../../hooks/useContextHooks/useProductsContext";
import { useCategoriesContext } from "../../../hooks/useContextHooks/useCategoriesContext";
import { nanoid } from "nanoid";

// COMPONENTS
import { LoadingSpinner } from "../../index";

// TYPES
type Product = {
  name: string
  price: number
  description: string
  inStock: number
  categories: string[]
  photoURLs: string[]
  cloudinaryFolderId: string
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

  // GLOBAL STATES & UTILITIES
  const { convertImageToBase64String, uploadImage} = useImagesAPI();
  const { createDocument } = useDataAPI();
  const { dispatchProducts } = useProductsContext();
  const { categories } = useCategoriesContext();

  // ---- HANDLE FILE CHANGE ---- \\
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
  };
 
  // ---- CATEGORY CHECKBOX ON CHECK ---- \\
  const handleCheckboxCheck = (newCategory: string) => {
    if (product.categories.includes(newCategory)) {
      // remove category
      setProduct({
        ...product,
        categories: product.categories.filter(category => category !== newCategory)
      });
    } else {
      // add category
      setProduct({
        ...product,
        categories: [...product.categories, newCategory]
      });
    }
  };

  // ---- RESET FORM DATA ---- \\
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
    if (fileInput.current != null) {
      fileInput.current.value = "";
    }
  };

  // ---- ADD PRODUCT ---- \\
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    // validation
    if (!product.name || !product.price || !product.description || !product.inStock) {
      setError("Uzupełnij dane produktu");
      return
    }
    if(product.inStock % 1 !== 0) {
      setError("Ilość dostępnego produktu nie może być ułamkiem")
      return
    }
    if (product.categories.length === 0) {
      setError("Przydziel kategorie do produktu");
      return
    }
    if (!imageList || imageList.length === 0) {
      setError("Dodaj zdjęcia produktu");
      return
    }
    
    // start the process if validation is passed
    setError("");
    setIsAdding(true);

    // convert and upload images then save their urls in product data
    Promise.all(
      imageList.map(async (image) => {
        const imageString = await convertImageToBase64String(image);
        const response = await uploadImage(imageString, "products", product.cloudinaryFolderId);

        return product.photoURLs.push(response);
      })
    )
    .then(async () => {

      // add product to database
      const result = await createDocument("products", product);
      dispatchProducts({ type: "CREATE_PRODUCT", payload: [result] });
      resetForm();
      setError("");
      setOutcome("Produkt dodany");
      setTimeout(() => setOutcome(""), 3000);
      
    })
    .catch(error => {
      console.log(error);
      setError(error.message);
    })
    .finally(() => {
      setIsAdding(false);
    })
  }

  return (
    <form className="flex flex-col p-6 mb-6 text-center text-orange-400 bg-white" onSubmit={(e) => handleSubmit(e)}>
      <h2 className="p-1 px-2 mx-auto mb-6 text-white bg-orange-400 rounded-md max-tablet:text-xl">NOWY PRODUKT</h2>
      
      <h3 className="p-1 text-white bg-orange-400 max-tablet:text-base">Dane</h3>

      {/* product name input */}
      <label className="flex flex-col items-center max-tablet:text-sm">
        <span className="m-1 font-bold">Nazwa:</span>
        <input
          className="w-4/12 p-2 text-center text-black border border-orange-400 rounded-md max-mobile:w-11/12 max-tablet:w-6/12"
          onChange={(e) => setProduct({...product, name: e.target.value})}
          value={product.name}
          id="product-name"
        />
      </label>

      {/* product price input */}
      <label className="flex flex-col items-center max-tablet:text-sm">
        <span className="m-1 font-bold">Cena (zł / szt.):</span>
        <input
          type="number"
          value={product.price}
          onChange={(e) => setProduct({...product, price: Number(e.target.value)})}
          className="px-2 py-1 text-center text-black border border-orange-400 rounded-md max-mobile:w-11/12 max-tablet:w-4/12"
          id="product-price"
        />
      </label>

      {/* product in stock quantity input */}
      <label className="flex flex-col items-center max-tablet:text-sm">
        <span className="m-1 font-bold">Ilość na magazynie (szt.):</span>
        <input
          type="number"
          value={product.inStock}
          onChange={(e) => setProduct({...product, inStock: Number(e.target.value)})}
          className="px-2 py-1 text-center text-black border border-orange-400 rounded-md max-mobile:w-11/12 max-tablet:w-4/12"
          id="product-quantity"
        />
      </label>

      {/* product description input */}
      <label className="flex flex-col items-center max-tablet:text-sm">
        <span className="m-1 font-bold">Opis:</span>
        <textarea
          className="w-6/12 h-40 text-black border border-orange-400 rounded-md outline-none max-mobile:w-11/12 max-tablet:w-10/12"
          value={product.description}
          onChange={(e) => setProduct({...product, description: e.target.value})}
          id="product-description"
        />
      </label>

      <h3 className="p-1 m-2 text-white bg-orange-400 max-tablet:text-base">Kategorie</h3>

      {/* product categories input */}
      <div className="grid w-8/12 grid-cols-4 gap-1 mx-auto text-left max-mobile:w-11/12 max-mobile:grid-cols-2 max-tablet:w-10/12">
        {categories.sort().map((item) => (
          <div key={item.name} className="flex items-center">
            <input
              type="checkbox"
              id={item.name}
              checked={product.categories.includes(item.name)}
              readOnly
            />
            <span onClick={() => handleCheckboxCheck(item.name)}/>
            <label className="pl-2 max-tablet:text-sm" htmlFor={item.name}>{item.name}</label>
          </div>
        ))}
      </div>

      <h3 className="p-1 m-2 text-white bg-orange-400 max-tablet:text-base">Zdjęcia</h3>

      {/* product images input */}
      <div className="m-2 mb-4">

        <input
          ref={fileInput}
          onChange={handleFileChange}
          type="file"
          className="max-mobile:text-transparent max-mobile:w-5/12 max-mobile:text-sm"
          multiple
        />

        {imageSizes && imageSizes.map(item => (
          <Fragment key={item.name}>
            <br />
            <span>{item.name.slice(0, 25)}</span> - <span>{(item.size / 1000000).toFixed(2)} mb</span>
          </Fragment>
        ))}

      </div>

      <button
        disabled={isAdding}
        className="w-2/12 mx-auto btn max-mobile:w-6/12 max-tablet:text-sm max-tablet:w-4/12"
      >
        {isAdding ?
          <LoadingSpinner />
        :
          "Dodaj produkt"
        }
      </button>

      {error && <div className="m-2 mx-auto error max-mobile:text-sm">{error}</div>}
      {outcome && <div className="p-2 m-2 mx-auto text-green-500 bg-green-100 border border-green-500 max-mobile:text-sm">{outcome}</div>}

    </form>
  )
}
