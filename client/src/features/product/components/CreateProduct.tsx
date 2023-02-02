import { PlusIcon } from "@heroicons/react/outline";
import { useState } from "react";
import * as z from "zod";

import { Button } from "../../../components/Elements";
import {
  Form,
  FormDrawer,
  InputField,
  SelectField,
  TextAreaField,
} from "../../../components/Form";
import { UploadField } from "../../../components/Form/UploadField";
import { Authorization, ROLES } from "../../../lib/authorization";

import { CreateProductDTO, useCreateProduct } from "../api/createProduct";

const schema = z.object({
  name: z.string().min(1, "This is Required"),
  price: z.string().min(1, "This is Required"),
  type: z.string(),
  detail: z.string().min(1, "This is Required"),
  description: z.string()
});

export const CreateProduct = () => {
  const createProductMutation = useCreateProduct();
  const [imageUrl, setImageUrl] = useState('')
  const [gltf, setGltf] = useState('')
  const options = [
    { label: "Legsteinn", value: "Legsteinn" },
    { label: "Leiðisrammi", value: "Leiðisrammi" },
    { label: "Skreytingar og fuglar", value: "Vasi" },
    { label: "Vasar og luktir", value: "Lukt" },
  ];

  return (
    <Authorization allowedRoles={[ROLES.ADMIN]}>    
      <FormDrawer
        isDone={createProductMutation.isSuccess}
        triggerButton={
          <Button size="sm" startIcon={<PlusIcon className="h-4 w-4" />}>
            Bæta við vöru
          </Button>
        }
        title="Bæta við vöru"
        submitButton={
          <Button
            form="create-product"
            type="submit"
            size="sm"
            isLoading={createProductMutation.isLoading}
          >
            Submit
          </Button>
        }
      >
        <Form<CreateProductDTO["data"], typeof schema>
          id="create-product"
          onSubmit={async (values) => {
            if (imageUrl) {
              values.image = imageUrl;
              values.gltf = gltf;
              await createProductMutation.mutateAsync({ data: values });
            }
          }}
          schema={schema}
        >
          {({ register, formState }) => (
            <>
              <InputField
                label="Titill"
                error={formState.errors["name"]}
                registration={register("name")}
              />
              <div className="grid grid-cols-2 gap-3">
                <SelectField
                  label="Tegund"
                  options={options}
                  defaultValue="Stones"
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
