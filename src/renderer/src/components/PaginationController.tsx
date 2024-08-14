import { Button } from "@mui/material";

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
