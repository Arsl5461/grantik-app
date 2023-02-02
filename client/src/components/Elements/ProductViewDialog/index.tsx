import { Fragment, useState } from 'react'
import { Dialog, Switch, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { StarIcon } from '@heroicons/react/solid'
import { useDialogStore } from '../../../stores/dialog'
import * as z from "zod";
import { UploadField, SelectField } from "../../../components/Form";
import {
  Form,
  InputField,
  TextAreaField,
} from "../../Form";
import { useCheckoutStore } from '../../../stores/checkout'

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}

interface UserInfo {
  data: {
    name?: string;
    quantity: number;
    job?: string;
    birthday?: string;
    deathday?: string;
    memorize?: string;
    name1?: string;
    job1?: string;
    photoSize: string;
    birthday1?: string;
    deathday1?: string;
    memorize1?: string;
  }
}

export function ProductViewDialog() {
  const { open, setOpen, product } = useDialogStore();
  const { setShow, addProduct } = useCheckoutStore();
  const [imageUrl, setImageUrl] = useState('')
  const [enabled, setEnabled] = useState(false)
  const options = [
    { label: "Veldu stærð", value: "" },
    { label: "9 x 13 cm – 29.900 kr", value: "9 x 13 cm – 29.900 kr" },
    { label: "9 x 13 cm – 29.900 kr", value: "9 x 13 cm – 29.900 kr" },
    { label: "20 x 30 cm – 49.900 kr", value: "20 x 30 cm – 49.900 kr" },
    { label: "30 x 40 cm  - 59.900 kr", value: "30 x 40 cm  - 59.900 kr" },
    { label: "50 x 60 cm – 69.900 kr", value: "50 x 60 cm – 69.900 kr" },
    { label: "40/50 x 80 cm – 79.900 kr", value: "40/50 x 80 cm – 79.900 kr" },
  ];

  const schema = z.object({});

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="hidden fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-stretch md:items-center justify-center min-h-full text-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex text-base text-left transform transition w-full md:max-w-2xl md:px-4 md:my-8 lg:max-w-4xl">
                <div className="w-full relative flex items-center bg-white px-4 pt-14 pb-8 overflow-hidden shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
                  <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>

                  <div className="w-full grid grid-cols-1 gap-y-8 gap-x-6 items-start sm:grid-cols-12 lg:gap-x-8">
                    <div className="aspect-w-2 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden sm:col-span-4 lg:col-span-5">
                      <img src={product?.imageUrl} alt={product?.name} className="object-center object-cover" />
                    </div>
                    <div className="sm:col-span-8 lg:col-span-7">
                      <h2 className="text-2xl font-extrabold text-gray-900 sm:pr-12">{product?.name}</h2>

                      <section aria-labelledby="information-heading" className="mt-2">
                        <h3 id="information-heading" className="sr-only">
                          Product information
                        </h3>

                        <p className="text-2xl text-gray-900">{product?.price} Kr</p>

                        {/* Reviews */}
                        <div className="mt-6">
                          <h4 className="sr-only">Reviews</h4>
                          <div className="flex items-center">
                            <div className="flex items-center">
                              {[0, 1, 2, 3, 4].map((rating) => (
                                <StarIcon
                                  key={rating}
                                  className={classNames(
                                    5 > rating ? 'text-yellow-900' : 'text-gray-200',
                                    'h-5 w-5 flex-shrink-0'
                                  )}
                                  aria-hidden="true"
                                />
                              ))}
                            </div>
                            <p className="sr-only">5 out of 5 stars</p>
                            {/* <a href="#" className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                              {product.reviewCount} reviews
                            </a> */}
                          </div>
                        </div>
                      </section>

                      <section aria-labelledby="options-heading" className="mt-4">
                        <h2 id="options-heading">
                          Vöruupplýsingar
                        </h2>
                        <div className="text-md text-gray-900 font-medium">
                          {product?.detail}
                        </div>
                        <h2 id="options-heading">
                          Vörulýsing
                        </h2>
                        <div className="text-md text-gray-900 font-mediu">
                          {product?.description}
                        </div>
                        <div className="py-8 flex justify-items-center space-x-3">
                          <Switch.Group>
                            <Switch.Label>Tvö nöfn</Switch.Label>
                            <Switch
                              checked={enabled}
                              onChange={setEnabled}
                              className={`${enabled ? 'bg-teal-900' : 'bg-gray-500'}
          relative inline-flex h-[28px] w-[52px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
                            >
                              <span className="sr-only">Use</span>
                              <span
                                aria-hidden="true"
                                className={`${enabled ? 'translate-x-6' : 'translate-x-0'}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                              />
                            </Switch>
                          </Switch.Group>
                        </div>
                        <Form<UserInfo["data"], typeof schema>
                          id="create-product"
                          options={{
                            defaultValues: {
                              quantity: 1,
                            },
                          }}
                          onSubmit={async (values) => {
                            product.order = values;
                            product.order.image = imageUrl;
                            addProduct(product);
                            setOpen(false);
                            setImageUrl("");
                            setShow(true);
                          }}
                        >
                          {({ register, formState }) => (
                            <>
                              <InputField
                                type="number"
                                min={1}
                                className="w-16"
                                registration={register("quantity")}
                              />
                              <div className='grid grid-cols-2 gap-2'>
                                <InputField
                                  label="Nafn"
                                  placeholder='Helga Sigurðardóttir'
                                  error={formState.errors["name"]}
                                  registration={register("name")}
                                />
                                <InputField
                                  label="Starfsheiti"
                                  error={formState.errors["job"]}
                                  placeholder='Læknir'
                                  registration={register("job")}
                                />
                                <InputField
                                  label="Fæðingardagur"
                                  placeholder='01.01.1990'
                                  error={formState.errors["birthday"]}
                                  registration={register("birthday")}
                                />
                                <InputField
                                  label="Dánardagur"
                                  placeholder='01.01.2000'
                                  error={formState.errors["deathday"]}
                                  registration={register("deathday")}
                                />
                              </div>
                              <TextAreaField
                                label="Minningarorð"
                                className="h-14"
                                placeholder='Takk fyrir allt elsku..
                                Hinsta kveðja og hjartans þökk.
                                Minning þín/ykkar er ljós í lífi okkar.
                                Í virðingu og þakklæti.
                                Margs er að minnast, margs er að sakna.'
                                error={formState.errors['memorize']}
                                registration={register('memorize')}
                              />
                              {enabled && (<><div className='grid grid-cols-2 gap-2'>
                                <InputField
                                  label="Nafn-1"
                                  placeholder='Helga Sigurðardóttir'
                                  error={formState.errors["name1"]}
                                  registration={register("name1")}
                                />
                                <InputField
                                  label="Starfsheiti-1"
                                  placeholder='Læknir'
                                  error={formState.errors["job1"]}
                                  registration={register("job1")}
                                />
                                <InputField
                                  label="Fæðingardagur-1"
                                  placeholder='01.01.1990'
                                  error={formState.errors["birthday1"]}
                                  registration={register("birthday1")}
                                />
                                <InputField
                                  placeholder='01.01.2000'
                                  label="Dánardagur-1"
                                  error={formState.errors["deathday1"]}
                                  registration={register("deathday1")}
                                />
                              </div>
                                <TextAreaField
                                  label="Minningarorð-1"
                                  placeholder='Takk fyrir allt elsku..
                                  Hinsta kveðja og hjartans þökk.
                                  Minning þín/ykkar er ljós í lífi okkar.
                                  Í virðingu og þakklæti.
                                  Margs er að minnast, margs er að sakna.'
                                  className="h-14"
                                  error={formState.errors['memorize1']}
                                  registration={register('memorize1')}
                                />
                              </>)}
                              <div className='grid sm:grid-cols-1 md:grid-cols-2 gap-10'>
                                <UploadField
                                  label='Settu mynd í viðhengi hér'
                                  extentions={"image/jpg, image/png"}
                                  url={imageUrl}
                                  setUrl={setImageUrl}
                                  registration={undefined}
                                />
                                <SelectField
                                  label="Stærð myndarinnar"
                                  options={options}
                                  defaultValue="Stones"
                                  registration={register("photoSize")}
                                />
                              </div>
                              <button
                                type="submit"
                                className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              >
                                Bæta í körfu
                              </button>
                            </>
                          )}
                        </Form>
                      </section>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

const CheckIcon = (props: any) => {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}