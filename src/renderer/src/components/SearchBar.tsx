import React, { useState } from "react";
import { useDataQueryContext } from "@renderer/context/useDataQueryContext";

export const SearchBar = (): JSX.Element => {
  const { setItemName } = useDataQueryContext();
  const [inputText, setInputText] = useState("");
  const handleSearchBarChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputText(e.target.value);
  };
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") setItemName(inputText);
  };
  return (
    <input
      type="search"
      placeholder="Search Bar"
      value={inputText}
      onChange={handleSearchBarChange}
      onKeyDown={handleEnter}
    />
  );
};
