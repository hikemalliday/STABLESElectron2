import React from "react";
import { useDataQueryContext } from "@renderer/context/useDataQueryContext";

export const ActiveViews = (): JSX.Element => {
  const { activeView, setActiveView, setCharName } = useDataQueryContext();
  const views = ["items", "missingSpells", "campOut", "yellowText"];
  const handleViewClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    setActiveView(e.currentTarget.textContent || "");
    setCharName("ALL");
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
