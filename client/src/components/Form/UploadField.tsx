import { uploadFile } from "react-s3";
import { UseFormRegisterReturn } from "react-hook-form";
import { S3_BUCKET, REGION, ACCESS_KEY, SECRET_ACCESS_KEY } from "../../config";
import { FieldWrapper, FieldWrapperPassThroughProps } from "./FieldWrapper";
import upload from '../../assets/images/upload.png'
import { Buffer } from 'buffer';

// @ts-ignore
window.Buffer = Buffer;

type UploadFieldProps = FieldWrapperPassThroughProps & {
  className?: string;
  url: string;
  extentions: string;
  setUrl: any;
  registration: Partial<UseFormRegisterReturn>;
};

const config = {
  bucketName: S3_BUCKET,
  region: REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCESS_KEY,
};

export const UploadField = (props: UploadFieldProps) => {
  const { label, error, url, setUrl, extentions } = props;

  const handleFiles = (e: any) => {
    uploadFile(e.target.files[0], config)
      .then((data: any) => setUrl(data.location))
      .catch((error: any) => console.log(error));
  };

  return (
    <FieldWrapper label={label} error={error}>
      <div className="border-2" style={{ height: "150px" }}>
        <img src={url ? url : upload} width="100%" style={{ height: '150px' }} alt={label} />
      </div>
      <input type="file" onChange={handleFiles} accept={extentions} hidden />
    </FieldWrapper>
  );
};
