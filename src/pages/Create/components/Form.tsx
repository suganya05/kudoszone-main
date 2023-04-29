import React, { useState } from "react";
import { Formik, Form as FormikForm, FieldArray } from "formik";

import { Button, Modal, ModalHeader, TextField } from "components";
import { IAttributes } from "constants/types";
import {
  validateMultiCollectionSchema,
  validateSingleCollectionSchema,
} from "helpers/validationSchema";
import { ReactComponent as Widget } from "assets/icons/widget.svg";
import { ReactComponent as Plus } from "assets/icons/plus.svg";
// import { ReactComponent as Calendar } from "assets/icons/calendar.svg";
// import { ReactComponent as Lock } from "assets/icons/lock-open.svg";
import PropertyTextField from "./PropertyTextField";
import { useMoralis } from "react-moralis";
import UnlockWallet from "components/UnlockWallet";

interface IForm {
  initialState: any;
  isMultiple: boolean;
  handleSubmit: (values: any, actions: any) => Promise<void>;
}

const Form: React.FC<IForm> = ({ initialState, isMultiple, handleSubmit }) => {
  const [addPropertyModal, setAddPropertyModal] = useState(false);
  const [attributes, setAttributes] = useState<IAttributes[]>([]);
  const { isAuthenticated } = useMoralis();
  // const [onSale, setOnSale] = useState(false);
  // const [fixedSale, setFixedSale] = useState(false);

  const handleSave = (attributes: IAttributes[]) => {
    setAddPropertyModal(false);
    setAttributes([
      ...attributes.filter((f) => f.trait_type !== "" && f.value !== ""),
    ]);
  };

  const onSubmit = async (values, actions) => {
    await handleSubmit(values, actions);
    setAttributes([]);
  };

  return (
    <Formik
      initialValues={initialState}
      validationSchema={
        isMultiple
          ? validateMultiCollectionSchema
          : validateSingleCollectionSchema
      }
      onSubmit={onSubmit}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <FormikForm>
          <div className="form_fields">
            <TextField name="name" label="Name" placeholder="Item Name" />
            <div>
              <TextField
                name="external_link"
                label="External link"
                placeholder="https://yoursite.io/item/123"
              />
              <p>
                KUDOSZONE will include a link to this URL on this item's detail
                page, so that users can click to learn more about it. You are
                welcome to link to your own webpage with more details.
              </p>
            </div>
            <TextField
              name="description"
              label="Description"
              as="textarea"
              rows="5"
              placeholder="Provide a detailed discription of your item."
            />
            {isMultiple && (
              <TextField
                name="totalSupply"
                label="Total Supply"
                type="number"
                placeholder="100"
              />
            )}
            <TextField
              name="royaltyFee"
              label="Royalty Fee"
              type="number"
              placeholder="0%,5%,10%"
            />
          </div>
          <div className="form_add-section">
            <div className="flex-between g-30">
              <div className="flex g-16">
                <Widget />
                <div>
                  <p className="font-regular">Properties</p>
                  <p>Textural traits that show up as rectangles.</p>
                </div>
              </div>
              <div>
                <button type="button" onClick={() => setAddPropertyModal(true)}>
                  <Plus />
                  <span>Add Properties</span>
                </button>
              </div>
            </div>
            <Modal
              isOpen={addPropertyModal}
              handleClose={() => setAddPropertyModal(false)}
            >
              <ModalHeader
                title="Add Properties"
                handleClose={() => setAddPropertyModal(false)}
                style={{ marginBottom: "8px" }}
              />
              <p className="mb-16">
                Properties show up underneath your item, are clickable, and can
                be filtered in your collection's sidebar
              </p>
              <section className="property_form">
                <FieldArray name="attributes">
                  {({ pop, push }) => (
                    <>
                      <div className="property_form-fields">
                        <div className="property_form-fields_wrapper">
                          {values.attributes.map((_, index) => (
                            <PropertyTextField
                              key={index.toString()}
                              typeName={`attributes[${index}].trait_type`}
                              valueName={`attributes[${index}].value`}
                              remove={index === 0 ? undefined : pop}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="property_form-controls">
                        <Button
                          onClick={() => push({ trait_type: "", value: "" })}
                        >
                          Add more
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleSave(values.attributes)}
                        >
                          Save
                        </Button>
                      </div>
                    </>
                  )}
                </FieldArray>
              </section>
            </Modal>
            {attributes.length > 0 && (
              <div className="attributes_list">
                {attributes.map((attribute, index) => (
                  <div key={index.toString()} className="attributes_list-card">
                    <p className="secondary font-regular">
                      {attribute.trait_type}
                    </p>
                    <b className="font-regular">{attribute.value}</b>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* <div className="form_sale">
            <div
              className={
                fixedSale ? "form_sale-card inactive" : "form_sale-card"
              }
            >
              <div className="flex-between g-30">
                <div className="flex g-16">
                  <Calendar />
                  <div>
                    <p className="font-regular">Put on sale</p>
                    <p>You'll receive bids on this item.</p>
                  </div>
                </div>
                <div
                  onClick={() => setOnSale((o) => !o)}
                  className={onSale ? "radio active" : "radio"}
                ></div>
              </div>
            </div>
            <div
              className={onSale ? "form_sale-card inactive" : "form_sale-card"}
            >
              <div className="flex-between g-30">
                <div className="flex g-16">
                  <Lock />
                  <div>
                    <p className="font-regular">Instant sale price</p>
                    <p>
                      Enter the price for which the item will be instantly sold.
                    </p>
                  </div>
                </div>
                <div
                  onClick={() => setFixedSale((f) => !f)}
                  className={fixedSale ? "radio active" : "radio"}
                ></div>
              </div>
            </div>
          </div> */}
          <div className="flex-center">
            {isAuthenticated ? (
              <Button disabled={isSubmitting} type="submit" variant="secondary">
                Create
              </Button>
            ) : (
              <UnlockWallet />
            )}
          </div>
        </FormikForm>
      )}
    </Formik>
  );
};

export default Form;
