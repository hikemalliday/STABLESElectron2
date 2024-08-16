import React from "react";
import { useState, createContext, useContext } from "react";

interface IDataQueryContext {
  itemName: string;
  setItemName: (item: string) => void;
  charName: string;
  setCharName: (char: string) => void;
  charNames: string[];
  setCharNames: (chars: string[]) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  clearFilters: () => void;
  eqDir: string;
  setEqDir: (eqDir: string) => void;
  sortBy: string;
  setSortBy: (col: string) => void;
  desc: boolean;
  setDesc: (desc: boolean) => void;
}

type DataQueryContextProviderProps = {
  children: React.ReactNode;
};

const DataQueryContext = createContext<IDataQueryContext | undefined>(undefined);

export const DataQueryContextProvider = ({
  children,
}: DataQueryContextProviderProps): JSX.Element => {
  const [itemName, setItemName] = useState("");
  const [charName, setCharName] = useState("ALL");
  const [charNames, setCharNames] = useState(["ALL"]);
  const [activeView, setActiveView] = useState("items");
  const [eqDir, setEqDir] = useState("");
  const [sortBy, setSortBy] = useState("charName");
  // For backend query params (order by)
  const [desc, setDesc] = useState(false);

  const clearFilters = (): void => {
    setItemName("");
    setCharName("");
  };

  return (
    <DataQueryContext.Provider
      value={{
        itemName,
        setItemName,
        charName,
        setCharName,
        charNames,
        setCharNames,
        activeView,
        setActiveView,
        clearFilters,
        eqDir,
        setEqDir,
        sortBy,
        setSortBy,
        desc,
        setDesc,
      }}
    >
      {children}
    </DataQueryContext.Provider>
  );
};

export const useDataQueryContext = (): IDataQueryContext => {
  const context = useContext(DataQueryContext);
  if (context === undefined) {
    throw new Error("useDataQueryContext must be used within a DataQueryProvider");
  }
  return context;
};
