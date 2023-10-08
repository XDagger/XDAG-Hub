import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "./app";
import { persister, queryClient } from "./app/helpers/queryClient";
import { useAppSelector } from "./app/hooks";
import { ErrorBoundary } from "_components/error-boundary";
import { initAppType } from "_redux/slices/app";
import { getFromLocationSearch } from "_redux/slices/app/AppType";
import { RpcClientContext } from "_src/xdag/api/RpcClient";
import store from "_store";
import { api, thunkExtras } from "_store/thunk-extras";
import "./styles/global.scss";
import "@fontsource/inter/variable.css";
import "@fontsource/red-hat-mono/variable.css";
import "bootstrap-icons/font/bootstrap-icons.scss";

async function init() {
  if (process.env.NODE_ENV === "development") {
    Object.defineProperty(window, "store", { value: store });
  }
  store.dispatch(initAppType(getFromLocationSearch(window.location.search)));
  await thunkExtras.background.init(store.dispatch);
  // const { apiEnv, customRPC } = store.getState().app;
  // setAttributes({ apiEnv, customRPC });
}

function renderApp() {
  const rootDom = document.getElementById("root");
  if (!rootDom) {
    throw new Error("Root element not found");
  }
  const root = createRoot(rootDom);

  console.log('............root:\n', root)

  root.render(
    <StrictMode>
      <Provider store={store}>
        <AppWrapper />
      </Provider>
    </StrictMode>,
  );
}

function AppWrapper() {
  const network = useAppSelector(
    ({ app: { apiEnv, customRPC } }) => `${apiEnv}_${customRPC}`,
  );
  return (
      <HashRouter>
        <>
          <Fragment key={network}>
            <PersistQueryClientProvider
              client={queryClient}
              persistOptions={{
                persister,
                dehydrateOptions: { shouldDehydrateQuery: ({ meta }) => !meta?.skipPersistedCache, },
              }}
            >
              <RpcClientContext.Provider value={api.instance.fullNode}>
                <ErrorBoundary>
                  <App />
                </ErrorBoundary>
              </RpcClientContext.Provider>
            </PersistQueryClientProvider>
          </Fragment>
        </>
      </HashRouter>
  );
}

(async () => {
  await init();
  renderApp();
})();
