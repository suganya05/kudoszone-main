import axios from "axios";

// export const BASE_URL = "http://localhost:8000/api";
export const BASE_URL = "https://kudoszone-api-main.herokuapp.com/api";
// export const BASE_URL = "https://kudoszone-api-v2.herokuapp.com/api";

const API = axios.create({ baseURL: BASE_URL });

export const createDrop = (formData: any) =>
  API.post("/drops/create", formData);

export const createCollection = (formData: any) =>
  API.post("/collections/create", formData);
