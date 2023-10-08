import PageMainLayout from "_app/shared/page-main-layout";
import { useLockedGuard } from "_app/wallet/hooks";
import Loading from "_components/loading";
import { ImportPage } from "_pages/initialize/import";
import PageLayout from "_pages/layout";

import st from "./ForgotPasswordPage.module.scss";

export default function ForgotPasswordPage() {
  const guardsLoading = useLockedGuard(true);
  return (
    <Loading loading={guardsLoading}>
      <PageLayout>
        <PageMainLayout className={st.main}>
          <ImportPage mode="forgot" />
        </PageMainLayout>
      </PageLayout>
    </Loading>
  );
}
