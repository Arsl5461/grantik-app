import { Suspense, createRef, useEffect } from "react";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { Sky, Environment } from "@react-three/drei";
import Model from "./Model";
import Controls from "./Controls";
import ImageDrawer from "./ImageDrawer";
import { useScreenshot, createFileName } from "use-react-screenshot";
import { usePropertyStore } from "../../../stores/properties";
import { Text } from "troika-three-text";
import background from "../../../assets/images/BackgroundBuilder.hdr";
import { useCheckoutStore } from "../../../stores/checkout";
import { Html, useProgress } from "@react-three/drei";
import { useModelStore } from "../../../stores/models";
import { useCurrentPropertyStore } from "../../../stores/current";
import logo from "../../../assets/images/mini.png";
extend({ Text });

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <img src={logo} className="w-26 mb-4" />
      <div className="text-center font-medium">{progress} % Loading...</div>
    </Html>
  );
}

const ImageTool = () => {
  const { properties, getProducts, removeProperty } = usePropertyStore();
  const { currentPropertyId } = useCurrentPropertyStore();
  const { setMode, setTarget } = useModelStore();
  const { setShow, addProduct } = useCheckoutStore();

  const ref = createRef<HTMLCanvasElement>();
  const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });

  const download = (image: any, { name = "img", extension = "jpg" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const downloadScreenshot = () => {
    setShow(true);
    takeScreenShot(ref.current).then(download);
    properties.map((property) => {
      if (property.mode === "gltf") {
        addProduct({ ...property.product, order: { quantity: 1 } });
      }
    });
  };

  const handleRemoveItem = () => {
    removeProperty(currentPropertyId);
    setTarget(null);
    setMode(0);
  }

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="h-full">
      <div className="absolute z-10 bottom-0 right-0 h-60 p-3 w-64 bg-slate-300 opacity-70">
        <div>
          1: Ýttu á vinstri takka á músinni til að breyta staðsetningu á hlutum.{" "}
        </div>
        <div>2: Ýttu á hægri takka á músinni til að snúa hlutum.</div>
        <div>3: Hægt er að færa hluti með því að draga þá með músinni.</div>
        <div>
          4: Til að draga hlutinn að þér, þarft þú að halda Ctrl og með vinstri
          takka á músinni dregur hlutinn að þér
        </div>
      </div>
      <button
        className="absolute z-10 top-10 left-10 h-10 w-60 rounded-full bg-white"
        onClick={downloadScreenshot}
      >
        Bæta í körfu / Vista drög
      </button>
      <button
        className="absolute z-10 top-24 left-10 h-10 w-60 rounded-full bg-white"
        onClick={handleRemoveItem}
      >
        Fjarlægðu hlut
      </button>
      <ImageDrawer />
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 12], fov: 30 }}
        dpr={[1, 2]}
        ref={ref}
      >
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
        <Suspense fallback={<Loader />}>
          <Environment
            files={background}
            ground={{ height: 5, radius: 10, scale: 40 }}
          />
          {properties.map((property: any, index) => {
            return <Model key={index} property={property} />;
          })}
        </Suspense>
        <Controls />
      </Canvas>
    </div>
  );
};

export default ImageTool;
