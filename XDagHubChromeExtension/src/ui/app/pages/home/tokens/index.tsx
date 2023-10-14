


import { Route, Routes } from "react-router-dom";

import TokenDetailsPage from "./TokenDetailsPage";
import TokenDetails from "./TokensDetails";

function TokensPage() {
  return (
    <Routes>
      <Route path="/" element={<TokenDetails />} />
      <Route path="/details" element={<TokenDetailsPage />} />
    </Routes>
  );
}

export default TokensPage;
