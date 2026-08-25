import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all of the pages we just created
import { Home } from './pages/Home';
import { Notices } from './pages/Notices';
import { Research } from './pages/Research';
import { Archive } from './pages/Archive';
import { Store } from './pages/Store';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Map the URLs to the specific Page components */}
        <Route path="/" element={<Home />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/research" element={<Research />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/store" element={<Store />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;