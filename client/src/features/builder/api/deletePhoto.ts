import { useMutation } from 'react-query';

import { axios } from '../../../lib/axios';
import { MutationConfig, queryClient } from '../../../lib/react-query';
import { useNotificationStore } from '../../../stores/notifications';

import { Photo } from '../types';

export const deletePhoto = ({ photoId }: { photoId: string }) => {
  return axios.delete(`/photos/${photoId}`);
};

type UseDeletePhotoOptions = {
  config?: MutationConfig<typeof deletePhoto>;
};

export const useDeletePhoto = ({ config }: UseDeletePhotoOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    onMutate: async (deletedPhoto) => {
      await queryClient.cancelQueries('photos');

      const previousPhotos = queryClient.getQueryData<Photo[]>('photos');

      queryClient.setQueryData(
        'photos',
        previousPhotos?.filter(
          (photo) => photo._id !== deletedPhoto.photoId
        )
      );

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
        title: 'Photo Deleted',
      });
    },
    ...config,
    mutationFn: deletePhoto,
  });
};
