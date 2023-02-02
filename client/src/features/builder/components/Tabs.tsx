import { useState } from 'react';
import uuid from 'react-uuid';
import { Tab } from "@headlessui/react";
import { usePropertyStore } from "../../../stores/properties";
import { Product } from '../../product';
import { UploadField, TextAreaField } from "../../../components/Form";
import { Button } from '../../../components/Elements';
import { useCreatePhoto } from '../api/createPhoto';
import { usePhotos } from '../api/getPhotos';
import { useDeletePhoto } from '../api/deletePhoto';
import ResponsiveText from './ResponsiveText';
import { useModelStore } from '../../../stores/models';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Tabs = () => {
  const { properties, products, addProperty, updateProperty, removeProperty } = usePropertyStore();
  const { setTarget } = useModelStore();

  const addElement = () => {
    addProperty({
      id: uuid(),
      mode: 'text',
      textObj: {
        font: "Times New Romans Bold Italic",
        fontSize: 0.05,
        text: "",
        color: "#FFFFFF",
        maxWidth: 300,
        lineHeight: 1,
        letterSpacing: 0,
        textAlign: "justify",
        materialType: "MeshPhongMaterial",
      },
      position: [0, 1, 0.5],
      rotation: [0, 0, 0],
      scale: [1, 1, 1],
    })
  }
  const setOpts = (options: any, item: any) => {
    updateProperty({ ...item, textObj: options })
  }
  const deletePhotoMutation = useDeletePhoto();
  const photosQuery = usePhotos();
  const createPhotoMutation = useCreatePhoto();
  const [imageUrl, setImageUrl] = useState("");

  if (!photosQuery.data) return null;

  const initial = {
    Legsteinn: [] as Product[],
    Lukt: [] as Product[],
    Vasi: [] as Product[],
    Leiðisrammi: [] as Product[],
    Myndir: photosQuery.data as any,
    Áletrun: []
  } as any

  const productsByType = products.reduce((obj, product) => {
    obj[product?.type].push(product)
    return obj
  }, initial)

  const handleAddImage = async () => {
    await createPhotoMutation.mutateAsync({ data: { imageUrl: imageUrl } })
    setImageUrl("")
  }

  const deleteText = (item: any) => {
    removeProperty(item.id);
  }

  const handleChangeText = (text: string, item: any) => {
    updateProperty({ ...item, textObj: { ...item.textObj, text: text } })
  }

  const handleClickProduct = (product: any) => {
    var x = Math.ceil(Math.random() * 3) * (Math.round(Math.random()) ? 1 : -1)
    var z = Math.ceil(Math.random() * 3) * (Math.round(Math.random()) ? 1 : -1)

    if (!properties.length) {
      x = 0;
      z = 0;
    }
    const obj = {
      id: uuid(),
      url: product.gltfUrl,
      product: product,
      mode: "gltf",
      position: [x, 0, z],
      rotation: [0, 0, 0],
      scale: [2, 2, 2],
    };

    if (!product.gltfUrl) {
      obj.mode = "image";
      obj.url = product.imageUrl
    }
    addProperty(obj as any);
  };

  const deletePhoto = async (photoId: string) => {
    await deletePhotoMutation.mutateAsync({ photoId: photoId })
  }

  return (
    <div className="w-full max-w-md px-2 py-1 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-slate-400 p-1">
          {Object.keys(productsByType).map((category) => (
            <Tab
              key={category}
              className={({ selected }: any) => {
                return classNames(
                  "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                  "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                  selected
                    ? "bg-white shadow"
                    : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                );
              }
              }
            >
              {category === 'Lukt' ? 'Vasar og luktir' : category === 'Vasi' ? 'Skreytingar og fuglar' : category}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels
          className="mt-2 overflow-y-auto"
          style={{ height: "calc(100vh - 180px)" }}
        >
          {Object.values(productsByType).map((products: any, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                "rounded-xl bg-white p-3",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none"
              )}
            >
              {idx === 5 && (
                <div className="m-auto">
                  {properties.filter((property) => property.mode === 'text').map((item, index) => (
                    <div className="mt-3" key={item.id}>
                      <TextAreaField
                        label={`Texti-${index + 1}`}
                        className="h-24"
                        defaultValue={item.textObj?.text}
                        onChange={(e: any) => handleChangeText(e.target.value, item)}
                        registration={undefined}
                      />
                      <ResponsiveText opts={item?.textObj} setOpts={(textOption: any) => setOpts(textOption, item)} />
                      <Button className='text-sm rounded p-2 mt-2 bg-red-400 w-full text-white font-bold' onClick={() => deleteText(item)}>Fjarlægja áletrun</Button>
                    </div>
                  ))}
                  <Button className='text-sm rounded p-2 mt-2 bg-orange-300 w-full text-orange-900 font-bold' onClick={addElement}>Bæta við áletrun</Button>
                </div>
              )}
              {idx === 4 && (
                <div className="w-48 m-auto">
                  <UploadField
                    label='Mynd'
                    extentions={"image/jpg, image/png"}
                    url={imageUrl}
                    setUrl={setImageUrl}
                    registration={undefined}
                  />
                  <div className="flex justify-center mt-4">
                    <Button
                      disabled={imageUrl ? false : true}
                      onClick={handleAddImage}
                      size="sm"
                      isLoading={createPhotoMutation.isLoading}
                    >
                      Bæta við
                    </Button>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2">
                {products?.map((product: Product, ind: any) => {
                  return (
                    <div className="p-1" key={ind}>
                      <a className="c-card block bg-white shadow-md hover:shadow-xl rounded-lg overflow-hidden">
                        <div className="relative pb-48 overflow-hidden">
                          <img
                            className="absolute inset-0 h-full w-full object-cover hover:scale-110 duration-200"
                            src={product.imageUrl}
                            alt={product.name} />
                        </div>
                        <div className="p-4">
                          {idx !== 4 && (
                            <>
                              <span className="inline-block px-2 py-1 leading-none bg-orange-200 text-orange-800 rounded-full font-semibold uppercase tracking-wide text-xs">
                                Vinsælar vörur
                              </span>
                              <h2 className="mt-2 mb-2  font-bold">
                                {product.name}
                              </h2>
                              <div className="text-sm">{product.description}</div>
                              <div className="my-3 flex items-center">
                                <span className="font-bold text-xl">
                                  {product.price}
                                </span>
                                &nbsp;
                                <span className="text-sm font-semibold">Kr</span>
                              </div>
                            </>
                          )}
                          <div className="flex">
                            <button
                              onClick={() => handleClickProduct(product)}
                              className="text-sm rounded p-2 bg-orange-300 w-full text-orange-900 font-bold"
                            >
                              Velja
                            </button>
                            {idx === 4 && (
                              <button
                                onClick={() => deletePhoto(product._id)}
                                className="text-sm rounded p-2 ml-2 bg-orange-300 w-full text-orange-900 font-bold"
                              >
                                Fjarlægja
                              </button>
                            )}
                          </div>
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Tabs;
