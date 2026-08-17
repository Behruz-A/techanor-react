import React from "react";
import "../css/app.css";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { BrowserRouter, Link, Route, Switch } from "react-router-dom";
import { About } from "../app/screens/About";
import { Users } from "../app/screens/Users";
import { ProductsPage } from "./screens/productsPage";
import { BlogsPage } from "./screens/blogsPage";
import { OrdersPage } from "./screens/ordersPage";
import { UsersPage } from "./screens/userPage";

function App() {
  return (
    <div>
      <nav>
        <ul>
           <li>
            <Link to="/">HomePage</Link>
          </li>
          <li>
            <Link to="/products">ProductsPage</Link>
          </li>
          <li>
            <Link to="/orders">OrdersPage</Link>
          </li>
          <li>
            <Link to="/users">UsersPage</Link>
          </li>
             <li>
            <Link to="/blogs">BlogsPage</Link>
          </li>
          
        </ul>
      </nav>

      <Switch>
        <Route path="/products">
          <ProductsPage />
        </Route>
        <Route path="/orders">
          <OrdersPage />
        </Route>
          <Route path="/users">
          <UsersPage />
            <Route path="/blogs">
          <BlogsPage />
        </Route>
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  );
}

function Home() {
  return <Container>Home</Container>;
}
export default App;
