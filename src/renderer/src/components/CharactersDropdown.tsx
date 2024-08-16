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

  if (isLoading === true) return <>LOADING...</>;

  return (
    <select
      name="characters-dropdown"
      id="dropdown"
      className="dropdown"
      value={charName}
      onChange={handleDropdownChange}
    >
      {charNamesData !== undefined
        ? charNamesData?.map((char, i) => {
            return <option key={i}>{char}</option>;
          })
        : ""}
    </select>
  );
};
