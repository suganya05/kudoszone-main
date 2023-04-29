import React, { useCallback, useEffect, useState } from "react";
import millify from "millify";
import Skeleton from "react-loading-skeleton";
import { useMoralis } from "react-moralis";
import { motion, AnimatePresence } from "framer-motion";

import { ReactComponent as ExternalLink } from "assets/icons/external-link.svg";
import avatar from "assets/abstracts/card.png";
import { Button } from "components";
import YourNft from "./YourNft";
import Unstake from "./Unstake";
import { blockExplorer } from "constants/index";
import {
  getStakingContractDetails,
  getUserStakedNfts,
} from "utils/stakingContract";
import { n4 } from "helpers/formatters";
import { Link } from "react-router-dom";
import { ITokenUri } from "constants/types";
import { useTransactionModal } from "hooks";

interface IStakingCardProps {
  contractaddress: string;
  address: string;
}

interface IContractData {
  totalStaked: number;
  rewardPerBlock: number;
}

interface ITokenData extends ITokenUri {
  tokenId: string;
}

export interface IStakedNft {
  tokenData: ITokenData[];
  tokenIds: string[];
  startblock: number;
  status: string;
  stakeId: string;
}

const StakingCard: React.FC<IStakingCardProps> = ({
  contractaddress,
  address,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { account, provider, chainId, Moralis } = useMoralis();
  const [contractData, setContractData] = useState<IContractData | null>(null);
  const [stakedNfts, setStakedNfts] = useState<IStakedNft[]>([]);
  const [rewardsEarned, setRewardsEarned] = useState(0);
  const { setTransaction } = useTransactionModal();
  const [loading, setLoading] = useState(false);

  const handleGetContractData = useCallback(async () => {
    if (account && provider) {
      setContractData(
        await getStakingContractDetails(account, provider, chainId),
      );
    }
  }, [account, provider, chainId]);

  const hanldeGetStakedData = useCallback(async () => {
    if (account && provider) {
      setLoading(true);
      const stakedNftsDetails = await getUserStakedNfts(
        account,
        provider,
        chainId,
        Moralis.Cloud,
        contractaddress,
      );
      setStakedNfts(stakedNftsDetails.stakedNft);
      setRewardsEarned(stakedNftsDetails.pendingRewards);
      setLoading(false);
    }
  }, [account, provider, chainId, Moralis.Cloud, contractaddress]);

  useEffect(() => {
    handleGetContractData();
    hanldeGetStakedData();
  }, [handleGetContractData, hanldeGetStakedData]);

  const claimReward = async () => {
    try {
      setTransaction({ loading: true, status: "pending" });
      const { getRewards } = await import("utils/stakingContract");
      await getRewards(
        address,
        provider,
        chainId,
        stakedNfts.map((m) => Number(m.stakeId)),
      );
      await hanldeGetStakedData();
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      console.log(error);
      setTransaction({ loading: true, status: "error" });
    }
  };

  return (
    <div className="staking-card">
      <motion.header
        initial={false}
        onClick={() => setIsOpen((o) => !o)}
        className={"staking-card_header"}
      >
        <div className="staking-card_header-block">
          <img src={avatar} alt="avatar" />
          <h3>Otherdead</h3>
        </div>
        <div className="flex-column g-5">
          <p>Reward per block</p>
          <p className="font-regular">
            {contractData ? (
              `${n4.format(contractData.rewardPerBlock)} KZ`
            ) : (
              <Skeleton />
            )}
          </p>
        </div>
        <div className="flex-column g-5">
          <p>Total Staked</p>
          <p className="font-regular">
            {contractData ? millify(contractData.totalStaked) : <Skeleton />}
          </p>
        </div>
      </motion.header>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="staking-card_content-box">
              <div className=" staking-card_content-box_header flex-between">
                <div>
                  <a
                    href={`${blockExplorer(contractaddress)}`}
                    className="flex g-5"
                  >
                    <span>View contract</span>
                    <ExternalLink />
                  </a>
                </div>
                <div className="flex g-30">
                  <div>
                    <p>Total earned</p>
                    <p className="font-regular">{n4.format(rewardsEarned)}kz</p>
                  </div>
                  <Button
                    variant="secondary"
                    disabled={!rewardsEarned}
                    onClick={() => claimReward()}
                  >
                    Claim
                  </Button>
                </div>
                <Link to="/marketplace">
                  <Button>Buy on kudoszone</Button>
                </Link>
              </div>
              <div className="staking-card_content-box_grid">
                <fieldset>
                  <legend>Your Staked NFTS</legend>
                  <Unstake
                    loading={loading}
                    stakedNfts={stakedNfts}
                    handleGetStakedData={hanldeGetStakedData}
                    contractaddress={contractaddress}
                  />
                </fieldset>
                <fieldset>
                  <legend>Your NFTS</legend>
                  <YourNft
                    contractaddress={contractaddress}
                    address={address}
                  />
                </fieldset>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StakingCard;
