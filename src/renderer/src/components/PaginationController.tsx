import { Button } from "@mui/material";
import { useEffect, useRef } from "react";

interface IPaginationControllerProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  count?: number;
  pageSize: number;
}

export const PaginationController = ({
  page = 1,
  count = 0,
  setPage,
  pageSize,
}: IPaginationControllerProps): JSX.Element => {
  // Have to store value of page, otherwise event handler wont have access to the changing state at the correct time
  // Aka, the disabled on the buttons is buggy without this.
  // Same with the countRef
  const pageRef = useRef(page);
  const countRef = useRef(count);

  const handleKeyDown = (e: KeyboardEvent): void => {
    const searchBar = document.getElementsByClassName("search-bar")[0];
    if (document.activeElement !== searchBar) {
      if (e.key === "ArrowLeft") {
        if (pageRef.current > 0) setPage((prev) => prev - 1);
      } else if (e.key === "ArrowRight") {
        if ((pageRef.current + 1) * pageSize < countRef.current) {
          setPage((prev) => prev + 1);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return (): void => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Update pageRef and countRef so our handleKeyDown event handler works correctly
  useEffect(() => {
    pageRef.current = page;
    countRef.current = count;
  }, [page, count]);

  return (
    <div className="pagination-container">
      <div className="pagination-metadata">{`count: ${count}, page: ${page + 1}`}</div>
      <div className="pagination-buttons">
        <Button disabled={page + 1 === 1} onClick={() => setPage((prev) => prev - 1)}>
          LEFT
        </Button>
        <Button
          disabled={(page + 1) * pageSize > count}
          onClick={() => setPage((prev) => prev + 1)}
        >
          RIGHT
        </Button>
      </div>
    </div>
  );
};
