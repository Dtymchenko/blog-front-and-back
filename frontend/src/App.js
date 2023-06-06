import React from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogin, selectIsAuth } from "./redux/slices/auth";

import Container from "@mui/material/Container";
import { Header } from "./components";
import { Home, FullPost, Registration, AddPost, Login, Tags } from "./pages";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchLogin());
  }, []);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route index element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/tags" element={<Tags />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
