import { axios } from '../../../lib/axios';
import { SALTPAY_MERCHANTID, SALTPAY_SECRETKEY, NETIGRO_SECRETKEY, NETIGRO_APPLICATIONID, PEI_CLIENTID, PEI_SECRET } from '../../../config';

export const insertCart = (data: any) => {
    return axios.post(`/checkout/insertCart`, data);
};

export const getPhotos = () => {
    return axios.get(`/photos/getPhotos`);
}

export const checkCart = (data: any) => {
    return axios.post(`/checkout/checkCart`, data);
}

export const getSaltPayArgs = (data: any) => {
    const params = {
        merchant_id: SALTPAY_MERCHANTID,
        secret_key: SALTPAY_SECRETKEY,
        ...data,
    };
    return axios.get(`/checkout/get_saltpay_hash`, { params: params })
}

export const getNetgiroHash = (data: any) => {
    const params = {
        secret_key: NETIGRO_SECRETKEY,
        application_id: NETIGRO_APPLICATIONID,
        ...data,
    };
    return axios.get(`/checkout/get_netgiro_hash`, { params: params })
}
export const getPeiToken = () => {
    const params = {
        client_id: PEI_CLIENTID,
        secret: PEI_SECRET,
    };
    return axios.get(`/checkout/get_pei_token`, { params: params })
}

export const setOrders = (data: any) => {
    return axios.post(`/orders`, data);
}

export const sendPeiOrder = (data: any) => {
    return axios.post(`/checkout/get_pei_order`, { params: data })
}