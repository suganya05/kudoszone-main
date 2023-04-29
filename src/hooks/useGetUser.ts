import { useContext } from "react";
import { UserContext } from "store/context/UserContext";

export default function useGetUser() {
  return useContext(UserContext);
}
