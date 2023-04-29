import React, { useMemo, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useMoralis } from "react-moralis";

import { Button, Dropdown, Modal, ModalHeader, TextField } from "components";
import { useLockedBody, useTransactionModal } from "hooks";
import { IContractType, IUserNfts } from "constants/types";
import {
  createAuctionErc1155ValidationSchema,
  createAuctionValidationSchema,
  createFixedSaleErc1155ValidationSchema,
  createFixedSaleValidationSchema,
} from "helpers/validationSchema";
import { MINT_CONTRACT_ADDRESS } from "utils/address";
import { tokenAddresses } from "utils/tokenmethods";

const erc721AuctionInitialState = { bidPrice: "", days: "" };
const erc721FixedInitialState = { price: "" };
const erc1155AuctionInitialState = { bidPrice: "", days: "", amount: "" };
const erc1155FixedInitialState = { price: "", amount: "" };

const AuctionForm = ({
  handleCreateAuction,
  setTokenAddress,
  tokenAddress,
  contract_type,
}) => {
  return (
    <div className="profile_modal-form auction_sale">
      <Formik
        initialValues={
          contract_type === IContractType.ERC721
            ? erc721AuctionInitialState
            : erc1155AuctionInitialState
        }
        validationSchema={
          contract_type === IContractType.ERC721
            ? createAuctionValidationSchema
            : createAuctionErc1155ValidationSchema
        }
        onSubmit={handleCreateAuction}
      >
        {({ isValid }) => (
          <Form>
            <div className="form_controls flex-column g-15 mb-20">
              <div>
                <label htmlFor="bidPrice">Set Minimun Bid price</label>
                <div className="input_controls">
                  <Field id="bidPrice" name="bidPrice" placeholder="0" />
                  <Dropdown
                    list={tokenAddresses}
                    handleChange={(val) => setTokenAddress(val)}
                    className="profile_dropdown"
                  />
                </div>
                <ErrorMessage
                  name="bidPrice"
                  className="form_input-error "
                  component={"div"}
                />
              </div>
              <div className="mb-20">
                <TextField
                  name="days"
                  label="No of days on Auction"
                  placeholder="5 days"
                />
              </div>
            </div>
            <Button disabled={!isValid} type="submit">
              Put on Auction
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const CardModal: React.FC<
  IUserNfts & {
    isApproved: boolean;
    refetchApprove: () => Promise<void>;
  }
> = ({
  token_id,
  isApproved,
  refetchApprove,
  contract_type,
  amount,
  token_address,
}) => {
  const [saleModal, setSaleModal] = useState(false);
  const [modalStatus, setModalStatus] = useState("0");
  const handleCloseModal = () => setSaleModal(false);
  const [tokenAddress, setTokenAddress] = useState(tokenAddresses[0]);
  const { setTransaction } = useTransactionModal();
  const { setLocked } = useLockedBody();
  const { account, provider, chainId } = useMoralis();

  useMemo(() => {
    if (saleModal) return setLocked(true);
    setLocked(false);
  }, [setLocked, saleModal]);

  const handleApprove = async () => {
    try {
      setTransaction({ loading: true, status: "pending" });
      if (contract_type === IContractType.ERC721) {
        const { ApproveNFT } = await import("utils/methods");
        await ApproveNFT(account, provider, chainId, token_address);
      } else {
        const { ApproveNFTerc1155 } = await import("utils/methods");
        await ApproveNFTerc1155(account, provider, chainId, token_address);
      }
      refetchApprove();
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      console.log(error);
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handleCreateAuction = async (values) => {
    try {
      setModalStatus("0");
      setSaleModal(false);
      setTransaction({ loading: true, status: "pending" });
      if (contract_type === IContractType.ERC721) {
        const { createAuction } = await import("utils/marketplacemethods");
        await createAuction(
          account,
          provider,
          chainId,
          Number(token_id),
          Number(values.bidPrice),
          tokenAddress.value,
          values.days,
          MINT_CONTRACT_ADDRESS[chainId],
        );
      } else {
        const { createAuction1155 } = await import("utils/marketplacemethods");
        await createAuction1155(
          account,
          provider,
          chainId,
          Number(token_id),
          Number(values.amount),
          Number(values.bidPrice),
          tokenAddress.value,
          values.days,
        );
      }
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      console.log(error);
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handleCreateFixedSale = async (values) => {
    try {
      setModalStatus("0");
      setSaleModal(false);
      setTransaction({ loading: true, status: "pending" });
      if (contract_type === IContractType.ERC721) {
        const { createFixedSale } = await import("utils/marketplacemethods");
        await createFixedSale(
          account,
          provider,
          chainId,
          Number(token_id),
          Number(values.price),
          tokenAddress.value,
          MINT_CONTRACT_ADDRESS[chainId],
        );
      } else {
        const { createFixedSale1155 } = await import(
          "utils/marketplacemethods"
        );
        await createFixedSale1155(
          account,
          provider,
          chainId,
          Number(token_id),
          Number(values.price),
          tokenAddress.value,
          Number(values.amount),
        );
      }
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      console.log(error);
      setTransaction({ loading: true, status: "error" });
    }
  };

  const renderFixedSaleForm = (
    <div className="profile_modal-form fixed_sale">
      <Formik
        initialValues={
          contract_type === IContractType.ERC721
            ? erc721FixedInitialState
            : erc1155FixedInitialState
        }
        validationSchema={
          contract_type === IContractType.ERC721
            ? createFixedSaleValidationSchema
            : createFixedSaleErc1155ValidationSchema
        }
        onSubmit={handleCreateFixedSale}
      >
        {({ isValid }) => (
          <Form>
            <div className="flex-column g-15 mb-20">
              {contract_type === IContractType.ERC1155 && (
                <TextField
                  name="amount"
                  label={`Amount - you've ${amount}`}
                  placeholder="0"
                />
              )}
              <div className="form_controls">
                <label htmlFor="price">Set Buy Price</label>
                <div className="input_controls">
                  <Field id="price" name="price" placeholder="0" />
                  <Dropdown
                    list={tokenAddresses}
                    handleChange={(val) => setTokenAddress(val)}
                    className="profile_dropdown"
                  />
                </div>
                <ErrorMessage
                  name="price"
                  className="form_input-error "
                  component={"div"}
                />
              </div>
            </div>
            <Button disabled={!isValid} type="submit">
              Put on fixed sale
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );

  return (
    <div>
      {!isApproved ? (
        <Button onClick={() => handleApprove()}>Approve</Button>
      ) : (
        <Button onClick={() => setSaleModal(true)}>Sale</Button>
      )}

      <Modal isOpen={saleModal} handleClose={handleCloseModal}>
        <ModalHeader title="Put on sale" handleClose={handleCloseModal} />
        <section className="profile_modal">
          <div className="profile_nft-card_modal-controls">
            <Button
              variant={modalStatus === "1" ? "primary" : "primary-outline"}
              onClick={() => setModalStatus("1")}
            >
              sale on fixed sale
            </Button>
            <Button
              variant={modalStatus === "2" ? "primary" : "primary-outline"}
              onClick={() => setModalStatus("2")}
            >
              sale on auction
            </Button>
          </div>
          {
            {
              "1": renderFixedSaleForm,
              "2": (
                <AuctionForm
                  handleCreateAuction={handleCreateAuction}
                  tokenAddress={tokenAddress}
                  setTokenAddress={setTokenAddress}
                  contract_type={contract_type}
                />
              ),
            }[modalStatus]
          }
        </section>
      </Modal>
    </div>
  );
};

export default CardModal;
