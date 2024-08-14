import { Header } from "./Header";
import { SubHeader } from "./SubHeader";
import { TableView } from "./TableView";
import { PaginationController } from "./PaginationController";
import { useDataQueryContext } from "@renderer/context/useDataQueryContext";
import { usePaginationContext } from "@renderer/context/usePaginationContext";
import { useData } from "@renderer/requests";

export const MainPage = (): JSX.Element => {
  const { itemName, charName, activeView } = useDataQueryContext();
  const { page, setPage, pageSize } = usePaginationContext();
  const { data, isLoading } = useData({
    page,
    itemName,
    charName,
    activeView,
    pageSize,
  });

  if (isLoading) {
    return <>LOADING...</>;
  }

  const results = data?.results || [];
  const count = data?.count || 0;

  return (
    <>
      <Header />
      <SubHeader />
      <div className="table-view-and-pagination-wrapper">
        <PaginationController page={page} setPage={setPage} pageSize={pageSize} count={count} />
        <TableView data={results as object[]} isLoading={isLoading} />
      </div>
    </>
  );
};
