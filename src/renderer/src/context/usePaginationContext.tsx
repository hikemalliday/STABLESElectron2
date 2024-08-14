import { useState, createContext, useContext } from "react";

interface IPaginationContext {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
}

type PaginationContextProviderProps = {
  children: React.ReactNode;
};

const PaginationContext = createContext<IPaginationContext | undefined>(undefined);

export const PaginationContextProvider = ({
  children,
}: PaginationContextProviderProps): JSX.Element => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  return (
    <PaginationContext.Provider
      value={{
        page,
        setPage,
        pageSize,
        setPageSize,
      }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePaginationContext = (): IPaginationContext => {
  const context = useContext(PaginationContext);
  if (context === undefined) {
    throw new Error("usePaginationContext must be used within a PaginationContext Provider.");
  }
  return context;
};
