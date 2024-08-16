import React, { useState } from "react";
import { useDataQueryContext } from "@renderer/context/useDataQueryContext";
import { usePaginationContext } from "@renderer/context/usePaginationContext";

export const SearchBar = (): JSX.Element => {
  const { setItemName, activeView } = useDataQueryContext();
  const { setPage } = usePaginationContext();
  const [inputText, setInputText] = useState("");
  const handleSearchBarChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(e.target.value);
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && activeView === "items") {
      setPage(0);
      setItemName(inputText);
    }
  };
  return (
    <input
      className="search-bar"
      type="text"
      placeholder="Search Bar"
      value={inputText}
      onChange={handleSearchBarChange}
      onKeyDown={handleEnter}
    />
  );
};
