import { useCallback, useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { IUser } from "store/context/UserContext";
import { getUserTokenDetails, tokenAddresses } from "utils/tokenmethods";

export default function useGetUserDetails() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IUser>({ tokens: [] });
  const [error, setError] = useState<string | null | Error>(null);
  const { provider, account, chainId } = useMoralis();

  const handleGetDetails = useCallback(async () => {
    if (account && provider) {
      try {
        setLoading(true);
        const token1 = await getUserTokenDetails(
          account,
          provider,
          chainId,
          tokenAddresses[0].value,
        );
        const token2 = await getUserTokenDetails(
          account,
          provider,
          chainId,
          tokenAddresses[1].value,
        );
        const token3 = await getUserTokenDetails(
          account,
          provider,
          chainId,
          tokenAddresses[2].value,
        );
        const userData = {
          tokens: [token1, token2, token3],
        };
        setData(userData);
      } catch (error) {
        console.log(error);
        setError(error);
      } finally {
        setLoading(false);
      }
    }
  }, [account, provider, chainId]);

  useEffect(() => {
    handleGetDetails();
  }, [handleGetDetails]);

  return { loading, data, error };
}
