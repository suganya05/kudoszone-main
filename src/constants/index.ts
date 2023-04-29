export const sleep = (ms = 2000) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const zeroAddress = "0x0000000000000000000000000000000000000000";

// export const NETWORK = "0x152";
export const NETWORK = "0x19";

export const testnetExplorer = (address: string) =>
  `https://cronos.org/explorer/testnet3/address/${address}/transactions`;

export const mainnetExplorer = (address: string) =>
  `https://cronoscan.com/address/${address}`;

const IN_MAINNET = true;

export const blockExplorer = (address: string) => {
  if (!IN_MAINNET) return testnetExplorer(address);
  return mainnetExplorer(address);
};
