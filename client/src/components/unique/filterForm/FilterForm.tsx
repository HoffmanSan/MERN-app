// Imports
import { useState } from "react";

// Components
import { NumberInput, CheckboxInput } from "../../index";

// TS types
type FilterFormProps = {
  categoryList: string[],
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
  }

  return (
    <form className="col-span-1 p-5 bg-white" onSubmit={(e) => handleSubmit(e)}>
      <h2>Filtry</h2>

      <h3 className="py-1 text-lg font-bold">Cena</h3>
      <NumberInput name="min-price" placeholder="od" handleChange={setMinPrice}/>
      <span className="mx-1">-</span>
      <NumberInput name="max-price" placeholder="do" handleChange={setMaxPrice}/>

      <h3 className="py-1 text-lg font-bold">Kategorie</h3>
      <div className="grid grid-cols-2 gap-y-2">
        {categoryList.map((item) => (
          <div className="flex items-center" key={item}>
            <CheckboxInput category={item} handleClick={() => handleCheck(item)}/>
            <label className="pl-2" htmlFor={`category-${item}`}>{item}</label>
          </div>
        ))}
      </div>
      <button className="float-right btn">SZUKAJ</button>
    </form>
  )
}
