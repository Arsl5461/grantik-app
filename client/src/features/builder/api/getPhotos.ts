import { useQuery } from 'react-query';

import { axios } from '../../../lib/axios';
import { ExtractFnReturnType, QueryConfig } from '../../../lib/react-query';

import { Photo } from '../types';

export const getPhotos = (): Promise<Photo[]> => {
    return axios.get('/photos');
};

type QueryFnType = typeof getPhotos;

type UsePhotosOptions = {
    config?: QueryConfig<QueryFnType>;
};

export const usePhotos = ({ config }: UsePhotosOptions = {}) => {
    return useQuery<ExtractFnReturnType<QueryFnType>>({
        ...config,
        queryKey: ['photos'],
        queryFn: () => getPhotos(),
    });
};
