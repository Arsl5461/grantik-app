import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import './slider-animations.css';
import './styles.css';
import contents from '../../utils/content';
import { Link } from 'react-router-dom';

const Carousel = () => {
  return (
    <Slider autoplay={3000} className="slider-wrapper">
      {contents.map((item, index) => (
        <div
          key={index}
          className="slider-content"
          style={{ background: `url('${item.image}') no-repeat center center` }}
        >
          <div className="inner">
            <h1>{item.title}</h1>
            <p className="text-4xl">{item.description}</p>
            <p className='text-2xl underline'>granitverk@granitverk.is</p>
            <div className="flex justify-center">
              <Link to="/products" className='px-6 py-2 border-2 border-white text-white font-medium sm:text-md lg:text-4xl leading-tight uppercase rounded hover:bg-black hover:bg-opacity-2 focus:outline-none focus:ring-0 transition duration-150 ease-in-out'>{item.button}</Link>
              <Link to="/discussion" className='px-6 py-2 border-2 border-white text-white font-medium sm:text-md lg:text-4xl leading-tight uppercase rounded hover:bg-black hover:bg-opacity-2 focus:outline-none focus:ring-0 transition duration-150 ease-in-out ml-2'>Spjall</Link>
            </div>
          </div>
        </div>
      ))}
    </Slider>
  );
}

export default Carousel;