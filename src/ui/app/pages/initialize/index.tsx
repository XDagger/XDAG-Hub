import { Outlet, useLocation } from "react-router-dom";
import Loading from "_components/loading";
import { useInitializedGuard } from "_hooks";
import PageLayout from "_pages/layout";
import st from "./InitializePage.module.scss";
import { HeaderOnlyLanguage } from "_app/shared/header/HeaderOnlyLanguage";

const InitializePage = () => {
  const { pathname } = useLocation();
  const checkingInitialized = useInitializedGuard( /^\/initialize\/backup(-imported)?(\/)?$/.test(pathname), );
  return (
    <PageLayout forceFullscreen={true} className={st.container}>
      <HeaderOnlyLanguage></HeaderOnlyLanguage>
      <Loading loading={checkingInitialized}>
        <Outlet />
      </Loading>
    </PageLayout>
  );
};

export default InitializePage;
