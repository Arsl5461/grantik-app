import { LandingLayout } from '../../../components/Layout';
import { API_URL, SALTPAY_TESTMODE, SALTPAY_MERCHANTID, SALTPAY_PAYMENTGATEWAYID, NETIGRO_TESTMODE, NETIGRO_APPLICATIONID} from '../../../config';
import * as z from "zod";
import {
    Form,
    InputField,
} from "../../../components/Form";
import { getSaltPayArgs, getNetgiroHash, sendPeiOrder, setOrders } from '../api/checkout';
import { useState } from 'react';
import { Button } from '../../../components/Elements';
import { useNotificationStore } from '../../../stores/notifications';
import { Link } from 'react-router-dom';
import { useCheckoutStore } from '../../../stores/checkout';

type CheckoutValues = {
    payerId: string;
    contactName: string;
    contactSurename: string;
    address: string;
    regionNumber: string;
    country: string;
    city: string;
    phone: string;
    email: string;
    termsCondition: boolean;
}

const schema = z.object({
    termsCondition: z.literal(true),
    payerId: z.string().min(1, "This is Required"),
    contactName: z.string().min(1, "This is Required"),
    contactSurename: z.string().min(1, "This is Required"),
    address: z.string().min(1, "This is Required"),
    regionNumber: z.string().min(1, "This is Required"),
    country: z.string().min(1, "This is Required"),
    city: z.string().min(1, "This is Required"),
    phone: z.string().min(1, "This is Required"),
    email: z.string().nonempty('This is Required').email({ message: 'Must be a valid email' }),
});

