import { useState, useRef } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { useCursor, Image, useGLTF } from "@react-three/drei";
import { useModelStore } from "../../../stores/models";
import { usePropertyStore, Property } from "../../../stores/properties";
import { useCurrentPropertyStore } from "../../../stores/current";
import { Text } from "troika-three-text";
import fonts from "./font";
extend({ Text });

const modes = ["translate", "rotate", "scale"];

const GLTFModel = ({
  model,
  onClick,
  onContextMenu,
  setTarget,
  setMode,
  setHovered,
  property,
}: any) => {
  const { scene }: any = useGLTF(property.url);

  return (
    <group>
      <primitive
        object={scene}
        ref={model}
        onClick={onClick}
        onContextMenu={onContextMenu}
        onPointerMissed={(e: any) =>
          e.type === "click" && (setTarget(null), setMode(0))
        }
        onPointerOver={(e: any) => {
          e.stopPropagation();
          setHovered(true);
        }}
        position={property.position}
        rotation={property.rotation}
        scale={property.scale}
      />
    </group>
  );
};

const Model = ({ property }: { property: Property }) => {
  const { mode, setMode, setTarget } = useModelStore();
  const { setCurrentPropertyId } = useCurrentPropertyStore();
  const [hovered, setHovered] = useState(false);
  const model = useRef(null);
  useCursor(hovered);

  const handleClick = (e: any, property: Property) => {
    e.stopPropagation();
    setCurrentPropertyId(property.id);
    setTarget(e.eventObject);
  };

  const handleContext = (e: any) => {
    e.stopPropagation();
    setMode((mode + 1) % modes.length);
  };

  if (property.mode === "image") {
    return (
      <group>
        <Image
          url={property.url as any}
          ref={model}
          onClick={(e) => handleClick(e, property)}
          onContextMenu={handleContext}
          onPointerMissed={(e: any) =>
            e.type === "click" && (setTarget(null), setMode(0))
          }
          scale={0.5}
          position={[0, 1.5, 0.1]}
          rotation={[0, 0, 0]}
        />
      </group>
    );
  } else if (property.mode === "text") {
    return (
      <text
        className={property.id}
        position={property?.position}
        rotation={property?.rotation}
        scale={property?.scale}
        {...property.textObj}
        onClick={(e) => handleClick(e, property)}
        onContextMenu={handleContext}
        // onPointerMissed={(e: any) =>
        //   e.type === "click" && (setTarget(null), setMode(0))
        // }
        // @ts-ignore
        text={property.textObj?.text}
        // @ts-ignore
        font={fonts[property.textObj?.font]}
        anchorX="center"
        anchorY="middle"
      >
        {property.textObj?.materialType === "MeshPhongMaterial" ? (
          <meshPhongMaterial
            attach="material"
            color={property.textObj?.color}
          />
        ) : null}
      </text>
    );
  }

  return (
    <GLTFModel
      model={model}
      onClick={(e: any) => handleClick(e, property)}
      onContextMenu={handleContext}
      setMode={setMode}
      setTarget={setTarget}
      setHovered={setHovered}
      property={property}
    />
  );
};

export default Model;
