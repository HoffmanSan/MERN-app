// Imports
import { Link } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// Components
import { Card } from "../index";

type CarouselElementProps = {
  products: {
    _id: number
    name: string
    price: number
    categories: string[]
    description: string
    inStock: number
    photoURLs: string[]
    createdAt: Date
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
    {products && products.map((item) => (
      <Card product={item} key={item._id}/>
    ))}
    </Carousel>
  )
}
