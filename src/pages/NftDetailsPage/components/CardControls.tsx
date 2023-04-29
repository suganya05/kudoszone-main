import React, { Fragment, useState } from "react";
import { useMoralis } from "react-moralis";
import { Form, Formik } from "formik";
import Countdown from "react-countdown";

import { Button, Modal, TextField } from "components";
import UnlockWallet from "components/UnlockWallet";
import { IAuctionInfo, IContractType, ISaleType } from "constants/types";
import {
  useGetUser,
  useLockedBody,
  useTransactionModal,
  useUpdateEffect,
} from "hooks";
import { n4 } from "helpers/formatters";
import { placeBidValidationSchema } from "helpers/validationSchema";

interface ICardControls extends IAuctionInfo {
  refetch: () => Promise<void>;
}

const CardControls: React.FC<ICardControls> = ({
  owner,
  tokenAddress,
  contractType,
  saleType,
  end,
  heighestBid,
  symbol,
  auctionId,
  refetch,
  heighestBidder,
}) => {
  const { isAuthenticated, account, provider, chainId } = useMoralis();
  const { setTransaction, loading } = useTransactionModal();
  const [openBidModal, setOpenBidModal] = useState(false);
  const { setLocked } = useLockedBody();
  const isOwner = account.toLocaleLowerCase() === owner.toLocaleLowerCase();
  const { data } = useGetUser();
  const currentToken = data.tokens.find(
    (f) =>
      f.tokenAddress.toLocaleLowerCase() === tokenAddress.toLocaleLowerCase(),
  );
  const currentTokenIsApproved =
    contractType === IContractType.ERC721
      ? currentToken?.isErc721Approved
      : currentToken?.isErc1155Approved;

  useUpdateEffect(() => {
    if (openBidModal) return setLocked(true);
    setLocked(false);
  }, [openBidModal]);

  const handleCloseBidModal = () => setOpenBidModal(false);

  const handleApprove = async () => {
    try {
      setTransaction({ loading: true, status: "pending" });
      if (contractType === IContractType.ERC721) {
        const { increaseAllowance } = await import("utils/tokenmethods");
        await increaseAllowance(account, provider, chainId, tokenAddress);
      } else {
        const { increaseAllowanceErc1155 } = await import("utils/tokenmethods");
        await increaseAllowanceErc1155(
          account,
          provider,
          chainId,
          tokenAddress,
        );
      }
      setTransaction({ loading: true, status: "success" });
      setTimeout(() => window.location.reload(), 2000);
    } catch (error) {
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handleFinishFixedSale = async () => {
    try {
      if (currentToken.balance < heighestBid) {
        return setTransaction({
          loading: true,
          status: "error",
          message: "Insufficient balance to Buy this NFT",
        });
      }
      setTransaction({ loading: true, status: "pending" });
      if (contractType === IContractType.ERC721) {
        const { finishFixedSale } = await import("utils/marketplacemethods");
        await finishFixedSale(account, provider, chainId, Number(auctionId));
      } else {
        const { finishFixedSaleErc1155 } = await import(
          "utils/marketplacemethods"
        );
        await finishFixedSaleErc1155(
          account,
          provider,
          chainId,
          Number(auctionId),
        );
      }
      refetch();
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handlePlaceBid = async (values, actions) => {
    try {
      handleCloseBidModal();
      if (Number(values.price) > currentToken.balance) {
        return setTransaction({
          loading: true,
          status: "error",
          message: "Insufficient balance to Bid",
        });
      }
      setTransaction({ loading: true, status: "pending" });
      if (contractType === IContractType.ERC721) {
        const { placeBid } = await import("utils/marketplacemethods");
        await placeBid(
          account,
          provider,
          chainId,
          Number(auctionId),
          values.price,
        );
      } else {
        const { placeBid1155 } = await import("utils/marketplacemethods");
        await placeBid1155(
          account,
          provider,
          chainId,
          Number(auctionId),
          values.price,
        );
      }
      refetch();
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handleRemoveAuction = async () => {
    try {
      setTransaction({ loading: true, status: "pending" });
      if (contractType === IContractType.ERC721) {
        const { removeSale } = await import("utils/marketplacemethods");
        await removeSale(account, provider, chainId, Number(auctionId));
      } else {
        const { removeSaleerc1155 } = await import("utils/marketplacemethods");
        await removeSaleerc1155(account, provider, chainId, Number(auctionId));
      }
      refetch();
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handleFinishAuction = async () => {
    try {
      setTransaction({ loading: true, status: "pending" });
      if (contractType === IContractType.ERC721) {
        const { finishAuction } = await import("utils/marketplacemethods");
        await finishAuction(account, provider, chainId, Number(auctionId));
      } else {
        const { finishAuctionerc1155 } = await import(
          "utils/marketplacemethods"
        );
        await finishAuctionerc1155(
          account,
          provider,
          chainId,
          Number(auctionId),
        );
      }
      refetch();
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      setTransaction({ loading: true, status: "error" });
    }
  };

  const renderControls = (
    <>
      {saleType === ISaleType.AUCTION ? (
        <Countdown
          date={end}
          renderer={({ completed }) => {
            if (completed)
              return (
                <div>
                  <p style={{ fontSize: "2rem" }}>
                    Reserved Price{" "}
                    <strong style={{ fontSize: "inherit" }}>
                      {n4.format(heighestBid)}&nbsp;{symbol}
                    </strong>
                  </p>
                </div>
              );
            else
              return (
                <Button onClick={() => setOpenBidModal(true)}>
                  Place a Bid
                </Button>
              );
          }}
        />
      ) : (
        <Button disabled={loading} onClick={() => handleFinishFixedSale()}>
          Buy Now
        </Button>
      )}
    </>
  );

  const renderOwnerControls = (
    <Countdown
      date={end}
      renderer={({ completed }) => {
        if (completed)
          return (
            <>
              {owner.toLocaleLowerCase() ===
              heighestBidder.toLocaleLowerCase() ? (
                <Button onClick={() => handleRemoveAuction()}>
                  remove from sale
                </Button>
              ) : (
                <Button onClick={() => handleFinishAuction()}>
                  Finish auction
                </Button>
              )}
            </>
          );
        else
          return (
            <Button onClick={() => handleRemoveAuction()}>
              remove from sale
            </Button>
          );
      }}
    />
  );

  return (
    <Fragment>
      {isAuthenticated ? (
        isOwner ? (
          saleType === ISaleType.AUCTION ? (
            renderOwnerControls
          ) : (
            <p style={{ fontSize: "2rem" }}>
              Reserved Price{" "}
              <strong style={{ fontSize: "inherit" }}>
                {n4.format(heighestBid)}&nbsp;{symbol}
              </strong>
            </p>
          )
        ) : currentTokenIsApproved ? (
          renderControls
        ) : (
          <Button onClick={() => handleApprove()}>Approve</Button>
        )
      ) : (
        <UnlockWallet />
      )}
      <Modal isOpen={openBidModal} handleClose={handleCloseBidModal}>
        <div className="flex-between mb-20">
          <p>Current NFT Price</p>
          <b>
            {n4.format(heighestBid)}&nbsp;{symbol}
          </b>
        </div>
        <Formik
          initialValues={{ price: "" }}
          validationSchema={() => placeBidValidationSchema(heighestBid)}
          onSubmit={handlePlaceBid}
        >
          {() => (
            <Form>
              <div className="mb-10">
                <TextField
                  type="number"
                  name="price"
                  label="Enter your bid Price"
                  placeholder={`0.1 ${symbol}`}
                />
              </div>
              <Button
                type="submit"
                style={{ width: "100%", borderRadius: "5px" }}
              >
                Place bid
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </Fragment>
  );
};

export default CardControls;
