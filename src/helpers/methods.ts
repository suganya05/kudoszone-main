import { NETWORK } from "constants/index";
import { IDropCollection } from "constants/types";
import moment from "moment";
import {
  MINT_CONTRACT_ADDRESS,
  MINT_ERC1155_CONTRACT_ADDRESS,
} from "utils/address";

export const getCompletedDrops = (data: IDropCollection[]) => {
  return data.filter((d) => {
    return moment().diff(d.end_date) > 0;
  });
};

export const getActiveDrops = (data: IDropCollection[]) => {
  return data.filter((d) => {
    return moment().diff(d.start_date) > 0 && moment().diff(d.end_date) < 0;
  });
};

export const getUpcomingDrops = (data: IDropCollection[]) => {
  return data.filter((d) => {
    return d.start_date && moment().diff(d.start_date) < 0;
  });
};

export const isNativeAddress = (address: string) => {
  const token_addresses = [
    MINT_CONTRACT_ADDRESS[NETWORK],
    MINT_ERC1155_CONTRACT_ADDRESS[NETWORK],
    "0x9c09C019033d309954B218df33e949EcE45b039a",
  ];

  return token_addresses.some(
    (s) => s.toLocaleLowerCase() === address.toLocaleLowerCase(),
  );
};

export const isErc1155Contract = (address: string) => {
  const token_addresses = [MINT_ERC1155_CONTRACT_ADDRESS[NETWORK]];

  return token_addresses.some(
    (s) => s.toLocaleLowerCase() === address.toLocaleLowerCase(),
  );
};
