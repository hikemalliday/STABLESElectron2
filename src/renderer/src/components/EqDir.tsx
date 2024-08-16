import React, { useEffect, useState } from "react";
import { useDataQueryContext } from "@renderer/context/useDataQueryContext";
import { useEqDir, useEqDirMutation } from "@renderer/requests";

export const EqDir = (): JSX.Element => {
  const { eqDir, setEqDir } = useDataQueryContext();
  const { data, isLoading } = useEqDir();
  const { mutateAsync } = useEqDirMutation();
  // Message confirmation that the eqDir was set. SLowly fades out with CSS
  const [confirmation, setConfirmation] = useState("");
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

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
    if (e.key === "Enter" && eqDir !== "" && isConfirmationVisible === false) {
      mutateAsync(eqDir);
      setIsConfirmationVisible(true);
      setConfirmation(`eqDir has been set: ${eqDir}`);
      setTimeout(() => {
        setIsConfirmationVisible(false);
        setConfirmation("");
      }, 1500);
    }
  };
  // If confirmation message exists, we override the regular input and display it
  if (isConfirmationVisible) {
    return (
      <input
        className="eq-dir-confirmation"
        type="text"
        placeholder="Eq Dir"
        value={confirmation ?? ""}
        onChange={handleInputChange}
        onKeyDown={handleEnter}
      />
    );
  }

  return (
    <input
      className="eq-dir"
      type="text"
      placeholder="Eq Dir"
      value={eqDir ?? ""}
      onChange={handleInputChange}
      onKeyDown={handleEnter}
    />
  );
};
