import { TOKEN_ADDRESS } from "./address";
import { getTokenSymbol, getUserAllowance } from "./tokenmethods";

export const getUserTokenDetails = async (
  address: string,
  provider: any,
  chainId: any,
) => {
  const tokenAddress = TOKEN_ADDRESS[chainId];

  const userAllowance = await getUserAllowance(
    address,
    provider,
    chainId,
    tokenAddress,
  );
  console.log(userAllowance);
  return {
    userAllowance,
    tokenSymbol: await getTokenSymbol(address, provider, tokenAddress),
    tokenAddress: tokenAddress,
    balance: await getUserTokenDetails(address, provider, chainId),
  };
};
