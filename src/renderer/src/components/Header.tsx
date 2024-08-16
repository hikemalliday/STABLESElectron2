import { SearchBar } from "./SearchBar";
import { CharactersDropdown } from "./CharactersDropdown";
import { ParseButton } from "./ParseButton.jsx";

export const Header = (): JSX.Element => {
  return (
    <div className="header-container">
      <SearchBar />

      <div className="dropdown-and-button-container">
        <ParseButton />
        <CharactersDropdown />
      </div>
    </div>
  );
};
