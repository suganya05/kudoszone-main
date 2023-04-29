import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useMoralis, useMoralisFile } from "react-moralis";

import "../CreatePage.scss";
import ImageDropper from "components/ImageDropper";
import { IImageFileProps } from "constants/types";
import { Button, TextField } from "components";
import { createDropValidationSchema } from "helpers/validationSchema";
import UnlockWallet from "components/UnlockWallet";
import { useTransactionModal } from "hooks";
import { createDrop } from "api";
import { formatLinks } from "helpers/formatters";
import { useNavigate } from "react-router-dom";
import FileDropper from "components/ImageDropper/FileDropper";

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
  abi: "",
  username: "",
  description: "",
};

const CreateDrop: React.FC<{}> = () => {
  const [avatar, setAvatar] = useState<IImageFileProps | null>(null);
  const [banner, setBanner] = useState<IImageFileProps | null>(null);
  const [abiFile, setAbiFile] = useState<any>(null);
  const { isAuthenticated } = useMoralis();
  const { saveFile } = useMoralisFile();
  const { setTransaction } = useTransactionModal();
  const navigate = useNavigate();

  const handleSubmit = async (values, actions) => {
    if (!avatar || !banner) return alert("upload images");
    if (!abiFile) return alert("upload ABI file");
    try {
      setTransaction({ loading: true, status: "pending" });
      const avatarFile = avatar.file;
      const avatarimageFileIpfs = await saveFile(avatarFile.name, avatarFile, {
        saveIPFS: true,
      });
      const avatarCid: any = avatarimageFileIpfs.toJSON();

      const bannerfile = banner.file;
      const imageFileIpfs = await saveFile(bannerfile.name, bannerfile, {
        saveIPFS: true,
      });
      const bannerCid: any = imageFileIpfs.toJSON();

      const formValues = {
        ...values,
        start_date: new Date(values.start_date).toISOString(),
        end_date: new Date(values.end_date).toISOString(),
        avatar: avatarCid.ipfs,
        banner: bannerCid.ipfs,
        collection_slug: formatLinks(values.collection_name),
        abi: abiFile.url,
      };
      await createDrop(formValues);
      setAvatar(null);
      setBanner(null);
      setAbiFile(null);
      navigate("/drops");
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      console.log(error);
      setTransaction({ loading: true, status: "error" });
    }
  };

  const renderAvatarContent = (
    <>
      <h3 className="mb-16">Avatar</h3>
      <p className="mb-8">
        File types supported{" "}
        <span className="font-regular">JPG, PNG, GIF, SVG,WEBP</span>
      </p>
      <p>
        Max size: <span className="font-regular">10MB</span>
      </p>
    </>
  );

  const renderBannerContent = (
    <>
      <h3 className="mb-16">Banner</h3>
      <p className="mb-8">
        File types supported{" "}
        <span className="font-regular">JPG, PNG, GIF, SVG,WEBP</span>
      </p>
      <p>
        Max size: <span className="font-regular">10MB</span>
      </p>
    </>
  );

  return (
    <div className="create-drop">
      <div className="mx pad">
        <div className="flex-center g-10">
          <h2>Create</h2>
          <h2 className="primary">DROP</h2>
        </div>
        <div className="create-drop_form">
          <ImageDropper
            image={avatar}
            setImage={setAvatar}
            content={renderAvatarContent}
            className="avatar"
          />
          <ImageDropper
            image={banner}
            setImage={setBanner}
            content={renderBannerContent}
            className="banner"
          />
          <Formik
            initialValues={initialValues}
            validationSchema={createDropValidationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form>
                <div className="form_controls">
                  <TextField
                    name="collection_name"
                    label="Collection name"
                    placeholder="kudoszone"
                  />
                  <TextField
                    name="contract_address"
                    label="Contract address"
                    placeholder="0xe05f...4e4b4f3"
                  />
                  <TextField
                    name="username"
                    label="Organization name or Username"
                    placeholder="Kudo"
                  />
                  <TextField
                    name="description"
                    label="Description"
                    placeholder="tell us about your collection"
                    as="textarea"
                  />
                  <TextField
                    name="total_supply"
                    label="Total supply"
                    placeholder="100"
                    type="number"
                  />
                  <TextField
                    name="start_date"
                    label="Start date"
                    placeholder="25-1-2023"
                    type="date"
                  />
                  <TextField
                    name="end_date"
                    label="End date"
                    placeholder="25-9-2023"
                    type="date"
                  />
                  <FileDropper
                    image={abiFile}
                    setImage={setAbiFile}
                    className="abifile"
                  />
                  <div>
                    <label
                      className="font-regular"
                      style={{ fontSize: "1.6rem" }}
                    >
                      Social links
                    </label>
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
                </div>
                <div className="controls">
                  {isAuthenticated ? (
                    <Button type="submit">Create Drop</Button>
                  ) : (
                    <UnlockWallet />
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateDrop;
