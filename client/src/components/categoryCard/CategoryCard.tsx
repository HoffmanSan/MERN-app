// IMPORTS
import { Link } from "react-router-dom";

export default function CategoryCard() {
  return (
    <Link to="/categories/">
      <div
        style={ {backgroundImage: "url(https://res-console.cloudinary.com/djbvs9if0/thumbnails/transform/v1/image/upload/Y19saW1pdCxoXzE2MDAsd18xNjAwLGZfanBnLGZsX2xvc3N5LmFueV9mb3JtYXQucHJlc2VydmVfdHJhbnNwYXJlbmN5LnByb2dyZXNzaXZl/v1/c2FtcGxlcy9sb29rLXVw/template_primary)"} }
        className="flex items-end m-3 bg-center bg-cover rounded-md h-72"
      >
        <h3 className="px-2 py-1 mb-4 text-center text-white bg-orange-400">Mechanika</h3>
      </div>
    </Link>
  )
}
