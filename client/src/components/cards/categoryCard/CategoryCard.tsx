// IMPORTS
import { Link } from "react-router-dom";

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
  return (
    <Link to={`/categories/${category?.name}`}>
      {category ? 
        <div
          style={ { backgroundImage: `url(${category.imageURL})` } }
          className="flex items-end mx-3 mt-4 mb-2 transition-all duration-300 ease-out bg-center bg-cover rounded-md shadow-md max-mobile:mb-0 max-mobile:mt-2 h-80 max-mobile:h-64 group hover:scale-105"
        >
          <h2 className="w-full px-2 py-1 mb-4 tracking-wide text-center text-white transition-all duration-300 ease-out bg-orange-400 max-mobile:text-base group-hover:mb-0 group-hover:rounded-b-md group-hover:bg-orange-600">{category.name}</h2>
        </div>
      :
        <div></div>
      }
    </Link>
  )
}
