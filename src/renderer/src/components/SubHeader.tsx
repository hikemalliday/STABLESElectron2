import { EqDir } from "./EqDir";
import { ActiveViews } from "./ActiveViews";

export const SubHeader = (): JSX.Element => {
  return (
    <div className="subheader-container">
      <EqDir />
      <ActiveViews />
    </div>
  );
};
