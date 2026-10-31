import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ScrollToTop } from "./components/layout/ScrollToTop";

import { Appendices } from "./pages/appendices/Appendices";
import { Archive } from "./pages/archive/Archive";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { PostDetail } from "./pages/posts/PostDetail";
import { WritePost } from "./pages/posts/WritePost";
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
          path="/notices/:postId"
          element={<PostDetail section="notices" />}
        />

        <Route
          path="/notices/write"
          element={<WritePost section="notices" />}
        />
        <Route
          path="/research/write"
          element={<WritePost section="research" />}
        />
        <Route
          path="/archive/write"
          element={<WritePost section="archive" />}
        />
        <Route
          path="/research/:postId"
          element={<PostDetail section="research" />}
        />
        <Route
          path="/archive/:postId"
          element={<PostDetail section="archive" />}
        />

        {/* Admin-only, manually maintained records; no writing route. */}
        <Route path="/appendices" element={<Appendices />} />
        <Route path="/appendices/:appendixId" element={<Appendices />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