export const Payment = () => {

    const [type, setType] = useState('salt')

    const { products } = useCheckoutStore();
    
    /*
    const products = [{
        "_id": "62c9795299c11390260da3ad",
        "detail": "1",
        "price": 100,
        "gltfUrl": "https://granitproducts.s3.amazonaws.com/scene.gltf",
        "imageUrl": "https://granitproducts.s3.amazonaws.com/2010.png",
        "name": "1",
        "__v": 0,
        "created_at": "2022-07-09T12:49:22.619Z",
        "type": "Legsteinn",
        "order": { "quantity": 2 }
    }];
    */
    
    // show payment response
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.payment_type) {
        const paymentType = params.payment_type;
        const paymentStatus = params.status;
        let notificationData = {
            type: "success",
            title: `${paymentType} ${paymentStatus}`,
            message: "",
        };
        switch (paymentStatus) {
            case "OK":
                if (paymentType === "SaltPay")
                    notificationData.message = `Order Id: ${params.orderid} \n Card Number: ${params.creditcardnumber} \n  Amount: ${params.amount} ${params.currency}`
                else if (paymentType === "Netgiro")
                    notificationData.message = `Order Id: ${params.orderid} \n Invoice Number: ${params.invoiceNumber} \n Amount: ${params.totalAmount} ISK`
                else notificationData.message = `Order Id: ${params.orderid}`;
                break;
            case "CANCEL":
                notificationData.type = "warning";
                if(paymentType !== "Pei"){
                    notificationData.message = `OrderId: ${params.orderid}`;
                }
                break;
            case "ERROR":
                notificationData.type = "error";
                notificationData.message = params.errordescription;
                break;
            default:
                break;
        }
        useNotificationStore.getState().addNotification({
            type: paymentStatus === "OK" ? "success" : paymentStatus === "CANCEL" ? "warning" : "error",
            title: notificationData.title,
            message: notificationData.message,
        });
        setTimeout(() => {
            window.history.pushState("", "checkout", "./../checkout")
        }, 1000);

    }


    const cartItems = products.reduce((arr, product) => {
        return [...arr, {
            productNo: product._id,
            name: product.name,
            description: product.detail,
            amount: product.price * product.order.quantity * 1000,
            quantity: product.order.quantity,
            unitPrice: product.price * 1000
        }]
    }, [])
    const total = products.reduce((sum, product) => {
        return sum + (product?.price * product?.order?.quantity * 1000)
    }, 0)

    const handlePayment = (e: any) => {
        setType(e.target.value);
    }
    const action = type === "salt" ? SALTPAY_TESTMODE === "1" ? 'https://test.borgun.is/SecurePay/default.aspx' : 'https://securepay.borgun.is/securepay/default.aspx' :
        type === "netgiro" ? NETIGRO_TESTMODE === "1" ? 'https://test.netgiro.is/securepay/' : 'https://securepay.netgiro.is/v1/' : "";
    const orderId = "ORDER" + Math.floor(Math.random() * 100000);

    //saltpay fields
    const saltpayReturnurlsuccess = `${API_URL}/checkout/saltpaySuccess`;
    const [saltpayFields, setSaltPayFields] = useState({
        merchantid: SALTPAY_MERCHANTID,
        paymentgatewayid: SALTPAY_PAYMENTGATEWAYID,
        checkhash: "",
        orderid: orderId,
        currency: "ISK",
        language: "IS",
        buyername: "",
        buyeremail: "",
        returnurlsuccess: saltpayReturnurlsuccess,
        returnurlsuccessserver: saltpayReturnurlsuccess,
        returnurlcancel: saltpayReturnurlsuccess,
        returnurlerror: saltpayReturnurlsuccess,
        amount: total,
    });


    //netigro fields
    const netigroPaymentUrl = `${API_URL}/checkout/netigroSuccess`;
    const [netgiroFields, setNetgiroFields] = useState({
        ApplicationID: NETIGRO_APPLICATIONID,
        Iframe: "false",
        PaymentSuccessfulURL: netigroPaymentUrl,
        PaymentCancelledURL: netigroPaymentUrl,
        ReferenceNumber: orderId,
        ConfirmationType: "0",
        TotalAmount: total,
        Signature: "",
    });


    return (
        <LandingLayout>
            <h1 className='text-center font-bold mt-16'>GREIÐSLUUPPLÝSINGAR</h1>
            <div className='max-w-7xl m-auto py-3 mt-10 grid sm:grid-cols-1 lg:grid-cols-2 gap-5'>
                <div>
                    <Form<CheckoutValues, typeof schema>
                        id="payment"
                        action={action}
                        onSubmit={async (values) => {
                            await setOrders({...values, amount: total, orderId: saltpayFields.orderid, products: products, paymentType: type})
                            switch (type) {
                                case "salt":
                                    try {
                                        const response = await getSaltPayArgs({ amount: total, order_id: saltpayFields.orderid, returnurlsuccess: saltpayReturnurlsuccess });
                                        setSaltPayFields({ ...saltpayFields, ...response, buyername: values.contactName, buyeremail: values.email });
                                        setTimeout(() => {
                                            document.forms[0].submit();
                                        }, 500);
                                    } catch (e) {
                                        console.log(e);
                                    }
                                    break;
                                case "netgiro":
                                    try {
                                        const response = await getNetgiroHash({ total: total, order_id: netgiroFields.ReferenceNumber });
                                        setNetgiroFields({ ...netgiroFields, ...response });
                                        // setTimeout(() => {
                                        //     document.forms[0].submit();
                                        // }, 500);
                                    } catch (e) {
                                        console.log(e);
                                    }
                                    break;
                                    
                                case "pei":
                                    try {
                                        const requestParams = {
                                            reference:saltpayFields.orderid,
                                            amount: total,
                                            buyer:{
                                                name:values.contactName,
                                                email:values.email,
                                                mobileNumber:values.phone,
                                            },
                                            items: cartItems.map((item) => {
                                                return {
                                                    name:item.name,
                                                    quantity: item.quantity,
                                                    unitPrice: item.unitPrice,
                                                    amount: item.amount,
                                                }
                                            }),
                                            other: products[0].order
                                        };
                                        const response = await sendPeiOrder(requestParams);
                                        if(response.data !== false){
                                            console.log('pei order success');
                                            window.location.href = response.data;
                                        }else{
                                            useNotificationStore.getState().addNotification({
                                                type: "error",
                                                title: "Pei Error",
                                                message: "Something goes wrong. Please fill correct info and try again.",
                                            });
                                        }
                                    } catch (e) {
                                        console.log(e);
                                    }
                                    break;
                            }

                        }}
                        options={{
                            defaultValues: {
                                country: 'Iceland'
                            },
                        }}
                        schema={schema}
                    >
                        {({ register, formState }) => (
                            <>
                                <InputField
                                    label="EIGINNAFN TENGILIÐS *"
                                    error={formState.errors["contactName"]}
                                    registration={register("contactName")}
                                />
                                <InputField
                                    label="EFTIRNAFN TENGILIÐS *"
                                    type="text"
                                    error={formState.errors["contactSurename"]}
                                    registration={register("contactSurename")}
                                />
                                <InputField
                                    label="NETFANG"
                                    type="text"
                                    error={formState.errors["email"]}
                                    registration={register("email")}
                                />
                                <div className="grid grid-cols-2 gap-5 sm:grid-cols-1 lg:grid-cols-2">
                                    <InputField
                                        label="KENNITALA GREIÐANDA (DÁNARBÚ, ÆTTINGI O.S.V.F)"
                                        type="text"
                                        error={formState.errors["payerId"]}
                                        registration={register("payerId")}
                                    />
                                    <InputField
                                        label="HEIMILISFANG"
                                        type="text"
                                        error={formState.errors["address"]}
                                        registration={register("address")}
                                    />
                                    <InputField
                                        label="PÓSTNÚMER"
                                        type="text"
                                        error={formState.errors["regionNumber"]}
                                        registration={register("regionNumber")}
                                    />
                                    <InputField
                                        label="LAND"
                                        type="text"
                                        disabled={true}
                                        error={formState.errors["country"]}
                                        registration={register("country")}
                                    />
                                    <InputField
                                        label="BORG / BÆR"
                                        type="text"
                                        error={formState.errors["city"]}
                                        registration={register("city")}
                                    />
                                    <InputField
                                        label="SÍMANÚMER"
                                        type="text"
                                        error={formState.errors["phone"]}
                                        registration={register("phone")}
                                    />
                                </div>
                                <input
                                    type="checkbox" {...register("termsCondition", { required: true })}
                                />
                                <label className={formState.errors["termsCondition"] && "text-sm font-semibold text-red-500"}>
                                    &nbsp;Ég hef kynnt mér <Link to="../terms-condition" className="font-medium text-blue-600 hover:text-blue-500">skilmála og vöruskila</Link>- eða afbókunarskilmála*
                                </label>
                                
                            {type === "salt" ?
                                <>
                                    {Object.entries(saltpayFields).map(([key, value]) => (
                                        <input type="hidden" name={key} value={value} key={key} readOnly />
                                    ))}
                                    {cartItems.map((item, key) => (
                                        <div key={key} className="invisible" hidden>
                                            <input type="hidden" name={`itemdescription_${key}`} value={item.name} readOnly />
                                            <input type="hidden" name={`itemcount_${key}`} value={item.quantity} readOnly />
                                            <input type="hidden" name={`itemunitamount_${key}`} value={item.amount} readOnly />
                                            <input type="hidden" name={`itemamount_${key}`} value={item.amount} readOnly />
                                        </div>
                                    ))}</> : null}
                            {type === "netgiro" ?
                                <>
                                    {Object.entries(netgiroFields).map(([key, value]) => (
                                        <input type="hidden" name={key} value={value} key={key} readOnly />
                                    ))}
                                    {cartItems.map((item, key) => (
                                        <div key={key} className="invisible" hidden>
                                            <input type="hidden" name={`Items${key}.ProductNo`} value={item.productNo} readOnly />
                                            <input type="hidden" name={`Items${key}.Name`} value={item.name} readOnly />
                                            <input type="hidden" name={`Items${key}.unitPrice`} value={item.unitPrice} readOnly />
                                            <input type="hidden" name={`Items${key}.Amount`} value={item.amount} readOnly />
                                            <input type="hidden" name={`Items${key}.Quantity`} value={item.quantity * 1000} readOnly />
                                        </div>
                                    ))}</> : null}
                            <br /><br /><br />
                            </>
                        )}
                    </Form>
                </div>
                <div>
                    <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 text-gray-800 font-light mb-6">
                        <div className="w-full p-3 border-b border-gray-200">
                            <div className="mb-5">
                                <label htmlFor="type1" className="flex items-center cursor-pointer">
                                    <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" value="salt" id="type1" onChange={handlePayment} checked={type === 'salt'} />
                                
                                    <img src="https://www.saltpay.is/lisalib/getfile.aspx?itemid=35c6bed6-c472-11eb-9120-005056bd7c94" className="h-6 ml-3" />
                                    <img src="https://www.saltpay.is/library/Myndir/Logo/kortalogo-lina@2x.png" className="h-6 ml-3" />
                                </label>
                            </div>
                        </div>
                        <div className="w-full p-3 border-b">
                            <label htmlFor="type2" className="flex items-center cursor-pointer">
                                <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" value="pei" id="type2" onChange={handlePayment} checked={type === 'pei'} />
                                < img src="https://memorial.is/wp-content/plugins/pei_woocommerce/pei_logo_small.png" width="80" className="ml-3" />
                            </label>
                        </div>
                        <div className="w-full p-3">
                            <label htmlFor="type2" className="flex items-center cursor-pointer">
                                <input type="radio" className="form-radio h-5 w-5 text-indigo-500" name="type" value="netgiro" id="type3" onChange={handlePayment} checked={type === 'netgiro'} />
                                <img src="https://memorial.is/wp-content/plugins/woocommerce_netgiro/logo_x25.png" width="150" className="ml-5" />
                            </label>
                        </div>
                        <Button
                            type="submit"
                            form="payment"
                            className="mt-6 w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            GREIÐA
                        </Button>
                    </div>
                </div>
            </div>
        </LandingLayout >
    )
}