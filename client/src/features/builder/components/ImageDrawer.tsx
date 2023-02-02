import React from "react";
import { Drawer } from "../../../components/Elements";
import Tabs from './Tabs';
import { useDisclosure } from "../../../hooks/useDisclosure";

const ImageDrawer = () => {
  const { close, open, isOpen } = useDisclosure();

  return (
    <>
      {React.cloneElement(<button className="absolute z-10 top-10 right-10 h-10 w-20 rounded-full bg-white">Vörulisti</button>, { onClick: open })}
      <Drawer
        isOpen={isOpen}
        onClose={close}
        title="Vörulisti"
        size="sm"
      >
        <Tabs></Tabs>
      </Drawer>
    </>
  );
};

export default ImageDrawer;
