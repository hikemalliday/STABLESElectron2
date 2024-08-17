import { TableView } from "./TableView";
import { PaginationController } from "./PaginationController";
import { IPaginatedResponse, useCharNames, useData } from "@renderer/requests";
import { useDataQueryContext } from "@renderer/context/useDataQueryContext";
import { usePaginationContext } from "@renderer/context/usePaginationContext";
import { RenderParseStatus } from "./RenderParseStatus";
import { useParseContext } from "@renderer/context/useParseContext";

export const TablePage = (): JSX.Element => {
  const { itemName, charName, activeView, sortBy, desc } = useDataQueryContext();
  const { page, setPage, pageSize } = usePaginationContext();
  const { parseStatus } = useParseContext();
  const { refetch: refetchCharNames } = useCharNames("items");
  const {
    data,
    isLoading,
    refetch: refetchData,
  } = useData({
    page,
    itemName,
    charName,
    activeView,
    pageSize,
    sortBy,
    desc,
  });

  const handleRefetch = (): void => {
    refetchData();
    refetchCharNames();
  };

  if (parseStatus.length > 0) {
    // prop is for calling Items query after click 'back' button in parse view
    return <RenderParseStatus refetch={handleRefetch} />;
  }

  if (isLoading) {
    return <div className="table-page-loading"></div>;
  }

  const count = data?.count || 0;

  return (
    <>
      <PaginationController page={page} setPage={setPage} pageSize={pageSize} count={count} />
      <TableView data={data as IPaginatedResponse} />
    </>
  );
};
