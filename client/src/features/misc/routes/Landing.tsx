import { Carousel, FeaturesHome, FeaturesBlock, Delivery, Map, Footer } from '../../../components/Landing';
import { LandingLayout } from '../../../components/Layout';

export const Landing = () => {
  return (
    <>
      <LandingLayout>
        <Carousel />
        <FeaturesHome />
        <FeaturesBlock />
        <Delivery />
        <Map />
        <Footer />
      </LandingLayout>
    </>
  );
};
