import React, { useEffect } from "react";
import { useDataQueryContext } from "@renderer/context/useDataQueryContext";
import { useEqDir, useEqDirMutation } from "@renderer/requests";

export const EqDir = (): JSX.Element => {
  const { eqDir, setEqDir } = useDataQueryContext();
  const { data, isLoading } = useEqDir();
  const { mutateAsync } = useEqDirMutation();

  useEffect(() => {
    setEqDir(data as string);
  }, [isLoading]);

  if (isLoading === true) {
    return <>Getting eq dir...</>;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEqDir(e.target.value);
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      mutateAsync(eqDir);
    }
  };

  return (
    <input
      type="text"
      placeholder="Eq Dir"
      value={eqDir ?? ""}
      onChange={handleInputChange}
      onKeyDown={handleEnter}
    />
  );
};
