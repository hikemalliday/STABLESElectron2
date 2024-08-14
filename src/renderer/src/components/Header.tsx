import { SearchBar } from "./SearchBar";
import { CharactersDropdown } from "./CharactersDropdown";

export const Header = (): JSX.Element => {
  return (
    <div className="header-container">
      <SearchBar />
      <CharactersDropdown />
    </div>
  );
};
