import * as Yup from "yup";

export const validateSingleCollectionSchema = Yup.object({
  name: Yup.string()
    .max(50, "maximum 50 characters only")
    .required("This field is required"),
  image: Yup.string(),
  description: Yup.string()
    .max(250, "maximum 250 characters only")
    .required("This field is required"),
  royaltyFee: Yup.number()
    .positive()
    .integer("decimals are not allowed")
    .max(25, "maximum 25% only allowed on royalty fee"),
  external_link: Yup.string()
    .url("invalid url")
    .max(100, "maximum 100 characters only"),
  attributes: Yup.array().of(
    Yup.object().shape({
      trait_type: Yup.string().max(50, "maximum 50 characters only"),
      value: Yup.string().max(50, "maximum 50 characters only"),
    }),
  ),
});

export const validateMultiCollectionSchema = Yup.object({
  name: Yup.string()
    .max(50, "maximum 50 characters only")
    .required("This field is required"),
  image: Yup.string(),
  description: Yup.string()
    .max(250, "maximum 250 characters only")
    .required("This field is required"),
  royaltyFee: Yup.number()
    .positive()
    .integer("decimals are not allowed")
    .max(25, "maximum 25% only allowed on royalty fee"),
  external_link: Yup.string()
    .url("invalid url")
    .max(100, "maximum 100 characters only"),
  totalSupply: Yup.number()
    .moreThan(0, "supply must be more than 0")
    .required("This field is required"),
  attributes: Yup.array().of(
    Yup.object().shape({
      trait_type: Yup.string().max(50, "maximum 50 characters only"),
      value: Yup.string().max(50, "maximum 50 characters only"),
    }),
  ),
});

export const placeBidValidationSchema = (currentBid: number) => {
  return Yup.object({
    price: Yup.number()
      .positive()
      .moreThan(currentBid, "amount must be greater than current bid price")
      .required("This field is requried"),
  });
};

export const createAuctionValidationSchema = Yup.object({
  bidPrice: Yup.number()
    .positive()
    .moreThan(0, "amount must be greater than 0")
    .required("This field is requried"),
  days: Yup.number()
    .positive()
    .integer("no decimals are allowed")
    .moreThan(0, "days must be greater than 0")
    .required("This field is requried"),
});

export const createAuctionErc1155ValidationSchema = (amt: number) => {
  return Yup.object({
    bidPrice: Yup.number()
      .positive()
      .moreThan(0, "amount must be greater than 0")
      .required("This field is requried"),
    days: Yup.number()
      .positive()
      .integer("no decimals are allowed")
      .moreThan(0, "days must be greater than 0")
      .required("This field is requried"),
    amount: Yup.number()
      .positive()
      .integer()
      .moreThan(0, "amount must be more than 0")
      .max(amt, `you can't exceed more than you have`)
      .required("This field is required"),
  });
};

export const createFixedSaleValidationSchema = Yup.object({
  price: Yup.number()
    .positive()
    .moreThan(0, "amount must be greater than 0")
    .required("This field is requried"),
});

export const createFixedSaleErc1155ValidationSchema = Yup.object({
  price: Yup.number()
    .positive()
    .moreThan(0, "amount must be greater than 0")
    .required("This field is requried"),
  amount: Yup.number()
    .positive()
    .integer()
    .moreThan(0, "amount must be more than 0")
    .required("This field is required"),
});

export const createDropValidationSchema = Yup.object({
  contract_address: Yup.string().required("This field is requried"),
  collection_name: Yup.string().required("This field is requried"),
  username: Yup.string()
    .max(50, "maximum 50 characters only")
    .required("This field is requried"),
  description: Yup.string()
    .min(50, "minimum 50 words are required")
    .max(1000, "maximum characters reached")
    .required("This field is requried"),
  instagram_url: Yup.string().url("invalid url"),
  linkedin_url: Yup.string().url("invalid url"),
  twitter_url: Yup.string().url("invalid url"),
  discord_url: Yup.string().url("invalid url"),
  telegram_url: Yup.string().url("invalid url"),
  total_supply: Yup.number()
    .typeError("invalid number")
    .positive()
    .integer()
    .required("This field is requried"),
  start_date: Yup.date().required("This field is requried"),
  end_date: Yup.date()
    .min(Yup.ref("start_date"), "end date must be after than start date")
    .required("This field is requried"),
});

export const createCollectionValidationSchema = Yup.object({
  contract_address: Yup.string().required("This field is requried"),
  collection_name: Yup.string().required("This field is requried"),
  instagram_url: Yup.string().url("invalid url"),
  linkedin_url: Yup.string().url("invalid url"),
  twitter_url: Yup.string().url("invalid url"),
  discord_url: Yup.string().url("invalid url"),
  telegram_url: Yup.string().url("invalid url"),
  total_supply: Yup.number()
    .positive()
    .integer()
    .required("This field is requried"),
});
