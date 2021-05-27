import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
//redux
import { Provider } from "react-redux";
import store from "./store";

const App = () => (
  <Provider store={store}>
    <Router>
      <>
        <Navbar />
        <Route exact path="/">
          <Landing />
        </Route>

        <section className="container">
          <Switch>
            <Route exact path="/Register">
              <Register />
            </Route>
            <Route exact path="/Login">
              <Login />
            </Route>
          </Switch>
        </section>
      </>
    </Router>
  </Provider>
);

export default App;
