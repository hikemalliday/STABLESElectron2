import electronLogo from "./assets/electron.svg";
import { MainPage } from "./components/MainPage";
import { DataQueryContextProvider } from "@renderer/context/useDataQueryContext";
import { PaginationContextProvider } from "@renderer/context/usePaginationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ParseContextProvider } from "./context/useParseContext";
function App(): JSX.Element {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ParseContextProvider>
          <PaginationContextProvider>
            <DataQueryContextProvider>
              <MainPage />
            </DataQueryContextProvider>
          </PaginationContextProvider>
        </ParseContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
