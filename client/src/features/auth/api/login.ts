import { axios } from '../../../lib/axios';

import { UserResponse } from '../types';

export type LoginCredentialsDTO = {
    email: string;
    password: string;
};

type returnLoginCredentialsDTO = (
    data: LoginCredentialsDTO
) => Promise<UserResponse>

export const loginWithEmailAndPassword: returnLoginCredentialsDTO = (data) => {
    return axios.post('/auth/login', data);
};
