import { useMutation } from 'react-query';

import { axios } from '../../../lib/axios';
import { MutationConfig, queryClient } from '../../../lib/react-query';
import { useNotificationStore } from '../../../stores/notifications';
import { Photo } from '../types';

export type CreatePhotoDTO = {
    data: {
        imageUrl: string;
    };
};

export const createPhoto = ({ data }: CreatePhotoDTO): Promise<Photo> => {
    return axios.post(`/photos`, data);
};

type UseCreatePhotoOptions = {
    config?: MutationConfig<typeof createPhoto>;
};

export const useCreatePhoto = ({ config }: UseCreatePhotoOptions = {}) => {
    const { addNotification } = useNotificationStore();
    return useMutation({
        onMutate: async (newPhoto) => {
            await queryClient.cancelQueries('photos');

            const previousPhotos = queryClient.getQueryData<Photo[]>('photos');

            queryClient.setQueryData('photos', [...(previousPhotos || []), newPhoto.data]);

            return { previousPhotos };
        },
        onError: (_, __, context: any) => {
            if (context?.previousPhotos) {
                queryClient.setQueryData('photos', context.previousPhotos);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries('photos');
            addNotification({
                type: 'success',
                title: 'Photo Created',
            });
        },
        ...config,
        mutationFn: createPhoto,
    });
};
