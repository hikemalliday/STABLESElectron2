import React from "react";
import { useDataQueryContext } from "@renderer/context/useDataQueryContext";
import { usePaginationContext } from "@renderer/context/usePaginationContext";
import { useParseContext } from "@renderer/context/useParseContext";

export const ActiveViews = (): JSX.Element => {
  const { activeView, setActiveView, setCharName, setSortBy } = useDataQueryContext();
  const { setPage } = usePaginationContext();
  const { clearStatus } = useParseContext();

  const views = ["items", "missingSpells", "campOut", "yellowText"];
  const handleViewClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    setActiveView(e.currentTarget.textContent || "");
    setCharName("ALL");
    setSortBy("charName");
    setPage(0);
    clearStatus();
  };

  return (
    <div className="active-view-container">
      {views.map((view, i) => {
        return (
          <div
            className={view === activeView ? "active-view-choice-active" : "active-view-choice"}
            key={i}
            onClick={handleViewClick}
          >
            {view}
          </div>
        );
      })}
    </div>
  );
};
