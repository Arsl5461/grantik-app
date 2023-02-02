import { useState } from 'react';
import { useCheckoutStore } from "../../../stores/checkout";
import { Product } from "../../product";
import { useNavigate } from "react-router-dom";
import { Button } from '../../../components/Elements';

export const Checkout = () => {
  const { show, setShow, removeProduct, products, updateProduct } =
    useCheckoutStore();
  const total = products.reduce((sum, product) => {
    return sum + product?.price * product?.order?.quantity;
  }, 0);

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isClick, setClick] = useState(false);

  const navigate = useNavigate();

  const handleQuantity = (value: string, product: Product) => {
    updateProduct({ ...product, order: { ...product.order, quantity: value } });
  };

  const handleCheckout = () => {
    setShow(false);
    navigate("/checkout");
  };

  const handleChange = (e: any) => {
    setCode(e.target.value);
  }

  const handlePromoAction = () => {
    if (code === 'haust' && !isClick) {
      setClick(true);
      setMessage("Afsláttur tókst!")
      products.map((product) => {
        updateProduct({ ...product, price: product.price * 0.8 });
      })

    } else {
      setMessage('Ógildur afsláttarkóði!')
    }
  }

  return (
    <>
      <div>
        {show && (
          <div
            className="w-full h-full bg-black bg-opacity-90 top-0 overflow-y-auto overflow-x-hidden fixed sticky-0 z-50"
            id="chec-div"
          >
            <div
              className="w-full absolute z-10 right-0 h-full overflow-x-hidden transform translate-x-0 transition ease-in-out duration-700"
              id="checkout"
            >
              <div className="flex md:flex-row flex-col justify-end" id="cart">
                <div
                  className="lg:w-1/2 w-full md:pl-10 pl-4 pr-10 md:pr-4 md:py-12 py-8 bg-white overflow-y-auto overflow-x-hidden h-screen"
                  id="scroll"
                >
                  <div
                    className="flex items-center text-gray-500 hover:text-gray-600 cursor-pointer"
                    onClick={() => setShow(!show)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-chevron-left"
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <polyline points="15 6 9 12 15 18" />
                    </svg>
                    <p className="text-sm pl-2 leading-none">Til baka</p>
                  </div>
                  <p className="text-5xl font-black leading-10 text-gray-800 pt-3">
                    Karfa
                  </p>
                  {products.map((product) => {
                    return (
                      <div
                        className="md:flex items-center mt-14 py-8 border-t border-gray-200"
                        key={product?._id}
                      >
                        <div className="w-1/4">
                          <img
                            src={product?.imageUrl}
                            alt={product?.name}
                            className="w-full h-full object-center object-cover"
                          />
                        </div>
                        <div className="md:pl-3 md:w-3/4">
                          <p className="text-md leading-3 text-gray-800 md:pt-0 pt-4">
                            {product?.type}
                          </p>
                          <div className="flex items-center justify-between w-full pt-1">
                            <p className="font-black leading-none text-gray-800 text-xl">
                              {product?.name}
                            </p>
                            <select
                              className="py-2 px-1 border border-gray-200 mr-6 focus:outline-none"
                              onChange={(e) =>
                                handleQuantity(e.target.value, product)
                              }
                              value={product?.order?.quantity}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
                                <option value={item} key={item}>
                                  {item}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="text-md leading-3 text-gray-600 pt-2">
                            {product?.detail}
                          </div>
                          <div className="flex items-center justify-between pt-5 pr-6">
                            <div className="flex itemms-center">
                              <p
                                className="text-md leading-3 underline text-red-500 cursor-pointer"
                                onClick={() => removeProduct(product?._id)}
                              >
                                Eyða
                              </p>
                            </div>
                            <p className="text-base font-black leading-none text-gray-800">
                              {Number(product?.price).toFixed(3)} Kr
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="xl:w-1/4 md:w-1/3 w-full bg-gray-100 h-full">
                  <div className="flex flex-col md:h-screen px-14 py-20 justify-between overflow-y-auto">
                    <div className="h-96 overflow-auto">
                      <p className="text-4xl font-black leading-9 text-gray-800">
                        Samantekt
                      </p>
                      {products.map((product) => {
                        return (
                          <div
                            className="flex items-center justify-between pt-5"
                            key={product?._id}
                          >
                            <p className="text-base leading-none text-gray-800">
                              {product?.name + " (" + product?.price + ")"}{" "}
                              &times; {product?.order?.quantity}
                            </p>
                            <p className="text-base leading-none text-gray-800">
                              {Number(product?.price * product?.order?.quantity).toFixed(3)} Kr
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div>
                      <label
                        htmlFor="promo"
                        className="font-semibold inline-block mb-3 text-sm uppercase"
                      >
                        Afsláttarkóði
                      </label>
                      <input
                        onChange={handleChange}
                        type="text"
                        id="promo"
                        placeholder="Sláðu inn kóðann þinn"
                        className="p-2 text-sm w-full mb-3"
                      />
                      <Button onClick={handlePromoAction} className="bg-red-500 hover:bg-red-600 px-5 py-2 text-sm text-white uppercase w-full" disabled={isClick}>
                        Virkja
                      </Button>
                      <span className={isClick ? 'text-green' : 'text-red'}>{message}</span>
                    </div>
                    <div>
                      <div className="flex items-center pb-6 justify-between lg:pt-5 pt-20">
                        <p className="text-2xl leading-normal text-gray-800">
                          Samtals
                        </p>
                        <p className="text-2xl font-bold leading-normal text-right text-gray-800">
                          {Number(total).toFixed(3)} Kr
                        </p>
                      </div>
                      <button
                        onClick={handleCheckout}
                        className="text-base leading-none w-full py-5 bg-gray-800 border-gray-800 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white"
                      >
                        KLÁRA PÖNTUN
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>
        {` /* width */
                #scroll::-webkit-scrollbar {
                    width: 1px;
                }

                /* Track */
                #scroll::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                /* Handle */
                #scroll::-webkit-scrollbar-thumb {
                    background: rgb(133, 132, 132);
                }
`}
      </style>
    </>
  );
};
