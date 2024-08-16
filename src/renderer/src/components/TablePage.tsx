import { TableView } from "./TableView";
import { PaginationController } from "./PaginationController";
import { IPaginatedResponse, useData } from "@renderer/requests";
import { useDataQueryContext } from "@renderer/context/useDataQueryContext";
import { usePaginationContext } from "@renderer/context/usePaginationContext";
import { RenderParseStatus } from "./RenderParseStatus";
import { useParseContext } from "@renderer/context/useParseContext";

export const TablePage = (): JSX.Element => {
  const { itemName, charName, activeView, sortBy, desc } = useDataQueryContext();
  const { page, setPage, pageSize } = usePaginationContext();
  const { parseStatus } = useParseContext();
  const { data, isLoading, refetch } = useData({
    page,
    itemName,
    charName,
    activeView,
    pageSize,
    sortBy,
    desc,
  });

  if (parseStatus.length > 0) {
    // prop is for calling Items query after click 'back' button in parse view
    return <RenderParseStatus refetch={refetch} />;
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
