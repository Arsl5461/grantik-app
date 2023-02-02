import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/solid';
import * as z from 'zod';

import { Button } from '../../../components/Elements';
import { Form, FormDrawer, InputField, SelectField, TextAreaField } from '../../../components/Form';
import { Authorization, ROLES } from '../../../lib/authorization';
import { UploadField } from "../../../components/Form/UploadField";

import { useProduct } from '../api/getProduct';
import { UpdateProductDTO, useUpdateProduct } from '../api/updateproduct';

type UpdateProductProps = {
  productId: string;
};

const schema = z.object({
  name: z.string().min(1, "This is Required"),
  price: z.string().min(1, "This is Required"),
  type: z.string(),
  detail: z.string().min(1, "This is Required"),
  description: z.string(),
});

export const UpdateProduct = ({ productId }: UpdateProductProps) => {
  const productQuery = useProduct({ productId });
  const updateProductMutation = useUpdateProduct();
  const [imageUrl, setImageUrl] = useState(productQuery.data.imageUrl)
  const [gltf, setGltf] = useState(productQuery.data.gltfUrl)
  const options = [
    { label: "Legsteinn", value: "Legsteinn" },
    { label: "Leiðisrammi", value: "Leiðisrammi" },
    { label: "Skreytingar og fuglar", value: "Vasi" },
    { label: "Vasar og luktir", value: "Lukt" },
  ];

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>
      <FormDrawer
        isDone={updateProductMutation.isSuccess}
        triggerButton={
          <Button startIcon={<PencilIcon className="h-4 w-4" />} size="sm">
            Uppfæra vöru
          </Button>
        }
        title="Uppfæra vöru"
        submitButton={
          <Button
            form="update-product"
            type="submit"
            size="sm"
            isLoading={updateProductMutation.isLoading}
          >
            Staðfesta
          </Button>
        }
      >
        <Form<UpdateProductDTO['data'], typeof schema>
          id="update-product"
          onSubmit={async (values) => {
            if (imageUrl) {
              values.image = imageUrl;
              values.gltf = gltf;
              await updateProductMutation.mutateAsync({ data: values, productId });
            }
          }}
          options={{
            defaultValues: {
              name: productQuery.data?.name,
              type: productQuery.data?.type,
              price: productQuery.data?.price,
              description: productQuery.data?.description,
              detail: productQuery.data?.detail
            },
          }}
          schema={schema}
        >
          {({ register, formState }) => (
            <>
              <InputField
                label="Tegund"
                error={formState.errors["name"]}
                registration={register("name")}
              />
              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Tegund"
                  options={options}
                  error={formState.errors["type"]}
                  registration={register("type")}
                />
                <InputField
                  label="Verð"
                  error={formState.errors["price"]}
                  registration={register("price")}
                />
                <UploadField
                  label='Mynd af vöru'
                  extentions={"image/jpg, image/png"}
                  url={imageUrl}
                  setUrl={setImageUrl}
                  registration={undefined}
                />
                <UploadField
                  label='3d módel'
                  extentions={'.gltf'}
                  url={gltf}
                  setUrl={setGltf}
                  registration={undefined}
                />
              </div>
              <TextAreaField
                label="Upplýsingar"
                className="h-44"
                error={formState.errors['detail']}
                registration={register('detail')}
              />
              <TextAreaField
                label="Lýsing"
                className="h-44"
                error={formState.errors['description']}
                registration={register('description')}
              />
            </>
          )}
        </Form>
      </FormDrawer>
    </Authorization>
  );
};
