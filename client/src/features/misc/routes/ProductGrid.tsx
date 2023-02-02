import { Spinner } from "../../../components/Elements";
import { useNavigate } from 'react-router';
import { Tab } from '@headlessui/react'
import { LandingLayout } from '../../../components/Layout';
import { Product } from '../../product';
import { useAuth } from "../../../lib/auth";
import { useProducts } from '../../product/api/getProducts';
import { useDialogStore } from "../../../stores/dialog";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const ProductGrid = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const productsQuery = useProducts();
    const { setOpen, setProduct } = useDialogStore();

    if (productsQuery.isLoading) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!productsQuery.data) return null;

    const initial = {
        Legsteinn: [] as Product[],
        "Lukt": [] as Product[],
        "Vasi": [] as Product[],
        Leiðisrammi: [] as Product[],
    } as any

    const productsByType = productsQuery.data.reduce((obj, product) => {
        obj[product?.type].push(product)
        return obj
    }, initial)

    const handleOpenModal = (product: Product) => {
        setOpen(true);
        setProduct(product);
    }

    const handleEngrave = () => {
        if (user) {
            navigate('/app');
        } else {
            navigate('/auth/login');
        }
    }

    return (
        <LandingLayout>
            <div className="bg-gray-100 w-full">
                <div className="mx-auto py-16 px-16 sm:px-6">
                    <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Vörulisti</h2>
                    <Tab.Group>
                        <Tab.List className="max-w-5xl m-auto flex space-x-1 rounded-xl bg-slate-600 p-1">
                            {Object.keys(productsByType).map((category) => (
                                <Tab
                                    key={category}
                                    className={({ selected }: any) => {
                                        return classNames(
                                            "w-full rounded-lg py-2.5 text-lg font-large leading-5 text-blue-700",
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
                        <Tab.Panels>
                            {Object.values(productsByType).map((products: any, idx) => (
                                <Tab.Panel
                                    key={idx}
                                    className={classNames(
                                        "rounded-xl bg-gray-100 p-3",
                                        "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none"
                                    )}
                                >
                                    <div className="mt-2 grid gap-y-10 gap-x-3 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-4">
                                        {products.map((product: Product) => (
                                            <div key={product._id} className="">
                                                <div className="container flex justify-center">
                                                    <div className="max-w-sm py-6">
                                                        <div className="bg-white relative shadow-lg hover:shadow-xl transition duration-500 rounded-lg">
                                                            <img className="rounded-t-lg w-full h-96" src={product.imageUrl} alt={product.name} />
                                                            <div className="py-6 px-8 rounded-lg bg-white">
                                                                <h1 className="text-gray-700 font-bold text-2xl mb-3 hover:text-gray-900 hover:cursor-pointer">{product.name}</h1>
                                                                <p className="text-gray-700 tracking-wide">{product.detail}</p>
                                                                <div className="flex justify-between">
                                                                    <button className="mt-6 py-2 mr-5 px-4 bg-yellow-400 text-gray-800 font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300" onClick={() => handleOpenModal(product)}>Skoða</button>
                                                                    <button className="mt-6 py-2 px-4 bg-yellow-400 text-gray-800 font-bold rounded-lg shadow-md hover:shadow-lg transition duration-300" onClick={handleEngrave}>Hanna vöru/Velja áletrun</button>
                                                                </div>
                                                            </div>
                                                            <div className="absolute top-2 right-2 py-2 px-4 bg-white rounded-lg">
                                                                <span className="text-md">{product?.price} kr</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Tab.Panel>
                            ))}
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            </div>
        </LandingLayout >
    )
}