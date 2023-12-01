// Imports
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

// TYPES
type CarouselComponentProps = {
  children: JSX.Element[]
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

export default function CarouselComponent({children}: CarouselComponentProps) {
  return (
    <Carousel
      responsive={responsive}
      draggable={false}
      removeArrowOnDeviceType={["tablet", "mobile"]}
    >
      {children}
    </Carousel>
  )
}
