import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

export interface IGetDataArgs {
  page: number;
  itemName: string;
  charName: string;
  activeView: string;
  pageSize: number;
}

export interface IPaginatedResponse {
  count: number;
  results: object[];
}

const BASE_URL = "http://127.0.0.1:3000";

export const useData = (args: IGetDataArgs): UseQueryResult<IPaginatedResponse> => {
  const { page, itemName, charName, activeView } = args;
  let endpoint = "";
  switch (activeView) {
    case "missingSpells":
      endpoint = "/get_missing_spells";
      break;
    case "yellowText":
      endpoint = "/get_yellow_text";
      break;
    case "campOut":
      endpoint = "/get_camp_out";
      break;
    default:
      endpoint = "/get_items";
  }

  return useQuery({
    queryKey: [page, itemName, charName, activeView],
    queryFn: async () => {
      const resp = await axios.get(BASE_URL + endpoint, { params: args });
      return resp.data;
    },
    enabled: true,
  });
};

export const useCharNames = (activeView: string): UseQueryResult<string[]> => {
  return useQuery({
    queryKey: [activeView],
    queryFn: async () => {
      const resp = await axios.get(BASE_URL + "/get_char_names", { params: { activeView } });
      return resp.data;
    },
  });
};

export const useEqDir = (): UseQueryResult<string> => {
  return useQuery({
    retry: false,
    queryKey: ["eqDir"],
    queryFn: async () => {
      const resp = await axios.get(BASE_URL + "/get_eq_dir");
      return resp.data;
    },
  });
};
// Couldnt figure out this typing, chatgpt provided this solution
export const useEqDirMutation = (): UseMutationResult<void, AxiosError, string> => {
  const queryCLient = useQueryClient();

  return useMutation<void, AxiosError, string>({
    mutationFn: async (eqDir: string) => {
      return axios.patch(BASE_URL + "/set_eq_dir", { eqDir });
    },
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["eqDir"] });
    },
  });
};
