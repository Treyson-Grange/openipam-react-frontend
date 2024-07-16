import "@mantine/core/styles.css";
import { MantineProvider, Container, ColorSchemeScript } from "@mantine/core";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Demo from "./components/Home"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import config from "./config";
import { ConfigProvider } from "./contexts/ConfigContext";
import Layout from "./components/Layout";

function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto">
        <ConfigProvider config={config}>
          <BrowserRouter>
            <Layout>
              <Container fluid>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/demo" element={<Demo />} />
                </Routes>
              </Container>
            </Layout>
          </BrowserRouter>
        </ConfigProvider>
      </MantineProvider>
    </>
  );
}

export default App;
