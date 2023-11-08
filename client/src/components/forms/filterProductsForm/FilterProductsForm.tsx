// IMPORTS
import { useRef, useState } from "react";

// TYPES
type Category = {
  name: string
  _id: string
}
type FilterFormProps = {
  categoryList: Category[],
  handleFilter: (minPrice: number, maxPrice: number, categories: string[]) => void;
}

export default function FilterForm({categoryList, handleFilter}: FilterFormProps) {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(99999);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);

  const handleCheck = (newCategory:string) => {
    if (filteredCategories.includes(newCategory)) {
      // remove category from filteredCategories
      setFilteredCategories(filteredCategories.filter(category => category !== newCategory))
    } else {
      // add category to filteredCategories
      setFilteredCategories(prevCategories => {return [...prevCategories, newCategory]})
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilter(minPrice, maxPrice, filteredCategories);
  };

  return (
    <form className="p-5 bg-white shadow-md h-min" onSubmit={(e) => handleSubmit(e)}>
      <h2>Filtry</h2>

      <h3 className="py-1 text-lg font-bold">Cena</h3>

      <input
        type="number"
        placeholder="od"
        onChange={(e) => setMinPrice(Number(e.target.value))}
        className="w-5/12 px-2 py-1 border border-black"
        id="filter-minimum-price"
      />

      <span className="mx-1">-</span>

      <input
        type="number"
        placeholder="do"
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className="w-5/12 px-2 py-1 border border-black"
        id="filter-maximum-price"
      />

      <h3 className="py-1 text-lg font-bold">Kategorie</h3>
      
      <div className="grid grid-cols-2 gap-y-2">
        {categoryList.map((item) => (
          <div className="flex items-center" key={item.name}>
            <>
              <input
                type="checkbox"
                id={item.name}
                checked={filteredCategories.includes(item.name)}
                readOnly
              />
              <span onClick={() => handleCheck(item.name)}/>
            </>
            <label className="pl-2" htmlFor={item.name}>{item.name}</label>
          </div>
        ))}
      </div>
      <button className="float-right mt-5 btn">Szukaj</button>
    </form>
  )
}
