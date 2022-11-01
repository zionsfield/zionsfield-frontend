import React, { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setUser } from "./store/userReducer";
import { Navigate, Route, Routes } from "react-router-dom";
import { LinkRoutes } from "./utils/enums";
import Home from "./pages";
import Header from "./components/Header";
import ReloadPrompt from "./ReloadPrompt";
import useRequest from "./hooks/useRequest";
import Dashboard from "./pages/dashboard";
import Login from "./pages/login";

function App() {
  // replaced dyanmicaly
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.users.user);
  const [open, setOpen] = useState(false);
  const date = "__DATE__";
  const { doRequest: getUser } = useRequest({
    url: "/api/users/me",
    method: "get",
  });
  useEffect(() => {
    (async () => {
      const data = await getUser();
      console.log(data);
      dispatch(setUser(data.data));
    })();
  }, []);

  return (
    <div className="overflow-x-hidden mt-2">
      <Header user={user} open={open} setOpen={setOpen} />
      <Routes>
        <Route
          path={LinkRoutes.LOGIN}
          element={!user ? <Login /> : <Navigate to={LinkRoutes.DASHBOARD} />}
        />
        <Route
          path={LinkRoutes.DASHBOARD}
          element={user ? <Dashboard /> : <Navigate to={LinkRoutes.LOGIN} />}
        />
        <Route path={LinkRoutes.HOME} element={<Home />} />
      </Routes>
      <ReloadPrompt />
    </div>
  );
}

export default App;
