import React from "react";
import { useDataQueryContext } from "@renderer/context/useDataQueryContext";
import { useCharNames } from "@renderer/requests";
import { usePaginationContext } from "@renderer/context/usePaginationContext";

export const CharactersDropdown = (): JSX.Element => {
  const { setCharName, activeView, charName } = useDataQueryContext();
  const { setPage } = usePaginationContext();
  const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setCharName(e.target.value);
    setPage(0);
  };
  const { data: charNamesData, isLoading } = useCharNames(activeView);

  // Prevents toggling through dropdown select with left and right keys. We only want this behavior for pagination
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>): void => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
    }
  };

  if (isLoading === true)
    return (
      <select
        name="characters-dropdown"
        id="dropdown"
        className="dropdown"
        value={charName}
        onChange={handleDropdownChange}
        onKeyDown={handleKeyDown}
      >
        <option>{"ALL"}</option>
      </select>
    );

  return (
    <select
      name="characters-dropdown"
      id="dropdown"
      className="dropdown"
      value={charName}
      onChange={handleDropdownChange}
      onKeyDown={handleKeyDown}
    >
      {charNamesData !== undefined
        ? charNamesData?.sort().map((char, i) => {
            return <option key={i}>{char}</option>;
          })
        : ""}
    </select>
  );
};
