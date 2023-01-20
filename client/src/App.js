import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { themeSettings } from "theme";

import LoginPage from "scenes/loginPage";
import Dashboard from "scenes/dashboard";
import Layout from "scenes/layout";
import Products from "scenes/products";
import Customers from "scenes/customers";
import Transactions from "scenes/transactions";
import Geography from "scenes/geography";
import Overview from "scenes/overview";
import Daily from "scenes/daily";
import Monthly from "scenes/monthly";
import Breakdown from "scenes/breakdown";
import Admin from "scenes/admin";
import Performance from "scenes/performance";

import Profile from "scenes/profile";
import AddUser from "scenes/admin/AddUser";

function App() {
  const mode = useSelector((state) => 
  state.persistedReducer.mode
  );
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => 
  state.persistedReducer.token
  ));
  
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={isAuth ? <Navigate to="/dashboard" /> : <LoginPage />} />
            <Route element={isAuth ? <Layout /> : <Navigate to="/" />}>
              {/* <Route path="/" element={<Navigate to="/dashboard" replace />} /> */}
              <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/" />} />
              <Route path="/Profile" element={isAuth ? <Profile /> : <Navigate to="/" />} />

              <Route path="/products" element={isAuth ? <Products /> : <Navigate to="/" />} />
              <Route path="/customers" element={isAuth ? <Customers /> : <Navigate to="/" />} />
              <Route path="/transactions" element={isAuth ? <Transactions /> : <Navigate to="/" />} />
              <Route path="/geography" element={isAuth ? <Geography /> : <Navigate to="/" />} />
              <Route path="/overview" element={isAuth ? <Overview /> : <Navigate to="/" />} />
              <Route path="/daily" element={isAuth ? <Daily /> : <Navigate to="/" />} />
              <Route path="/monthly" element={isAuth ? <Monthly /> : <Navigate to="/" />} />
              <Route path="/breakdown" element={isAuth ? <Breakdown /> : <Navigate to="/" />} />
              <Route path="/users" element={isAuth ? <Admin /> : <Navigate to="/" />} />
              <Route path="/users/add" element={isAuth ? <AddUser /> : <Navigate to="/" />} />

              <Route path="/performance" element={isAuth ? <Performance /> : <Navigate to="/" />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
