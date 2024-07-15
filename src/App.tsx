import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Demo from "./components/Home"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import config from "./config";
import { ConfigProvider } from "./contexts/ConfigContext";


function App() {
  return (
    <MantineProvider>
      <ConfigProvider config={config}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo" element={<Demo />} />
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </MantineProvider>
  );
}

export default App;
