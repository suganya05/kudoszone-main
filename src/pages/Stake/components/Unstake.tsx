import React, { useState } from "react";
import { useMoralis } from "react-moralis";

import { Button, LazyImage } from "components";
import { withdrawNFT } from "utils/stakingContract";
import { useTransactionModal } from "hooks";
import { sleep } from "constants/index";
import { IStakedNft } from "./StakingCard";

interface ISelectedNft {
  stakeId: string;
  tokenIds: string[];
  totalTokenIds: string[];
}

interface IUnstakeProps {
  stakedNfts: IStakedNft[];
  handleGetStakedData: () => Promise<void>;
  contractaddress: string;
  loading: boolean;
}

const Unstake: React.FC<IUnstakeProps> = ({
  stakedNfts,
  handleGetStakedData,
  contractaddress,
  loading,
}) => {
  const { account, provider, chainId } = useMoralis();
  const [selectedNft, setSelectedNft] = useState<ISelectedNft | null>(null);
  const { setTransaction } = useTransactionModal();

  const handleWithdraw = async () => {
    try {
      let filteredTokenIds: string[] = [];
      selectedNft.tokenIds.forEach((id) => {
        filteredTokenIds = [
          ...selectedNft.totalTokenIds.filter((f) => f !== id),
        ];
      });
      console.log(filteredTokenIds);
      setTransaction({ loading: true, status: "pending" });
      await withdrawNFT(
        account,
        provider,
        chainId,
        selectedNft.stakeId,
        filteredTokenIds,
        selectedNft.tokenIds,
      );
      await sleep(1000);
      handleGetStakedData();
      setSelectedNft(null);
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      console.log(error);
      setTransaction({ loading: true, status: "error" });
    }
  };

  const handleSelect = (
    stakeId: string,
    tokenId: string,
    totalTokenIds: string[],
  ) => {
    if (!selectedNft) {
      setSelectedNft({ stakeId, tokenIds: [tokenId], totalTokenIds });
      return;
    }
    if (selectedNft.tokenIds.some((s) => s === tokenId)) {
      const filterData = selectedNft.tokenIds.filter((f) => f !== tokenId);
      if (!filterData.length) return setSelectedNft(null);
      setSelectedNft({
        ...selectedNft,
        tokenIds: [...filterData],
      });
      return;
    }
    setSelectedNft({
      ...selectedNft,
      tokenIds: [...selectedNft.tokenIds, tokenId],
    });
  };

  if (loading) {
    return (
      <div
        className="fieldset_container"
        style={{ height: "100%", display: "grid", placeItems: "center" }}
      >
        <p>Loading...</p>
      </div>
    );
  }

  if (!stakedNfts.length) {
    return (
      <div
        className="fieldset_container"
        style={{ height: "100%", display: "grid", placeItems: "center" }}
      >
        <p> No nfts is staked</p>
      </div>
    );
  }

  return (
    <div className="fieldset_container">
      <div className="staked_nft_wrapper">
        {stakedNfts.map((nft) => (
          <div
            key={nft.startblock}
            className={
              selectedNft === null
                ? "staked_nft-card"
                : selectedNft.stakeId === nft.stakeId
                ? "staked_nft-card active"
                : "staked_nft-card inactive"
            }
          >
            <div className="staked_nft-card_wrapper">
              {nft.tokenData.map((data, i) => (
                <div
                  key={i.toString()}
                  className={
                    selectedNft?.tokenIds.some((s) => s === data.tokenId)
                      ? "card active"
                      : "card"
                  }
                  onClick={() =>
                    handleSelect(nft.stakeId, data.tokenId, nft.tokenIds)
                  }
                >
                  <LazyImage src={data.image} />
                  <h2>{data.tokenId}</h2>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-center">
        {!selectedNft ? (
          <Button
            variant="ternary"
            disabled={!selectedNft}
            onClick={() => handleWithdraw()}
          >
            Unstake
          </Button>
        ) : (
          <Button
            variant="secondary"
            disabled={!selectedNft}
            onClick={() => handleWithdraw()}
          >
            Unstake
          </Button>
        )}
      </div>
    </div>
  );
};

export default Unstake;
