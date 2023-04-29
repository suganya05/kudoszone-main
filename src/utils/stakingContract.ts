import { IMarketplaceStatus } from "constants/types";
import { BigNumber } from "ethers";
import { formatEther } from "helpers/formatters";
import { STAKING_CONTRACT_ADDRESS } from "./address";
import { loadStakingContract, loadNftContract } from "./loadContract";
import { getIpfsData } from "./marketplacemethods";

export const getApprovedNFTOnStaking = async (
  address: string,
  provider: any,
  chainId: number | string,
  erc721TokenAddress: string,
) => {
  const mintContract = loadNftContract(address, provider, erc721TokenAddress);
  const value = await mintContract.isApprovedForAll(
    address,
    STAKING_CONTRACT_ADDRESS[chainId],
  );
  return value;
};

export const ApproveNFTOnStaking = async (
  address: string,
  provider: any,
  chainId: number | string,
  erc721TokenAddress: string,
) => {
  const mintContract = loadNftContract(address, provider, erc721TokenAddress);
  const tx = await mintContract.setApprovalForAll(
    STAKING_CONTRACT_ADDRESS[chainId],
    true,
  );
  await tx.wait();
};

export const calculateReward = async (
  address: string,
  provider: any,
  chainId: number | string,
  stakeId: string | number,
) => {
  const stakingContract = loadStakingContract(address, provider, chainId);
  const reward = await stakingContract.calculateReward(stakeId);
  return formatEther(reward.toString());
};

export const stakeNFT = async (
  address: string,
  provider: any,
  chainId: number | string,
  tokenid: any,
) => {
  console.log(tokenid);
  const stakingContract = loadStakingContract(address, provider, chainId);
  const tx = await stakingContract.stake(tokenid);
  await tx.wait();
};

export const withdrawNFT = async (
  address: string,
  provider: any,
  chainId: number | string,
  stakeId,
  tokenIds: string[],
  transferIds: string[],
) => {
  const stakingContract = loadStakingContract(address, provider, chainId);
  const reward = await stakingContract.calculateReward(stakeId);
  const tx = await stakingContract.withdraw(
    stakeId,
    tokenIds,
    transferIds,
    reward.toString(),
  );

  await tx.wait();
};

export const getIdList = async (
  address: string,
  provider: any,
  chainId: number | string,
) => {
  const stakingContract = loadStakingContract(address, provider, chainId);
  const ids = await stakingContract.getIdlist(address);
  return [...ids.map((id) => id.toString())];
};

export const getStakingDetailsById = async (
  address: string,
  provider: any,
  chainId: number | string,
  id,
) => {
  const stakingContract = loadStakingContract(address, provider, chainId);
  const details = await stakingContract.getNftDetails(id);

  return {
    tokenIds: [...details[1].map((id: BigNumber) => id.toString())],
    startblock: Number(details[2].toString()),
    status:
      details[3].toString() === "0"
        ? IMarketplaceStatus.LIVE
        : IMarketplaceStatus.FINISHED,
  };
};

export const getStakingContractDetails = async (
  address: string,
  provider: any,
  chainId: number | string,
) => {
  const stakingContract = loadStakingContract(address, provider, chainId);
  const count = await stakingContract.totalcount();
  const rewardPerBlock = await stakingContract.rewardPerBlock();

  return {
    totalStaked: Number(count.toString()),
    rewardPerBlock: formatEther(rewardPerBlock.toString()),
  };
};

export const getUserStakedNfts = async (
  address: string,
  provider: any,
  chainId: number | string,
  Cloud,
  tokenAddress: string,
) => {
  const stakedIds = await getIdList(address, provider, chainId);

  const result = await Promise.all(
    stakedIds.map(async (id) => {
      const data = await getStakingDetailsById(address, provider, chainId, id);
      const nftContract = loadNftContract(address, provider, tokenAddress);

      const tokenData = await Promise.all(
        data.tokenIds.map(async (tokenId) => {
          const tokenURI = await nftContract.tokenURI(tokenId);
          const ipfsData = await getIpfsData(Cloud, tokenURI);

          return { ...ipfsData, tokenId };
        }),
      );

      return { ...data, tokenData, stakeId: id };
    }),
  );

  const filterOnLiveStakedNfts = result.filter(
    (f) => f.status === IMarketplaceStatus.LIVE,
  );

  const pendingRewards = await Promise.all(
    filterOnLiveStakedNfts.map(async (nft) => {
      return await calculateReward(address, provider, chainId, nft.stakeId);
    }),
  );
  console.log(pendingRewards);
  return {
    stakedNft: filterOnLiveStakedNfts,
    pendingRewards: pendingRewards.reduce((a, b) => a + b, 0),
  };
};

export const getRewards = async (
  address: string,
  provider: any,
  chainId: number | string,
  stakeIds: number[],
) => {
  const stakingContract = loadStakingContract(address, provider, chainId);
  console.log(stakeIds);
  const tx = await stakingContract.getReward(stakeIds);
  await tx.wait();
};
