import Image from "next/image";
import foodia from "../../public/img/foodia-hero.png";

const Hero = () => {
  return <Image src={foodia} className="mobile-w" alt="Girl in a jacket" />;
};

export default Hero;
