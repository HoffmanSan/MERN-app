// Imports
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

type CarouselElementProps = {
  products: {
    _id: number,
    name: string,
    price: number,
    categories: string[]
  }[]
}

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 8,
    slidesToSlide: 8
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 5
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

export default function CarouselElement({products}:CarouselElementProps) {
  return (
    <Carousel
      responsive={responsive}
      draggable={false}
      removeArrowOnDeviceType={["tablet", "mobile"]}
    >
    {products.map((item) => (
      <div key={item._id} className="w-48 h-48 mx-auto mt-3 bg-gray-400">
        <Link to={`/product/${item._id}`}>
          <p className="text-lg text-white">{item.name}</p>
          <p className="text-lg text-white">{item.price.toString()}</p>
        </Link>
      </div>
    ))}
    </Carousel>
  )
}
