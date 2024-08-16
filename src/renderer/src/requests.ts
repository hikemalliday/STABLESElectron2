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
  sortBy: string;
  desc: boolean;
}

export interface IPaginatedResponse {
  count: number;
  results: object[];
}

interface IParseResponse {
  passed: boolean;
  message: string;
}

const BASE_URL = "http://127.0.0.1:3000";

export const useData = (args: IGetDataArgs): UseQueryResult<IPaginatedResponse> => {
  const { page, itemName, charName, activeView, sortBy, desc } = args;
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
    queryKey: [page, itemName, charName, activeView, sortBy, desc],
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

export const testEqDir = async (): Promise<IParseResponse> => {
  const returnObject = { message: "", passed: false };
  const failMessage =
    "Could not read eq dir, please make sure you have provided the correct eq dir. Aborting all parses.";
  try {
    const resp = await axios.get(BASE_URL + "/test_eq_dir");
    if (resp.status === 200) {
      returnObject.message = "Provided directory exists.";
      returnObject.passed = true;
      return returnObject;
    } else {
      returnObject.message = failMessage;
      return returnObject;
    }
  } catch (err) {
    returnObject.message = failMessage;
    return returnObject;
  }
};

export const parseItems = async (): Promise<IParseResponse> => {
  const returnObject = { message: "", passed: false };
  const failMessage =
    "Items parse failed, please make sure you have provided the correct eq dir. Aborting parses: items, missing spells, yellow text, camp out locations.";
  try {
    const resp = await axios.get(BASE_URL + "/parse_items");
    if (resp.status === 200) {
      returnObject.message = "Items parse successful.";
      returnObject.passed = true;
      return returnObject;
    } else {
      returnObject.message = failMessage;
      return returnObject;
    }
  } catch (err) {
    returnObject.message = failMessage;
    return returnObject;
  }
};

export const parseMissingSpells = async (): Promise<IParseResponse> => {
  const returnObject = { message: "", passed: false };
  const failMessage =
    "Missing spells parse failed, please make sure you have provided the correct eq dir. Aborting parses: missing spells, yellow text, camp out locations.";
  try {
    const resp = await axios.get(BASE_URL + "/parse_missing_spells");
    if (resp.status === 200) {
      returnObject.message = "Missing spells parse successful.";
      returnObject.passed = true;
      return returnObject;
    } else {
      returnObject.message = failMessage;
      return returnObject;
    }
  } catch (err) {
    returnObject.message = failMessage;
    return returnObject;
  }
};

export const testLogsDir = async (): Promise<IParseResponse> => {
  const returnObject = { message: "", passed: false };
  const failMessage =
    "Could not read logs dir, please make sure you have provided the correct eq dir. Aborting parses: yellow text, camp out locations.";
  try {
    const resp = await axios.get(BASE_URL + "/test_logs_dir");
    if (resp.status === 200) {
      returnObject.message = "Logs dir exists.";
      returnObject.passed = true;
      return returnObject;
    } else {
      returnObject.message = failMessage;
      return returnObject;
    }
  } catch (err) {
    returnObject.message = failMessage;
    return returnObject;
  }
};

export const parseYellowText = async (): Promise<IParseResponse> => {
  const returnObject = { message: "", passed: false };
  const failMessage =
    "Yellow text parse failed, please make sure you have provided the correct eq dir. Aborting parses: yellow text, camp out locations";
  try {
    const resp = await axios.get(BASE_URL + "/parse_yellow_text");
    if (resp.status === 200) {
      returnObject.message = "Yellow text parse successful.";
      returnObject.passed = true;
      return returnObject;
    } else {
      returnObject.message = failMessage;
      return returnObject;
    }
  } catch (err) {
    returnObject.message = failMessage;
    return returnObject;
  }
};

export const parseCampOut = async (): Promise<IParseResponse> => {
  const returnObject = { message: "", passed: false };
  const failMessage =
    "Camp out locations parse failed, please make sure you have provided the correct eq dir. Aborting parse: camp out locations.";
  try {
    const resp = await axios.get(BASE_URL + "/parse_campout");
    if (resp.status === 200) {
      returnObject.message = "Camp out locations parse successful.";
      returnObject.passed = true;
      return returnObject;
    } else {
      returnObject.message = failMessage;
      return returnObject;
    }
  } catch (err) {
    returnObject.message = failMessage;
    return returnObject;
  }
};
