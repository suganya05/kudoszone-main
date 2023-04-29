import { Form, Formik } from "formik";
import React, { useState } from "react";

import "../CreatePage.scss";
import ImageDropper from "components/ImageDropper";
import { IImageFileProps } from "constants/types";
import { TextField } from "components";
import { createCollectionValidationSchema } from "helpers/validationSchema";

const initialValues = {
  contract_address: "",
  collection_name: "",
  instagram_url: "",
  linkedin_url: "",
  twitter_url: "",
  discord_url: "",
  telegram_url: "",
  total_supply: "",
  start_date: "",
  end_date: "",
};

const CollectionDrop: React.FC<{}> = () => {
  const [avatar, setAvatar] = useState<IImageFileProps | null>(null);
  const [banner, setBanner] = useState<IImageFileProps | null>(null);

  const handleSubmit = (values, actions) => {
    if (!avatar || !banner) return alert("upload images");
    console.log(values);
  };

  return (
    <div className="create-drop">
      <div className="mx pad">
        <div className="create-drop_form">
          <ImageDropper image={avatar} setImage={setAvatar} />
          <ImageDropper image={banner} setImage={setBanner} />
          <Formik
            initialValues={initialValues}
            validationSchema={createCollectionValidationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <div>
                  <TextField
                    name="contract_address"
                    label="Contract address"
                    placeholder="0xe05f...4e4b4f3"
                  />
                  <TextField
                    name="collection_name"
                    label="Collection name"
                    placeholder="kudoszone"
                  />
                  <TextField
                    name="total_supply"
                    label="Total supply"
                    placeholder="100"
                  />
                  <TextField
                    name="start_date"
                    label="Start date"
                    placeholder="25-1-2023"
                  />
                  <TextField
                    name="end_date"
                    label="End date"
                    placeholder="25-9-2023"
                  />
                  <TextField
                    name="instagram_url"
                    label=""
                    placeholder="https://www.instagram.com/abcdef"
                  />
                  <TextField
                    name="linkedin_url"
                    label=""
                    placeholder="https://www.linkedin.com/abcdef"
                  />
                  <TextField
                    name="twitter_url"
                    label=""
                    placeholder="https://www.twitter.com/abcdef"
                  />
                  <TextField
                    name="discord_url"
                    label=""
                    placeholder="https://discord.gg/abcdef"
                  />
                  <TextField
                    name="telegram_url"
                    label=""
                    placeholder="https://t.me/abcdef"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CollectionDrop;
