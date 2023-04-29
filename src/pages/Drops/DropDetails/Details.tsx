import React, { useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";

import { ReactComponent as Instagram } from "assets/icons/instagram.svg";
import { ReactComponent as Twitter } from "assets/icons/twitter.svg";
import { ReactComponent as Discord } from "assets/icons/discord.svg";
import { ReactComponent as Linkedin } from "assets/icons/linkedin.svg";
import { Button } from "components";
import { useGetDropByIdApiQuery } from "store/services/dropsApi";
import { IDropCollection } from "constants/types";
import UnlockWallet from "components/UnlockWallet";
import { useTransactionModal } from "hooks";

interface IDropsDetailsProps {
  collection_slug: string;
}

const Details: React.FC<IDropsDetailsProps> = ({ collection_slug }) => {
  const { data } = useGetDropByIdApiQuery(collection_slug);
  const { account, provider } = useMoralis();
  const [totalMint, setTotalMint] = useState(0);

  const handleGetContractData = useCallback(async () => {
    if (data && account && provider) {
      const etherProvider = new ethers.providers.Web3Provider(provider);
      const signer = etherProvider.getSigner(account);
      const nftContract = new ethers.Contract(
        data.contract_address,
        data.abi,
        signer,
      );

      setTotalMint(Number((await nftContract.totalSupply()).toString()));
    }
  }, [provider, account, data]);

  useEffect(() => {
    handleGetContractData();
  }, [handleGetContractData]);

  if (!data)
    return (
      <div className="promise_error">
        <p>Loading...</p>
      </div>
    );

  return (
    <div className="drop_details_route-collection">
      <div className="drop_details_route-collection_banner">
        <img src={data.banner} alt="banner" />
      </div>
      <div className="collection_content pad">
        <div className="collection_content-header">
          {/* <div className="block-left"></div> */}
          <div className="block-right">
            <img src={data.avatar} alt="avatar" className="avatar" />
            <div>
              <h2>{data.username ?? "unnamed"}</h2>
              <ul>
                {data.instagram_url && (
                  <li>
                    <a
                      className="social_icon"
                      href={data.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram />
                    </a>
                  </li>
                )}
                {data.twitter_url && (
                  <li>
                    <a
                      className="social_icon"
                      href={data.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Twitter />
                    </a>
                  </li>
                )}
                {data.discord_url && (
                  <li>
                    <a
                      className="social_icon"
                      href={data.discord_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Discord />
                    </a>
                  </li>
                )}
                {data.linkedin_url && (
                  <li>
                    <a
                      className="social_icon"
                      href={data.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin />
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        {/* <div className="collection_content-banner">
          <img src={data.banner} alt="banner" />
        </div> */}
        <div className="collection_content-details">
          <h1>{data.collection_name}</h1>
          <p>{data.description}</p>
        </div>
        <div className="collection_content-progress">
          <div className="progress-bar">
            <div
              className="value"
              style={{ width: `${(totalMint / data.total_supply) * 100}%` }}
            >
              <span>{totalMint}</span>
            </div>
            <p className="total_value text-secondary">{data.total_supply}</p>
          </div>
          <p className="text-secondary">38% minted</p>
        </div>
        <div className="collection_content-box">
          <div>
            <p>Mint price</p>
            <h4>290.0 CRO</h4>
          </div>
        </div>
        <Mint {...data} />
      </div>
    </div>
  );
};

const Mint: React.FC<IDropCollection> = ({ abi, contract_address }) => {
  const { isAuthenticated, account, provider } = useMoralis();
  const { setTransaction } = useTransactionModal();

  const handleMint = async () => {
    if (!provider || !account) return alert("connect web3 wallet to proceed");
    try {
      setTransaction({ loading: true, status: "pending" });
      const etherProvider = new ethers.providers.Web3Provider(provider);
      const signer = etherProvider.getSigner(account);
      const nftContract = new ethers.Contract(contract_address, abi, signer);
      const tx = await nftContract.mint("asdf", 10);
      await tx.wait();
      setTransaction({ loading: true, status: "success" });
    } catch (error) {
      setTransaction({ loading: true, status: "error" });
    }
  };

  return (
    <div className="collection_content-controls">
      {isAuthenticated ? (
        <Button onClick={handleMint}>Mint</Button>
      ) : (
        <UnlockWallet />
      )}
    </div>
  );
};

export default Details;
