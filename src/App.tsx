import React from "react";
import "@mantine/core/styles.css";
import { MantineProvider, Container, ColorSchemeScript } from "@mantine/core";
import { BrowserRouter, useRoutes } from "react-router-dom";
import config from "./config";
import { ConfigProvider } from "./contexts/ConfigContext";
import Layout from "./components/Layout";
import routes from "./routes";

function AppRoutes() {
  const element = useRoutes(routes);
  return <>{element}</>;
}

function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto">
        <ConfigProvider config={config}>
          <BrowserRouter>
            <Layout>
              <Container fluid>
                <React.Suspense fallback={<div>Loading...</div>}>
                  <AppRoutes />
                </React.Suspense>
              </Container>
            </Layout>
          </BrowserRouter>
        </ConfigProvider>
      </MantineProvider>
    </>
  );
}

export default App;
