import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import Home from "./components/Home";
import Login from "./components/Login";
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
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </MantineProvider>
  );
}

export default App;
