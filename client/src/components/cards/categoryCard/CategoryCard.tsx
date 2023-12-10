// IMPORTS
import { Link } from "react-router-dom";
import { useCategoriesContext } from "../../../hooks/useContextHooks/useCategoriesContext";

// TYPES
type Category = {
  _id: string
  name: string
  imageURL: string
} | undefined
type CategoryCardProps = {
  category: Category
}

export default function CategoryCard({category}: CategoryCardProps) {
  // GLOBAL STATES && UTILITIES
  const { categories } = useCategoriesContext();

  if (!category?.imageURL) {
    return null
  }

  return (
    <Link to={`/categories/${category?.name}`}>
        <div
          style={ { backgroundImage: `url(${category ? category.imageURL : categories[0].imageURL})` } }
          className="flex items-end mx-3 mt-4 mb-2 transition-all duration-300 ease-out bg-center bg-cover rounded-md shadow-md max-mobile:mb-0 max-mobile:mt-2 h-80 max-mobile:h-64 group hover:scale-105 max-tablet:h-72"
        >
          <h2 className="w-full px-2 py-1 mb-4 tracking-wide text-center text-white transition-all duration-300 ease-out bg-orange-400 max-mobile:text-base max-tablet:text-lg group-hover:mb-0 group-hover:rounded-b-md group-hover:bg-orange-600">{category ? category.name : categories[0].name}</h2>
        </div>
    </Link>
  )
}
