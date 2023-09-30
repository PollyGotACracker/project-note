import { useRoutes } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { QueryClientProvider } from "react-query";
import { routes } from "@/router";
import { getClient } from "@services/core";
import { setThemeStorage } from "@utils/manageThemeStorage";
import { themeState } from "@recoils/theme";
import { isSignedInState } from "@recoils/user";

const App = () => {
  const isSignedIn = useRecoilValue(isSignedInState);
  const route = useRoutes(routes(isSignedIn));
  const queryClient = getClient();
  const userTheme = useRecoilValue(themeState);
  setThemeStorage(userTheme);

  return (
    <QueryClientProvider client={queryClient}>{route}</QueryClientProvider>
  );
};

export default App;
