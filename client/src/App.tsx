import { Route, Routes } from "react-router-dom";
import Home from "./view/Home";
import Login from "./view/Login";
import ProjectListView from "./view/ProjectListView";
import ProjectView from "./view/ProjectView";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/project" element={<ProjectListView />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<h1>404: Not Found</h1>} />
      <Route path="/project/:id" element={<ProjectView />} />
    </Routes>
  );
}

export default App;
