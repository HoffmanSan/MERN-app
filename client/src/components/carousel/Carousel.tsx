// Imports
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

type CarouselElementProps = {
  title?: String
  price: Number
  _id: any
}[]

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

export default function CarouselElement({products}:{products: CarouselElementProps}) {
  return (
    <Carousel
      responsive={responsive}
      draggable={false}
      removeArrowOnDeviceType={["tablet", "mobile"]}
    >
    {products.map((item) => (
      <div key={item._id} className="w-48 h-48 bg-gray-400">
        <Link to="/account">
          <p className="text-white text-lg">{item.title}</p>
          <p className="text-white text-lg">{item.price.toString()}</p>
        </Link>
      </div>
    ))}
    </Carousel>
  )
}
