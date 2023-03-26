import { Routes, Route } from 'react-router-dom';

import Home from './Home';
import Folder from './Folder';
function Router() {
  return (
    <Routes>
      <Route path="/folder/:folderName" element={<Folder />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default Router;
