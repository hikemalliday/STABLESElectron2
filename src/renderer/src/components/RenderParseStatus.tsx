import { useParseContext } from "@renderer/context/useParseContext";
import { useEffect, useState } from "react";

interface IInProgressProps {
  error: boolean;
  success: boolean;
}

interface IRenderParseStatusProps {
  refetch: CallableFunction;
}
// Vintage UI feel / look, instead of a loading spinner component
const InProgressComponent = ({ error, success }: IInProgressProps): JSX.Element => {
  const [inProgress, setInProgress] = useState("Parse in progress");

  useEffect(() => {
    if (error || success) {
      setInProgress("Parse ended");
      return;
    }

    const messages = [
      "Parse in progress",
      "Parse in progress.",
      "Parse in progress..",
      "Parse in progress...",
    ];

    let index = 0;
    const interval = setInterval(() => {
      setInProgress(messages[index]);
      index = (index + 1) % messages.length;
    }, 250);

    return (): void => clearInterval(interval);
  }, [error, success]);

  return <div>{inProgress}</div>;
};

export const RenderParseStatus = ({ refetch }: IRenderParseStatusProps): JSX.Element => {
  const { parseStatus, error, success, clearStatus } = useParseContext();
  const handleButtonClick = (): void => {
    clearStatus();
    refetch();
  };

  return (
    <div>
      <InProgressComponent error={error} success={success} />
      {parseStatus.map((element, i) => {
        return <div key={i}>{element}</div>;
      })}
      {error === true ? <div className="error-div">ERROR</div> : null}
      {success === true ? <div className="success-div">SUCCESS</div> : null}
      {error === true || success === true ? (
        <button className="back-button" onClick={handleButtonClick}>
          BACK
        </button>
      ) : null}
    </div>
  );
};
