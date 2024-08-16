import React from "react";
import { useState, createContext, useContext } from "react";

interface IParseContext {
  parseStatus: string[];
  setParseStatus: (statusArray: string[]) => void;
  clearStatus: () => void;
  addStatus: (status: string) => void;
  error: boolean;
  setError: (bool: boolean) => void;
  success: boolean;
  setSuccess: (bool: boolean) => void;
  inProgress: "";
  setInProgress: (progess: string) => void;
}

type ParseContextProviderProps = {
  children: React.ReactNode;
};

const ParseContext = createContext<IParseContext | undefined>(undefined);

export const ParseContextProvider = ({ children }: ParseContextProviderProps): JSX.Element => {
  const [parseStatus, setParseStatus] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const clearStatus = (): void => {
    setParseStatus([]);
    setError(false);
    setSuccess(false);
  };

  const addStatus = (status: string): void => {
    setParseStatus((prev) => [...prev, status]);
  };

  return (
    <ParseContext.Provider
      value={{
        parseStatus,
        setParseStatus,
        clearStatus,
        addStatus,
        error,
        setError,
        success,
        setSuccess,
      }}
    >
      {children}
    </ParseContext.Provider>
  );
};

export const useParseContext = (): IParseContext => {
  const context = useContext(ParseContext);
  if (context === undefined) {
    throw new Error("useParseContext must be used within a ParseContextProvider");
  }
  return context;
};
