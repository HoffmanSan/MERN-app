// Imports
import { FormEvent, useState } from "react";
import { useConvertImages } from "../../../hooks/useConvertImages";
import axios from "axios";

// Components
import { CheckboxInput } from "../../index";
import { createAwait } from "typescript";

const categoryList= ["Kuchenne AGD", "Elektronika", "Rowery i akcesoria", "Mechanika", "Sztuka", "RTV", "Hydraulika", "Ogród", "Garaż"];

export default function CreateProduct() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<string>("");
  const { convertImageToBase64 } = useConvertImages();
  
  // Product data
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [imageList, setImageList] = useState<FileList | null>(null);
  
  const handleCheck = (newCategory:string) => {
    if (categories.includes(newCategory)) {
      // remove category from filteredCategories
      setCategories(categories.filter(category => category !== newCategory))
    } else {
      // add category to filteredCategories
      setCategories(prevCategories => {return [...prevCategories, newCategory]})
    }
  };

  const resetForm = () => {
    setName("");
    setPrice(0);
    setDescription("");
    setQuantity(0);
    setCategories([]);
    setImageList(null);
    setError("");
    setIsLoading(false);
  };

  const addProductToDatabase = (product: any) => {
    axios.post("/api/products", { ...product })
    .then((response) => {
      console.log(response);
      resetForm()
      setOutcome("Produkt dodany!")})
    .catch((error) => {
      console.log(error);
      setError(error)})
  }

  const convertAndUploadImages = async (imageList : FileList) => {
    const imageArray = Object.values(imageList)
    const imageUrlArray: string[] = [];

    for (let i = 0; i < imageArray.length+1; i++) {
      if (i === imageArray.length) {
        const product = {
          title: "name",
          price: 1,
          description: "description",
          inStock: 1,
          categories: ["categories", "asds"],
          photoURLS: imageUrlArray
        }
        addProductToDatabase(product)
        console.log("PRODUCT ADDED TO DATABASE")
        return 
      }
      
      const convertedFile = await convertImageToBase64(imageArray[i]);
      console.log(convertedFile);

      axios.post("/uploadImage", { image: convertedFile })
      .then((response) => {
        imageUrlArray.push(response.data);
        console.log("IMAGE UPLOADED TO SERVER ON ADRESS:", response.data)
      })
      .catch((error) => {
        console.log(error);
        setError("Wystąpił błąd podczas próby zapisania zdjęć na serwerze");
        return
      })
    }
  }

  

  // Add product to database
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();


    if (!imageList || imageList.length === 0) {
      setError("Dodaj zdjęcia produktu");
      return
    }
    
    // Start process if validation is passed
    setError("");
    setIsLoading(true);

    convertAndUploadImages(imageList)
  }

  return (
    <form className="flex flex-col p-6 text-center text-orange-400 bg-white rounded-md shadow-md" onSubmit={(e) => handleSubmit(e)}>
      <h2>NOWY PRODUKT</h2>
      
      <h3>Dane</h3>

      <>
        <label className="flex flex-col items-center">
          <span className="font-bold">Nazwa:</span>
          <input
            className="w-6/12 p-2 my-1 text-center text-black border border-orange-400 rounded-md"
            onChange={(e) => setName(e.target.value)}
            value={name}
            id="product-name"
          />
        </label>

        <label className="flex flex-col items-center">
          <span className="font-bold">Cena (zł / szt.):</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-6/12 px-2 py-1 text-center border border-orange-400 rounded-md"
            id="product-price"
          />
        </label>

        <label className="flex flex-col items-center">
          <span className="font-bold">Ilość na magazynie (szt.):</span>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-6/12 px-2 py-1 text-center border border-orange-400 rounded-md"
            id="product-quantity"
          />
        </label>

        <label className="flex flex-col items-center">
          <span className="font-bold">Opis:</span>
          <textarea
            className="w-8/12 h-40 border border-orange-400 rounded-md outline-none"
            value={description}
            onChange={(e) => {setDescription(e.target.value)}}
            id="product-description"
          />
        </label>
      </>

      <h3>Kategorie</h3>

      <div className="grid w-8/12 grid-cols-4 gap-1 mx-auto text-left">
        {categoryList.map((item) => (
          <div key={item} className="flex items-center">
            <CheckboxInput category={item} categories={categories} handleClick={() => handleCheck(item)}/>
            <label className="pl-2" htmlFor={item}>{item}</label>
          </div>
        ))}
      </div>

      <h3>Zdjęcia</h3>

      <div className="m-3">
        <input
          onChange={(e) => {setImageList(e.target.files); setError("")}}
          type="file"
          multiple
        />
      </div>

      <button disabled={isLoading} className={`btn w-4/12 mx-auto ${isLoading ? "bg-gray-400" : ""}`}>Dodaj produkt</button>
      {error && <div className="m-2 mx-auto error">{error}</div>}
      {outcome && <div className="p-2 m-2 mx-auto text-green-700 bg-green-300 border border-green-700">{outcome}</div>}
      <button type="button" onClick={() => {
        if (!imageList) {
          return
        }
        convertAndUploadImages(imageList)}}>POKAŻ IMAGEURLS</button>
    </form>
  )
}
