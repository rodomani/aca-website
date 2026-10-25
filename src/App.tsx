import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import { ScrollToTop } from "./components/layout/ScrollToTop";

import { Archive } from "./pages/archive/Archive";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { NoticeDetail } from "./pages/notices/NoticeDetail";
import { Notices } from "./pages/notices/Notices";
import { Register } from "./pages/Register";
import { Research } from "./pages/research/Research";
import { Store } from "./pages/store/Store";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />

      <Routes>
        {/* Main pages */}
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<Research />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/store" element={<Store />} />

        {/* Notices */}
        <Route path="/notices" element={<Notices />} />
        <Route
          path="/notices/:noticeId"
          element={<NoticeDetail />}
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/register"
          element={<Register />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;