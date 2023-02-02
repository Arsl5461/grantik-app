import { Navigate, Route, Routes } from 'react-router-dom';

import ImageTool from '../components/ImageTool';

export const Builder = () => {
  return (
    <Routes>
      <Route path="" element={<ImageTool />} />
      {/* <Route path=":discussionId" element={<Discussion />} /> */}
      <Route path="*" element={<Navigate to="." />} />
    </Routes>
  );
};