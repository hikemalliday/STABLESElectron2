import { useParseContext } from "@renderer/context/useParseContext";
import {
  parseItems,
  parseMissingSpells,
  parseYellowText,
  testEqDir,
  testLogsDir,
  parseCampOut,
} from "@renderer/requests";

export const ParseButton = (): JSX.Element => {
  const { addStatus, clearStatus, setError, setSuccess } = useParseContext();

  const handleClick = async (): Promise<void> => {
    try {
      clearStatus();

      const testEQDirResp = await testEqDir();
      addStatus(testEQDirResp.message);
      if (testEQDirResp.passed === false) {
        setError(true);
        return;
      }

      const parseItemsResp = await parseItems();
      addStatus(parseItemsResp.message);
      if (parseItemsResp.passed === false) {
        setError(true);
        return;
      }

      const parseMissingSpellsResp = await parseMissingSpells();
      addStatus(parseMissingSpellsResp.message);
      if (parseMissingSpellsResp.passed === false) {
        setError(true);
        return;
      }

      const testLogsDirResp = await testLogsDir();
      addStatus(testLogsDirResp.message);
      if (testLogsDirResp.passed === false) {
        setError(true);
        return;
      }

      const yellowTextResp = await parseYellowText();
      addStatus(yellowTextResp.message);
      if (yellowTextResp.passed === false) {
        setError(true);
        return;
      }

      const parseCampOutResp = await parseCampOut();
      addStatus(parseCampOutResp.message);
      if (parseCampOutResp.passed === false) {
        setError(true);
        return;
      }
      setSuccess(true);
    } catch (err) {
      console.error("handleClick error: ", err);
    }
  };

  return (
    <button className="parse-button" onClick={handleClick}>
      PARSE
    </button>
  );
};
