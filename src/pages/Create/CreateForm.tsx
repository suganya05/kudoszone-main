import React, { useState } from "react";
import { useMoralis, useMoralisFile } from "react-moralis";

import "./CreateForm.scss";
import { ICreateForm, IImageFileProps } from "constants/types";
import { getFormattedFormValues } from "helpers/formatters";
import { useTransactionModal } from "hooks";
import Form from "./components/Form";
import ImageDropper from "components/ImageDropper";

const initialState: ICreateForm = {
  name: "",
  image: "",
  description: "",
  external_link: "",
  royaltyFee: "",
  totalSupply: "",
  isMultiple: false,
  attributes: [{ trait_type: "", value: "" }],
};

const CreateForm: React.FC<{}> = () => {
  const { provider, chainId, account } = useMoralis();
  const [image, setImage] = useState<IImageFileProps | null>(null);
  const { saveFile } = useMoralisFile();
  const [isMultiple, setIsMultiple] = useState(false);
  const { setTransaction } = useTransactionModal();

  const handleSubmit = async (values: ICreateForm, actions) => {
    if (!image) return alert("upload image to mint.");
    try {
      setTransaction({ loading: true, status: "pending" });
      const file = image.file;
      const imageFileIpfs = await saveFile(file.name, file, { saveIPFS: true });
      const imageCid: any = imageFileIpfs.toJSON();

      const formValues = {
        ...getFormattedFormValues(values),
        image: imageCid.ipfs,
      };

      const fileIpfs = await saveFile(
        "metadata.json",
        {
          base64: btoa(JSON.stringify(formValues)),
        },
        { saveIPFS: true },
      );
      const fileCid: any = fileIpfs.toJSON();
      console.log(fileCid.hash);
      console.log(fileCid.ipfs);
      if (isMultiple) {
        console.log("multiple");
        const { createCollectible1155 } = await import("utils/methods");
        await createCollectible1155(
          account,
          provider,
          chainId,
          fileCid.hash,
          Number(values.totalSupply),
          values.royaltyFee,
        );
        actions.resetForm();
        actions.setSubmitting(false);
        setImage(null);
        setTransaction({ loading: true, status: "success" });
        return;
      }
      console.log("single");
      const { createCollectible } = await import("utils/methods");
      await createCollectible(
        account,
        provider,
        chainId,
        fileCid.hash,
        values.royaltyFee,
      );
      actions.resetForm();
      actions.setSubmitting(false);
      setImage(null);
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      console.log(error);
      setTransaction({ loading: true, status: "error" });
    }
  };

  const renderType = (
    <div className="create_form-types">
      <div>
        <button
          onClick={() => setIsMultiple(false)}
          className={!isMultiple ? "active" : undefined}
        >
          Single
        </button>
        <button
          onClick={() => setIsMultiple(true)}
          className={isMultiple ? "active" : undefined}
        >
          Multiple
        </button>
      </div>
    </div>
  );

  const renderImageContent = (
    <>
      <div className="flex mb-16">
        <h2>Create your</h2>
        <h2 className="primary ml-10 font-regular">NFTs</h2>
      </div>
      <p className="font-regular mb-8">Image, Video, Audio, or 3D Model</p>
      <p className="mb-8">
        File types supported{" "}
        <span className="font-regular">
          JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV, OGG, GLB, GLTF.
        </span>
      </p>
      <p>
        Max size: <span className="font-regular">100MB</span>
      </p>
    </>
  );

  return (
    <div className="create_form">
      <ImageDropper
        image={image}
        setImage={setImage}
        content={renderImageContent}
      />
      {renderType}
      <Form
        initialState={initialState}
        isMultiple={isMultiple}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default CreateForm;
