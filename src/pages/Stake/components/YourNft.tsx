import React, { useState, useCallback, useEffect } from "react";
import { useMoralis, useNFTBalances } from "react-moralis";

import { IUserErc721Nfts } from "constants/types";
import {
  ApproveNFTOnStaking,
  getApprovedNFTOnStaking,
  stakeNFT,
} from "utils/stakingContract";
import { Button, LazyImage } from "components";
import { useTransactionModal } from "hooks";
import { sleep } from "constants/index";

const YourNft: React.FC<{
  contractaddress: string;
  address: string;
}> = ({ contractaddress, address }) => {
  const [selectedNft, setSelectedNft] = useState<string[]>([]);
  const [isApproved, setIsApproved] = useState(false);
  const { account, provider, chainId } = useMoralis();
  const { setTransaction } = useTransactionModal();
  const { data, isFetching, error, getNFTBalances } = useNFTBalances({
    address,
    token_addresses: [contractaddress],
  });
  const nftData = !data ? [] : (data?.result as IUserErc721Nfts[]);

  const handleGetIsApproved = useCallback(async () => {
    setIsApproved(
      await getApprovedNFTOnStaking(
        account,
        provider,
        chainId,
        contractaddress,
      ),
    );
  }, [account, provider, chainId, contractaddress]);

  useEffect(() => {
    handleGetIsApproved();
  }, [handleGetIsApproved]);

  const handleApprove = async () => {
    try {
      setTransaction({ loading: true, status: "pending" });
      await ApproveNFTOnStaking(account, provider, chainId, contractaddress);
      await sleep(1000);
      setIsApproved(
        await getApprovedNFTOnStaking(
          account,
          provider,
          chainId,
          contractaddress,
        ),
      );
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      console.log(error);
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handleStakeNfts = async () => {
    try {
      setTransaction({ loading: true, status: "pending" });
      await stakeNFT(account, provider, chainId, selectedNft);
      await sleep(1500);
      getNFTBalances();
      setSelectedNft([]);
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      console.log(error);
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handleSelectNft = (tokenId: string) => {
    if (selectedNft.some((id) => id === tokenId)) {
      return setSelectedNft([...selectedNft.filter((f) => f !== tokenId)]);
    }
    return setSelectedNft([...selectedNft, tokenId]);
  };

  if (isFetching) {
    return (
      <div
        className="fieldset_container"
        style={{ height: "100%", display: "grid", placeItems: "center" }}
      >
        loading...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="fieldset_container"
        style={{ height: "100%", display: "grid", placeItems: "center" }}
      >
        something went wrong
      </div>
    );
  }

  if (!nftData.length) {
    return (
      <div
        className="fieldset_container"
        style={{ height: "100%", display: "grid", placeItems: "center" }}
      >
        <p> No nfts on this collection</p>
      </div>
    );
  }

  return (
    <div className="fieldset_container">
      <div className="fieldset_container-card_wrapper">
        {nftData.map((nft, index) => (
          <div
            className={
              selectedNft.some((s) => s === nft.token_id)
                ? "card active"
                : "card"
            }
            onClick={() => handleSelectNft(nft.token_id)}
            key={index.toString()}
          >
            <LazyImage src={nft?.metadata?.image} />
            <h2>{nft.token_id}</h2>
          </div>
        ))}
      </div>
      <div className="flex-center">
        {!isApproved ? (
          <Button variant="ternary" onClick={handleApprove}>
            Approve all
          </Button>
        ) : (
          <Button
            disabled={!selectedNft.length}
            onClick={() => handleStakeNfts()}
          >
            Stake
          </Button>
        )}
      </div>
    </div>
  );
};

export default React.memo(YourNft);
