import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {PlatformGuard} from "components/routing/routeProtectors/PlatformGuard";
import Platform from "components/views/Platform";
import Login from "components/views/Login";
import {RegisterGuard} from "components/routing/routeProtectors/RegisterGuard";
import Register from "components/views/Register";
import {ProfileGuard} from "components/routing/routeProtectors/ProfileGuard";
import Profile from "components/views/Profile";
import {ProfileEditGuard} from "components/routing/routeProtectors/ProfileEditGuard";
import ProfileEdit from "components/views/ProfileEdit";
import Select from "components/views/Select";
import Rooms from "components/views/Room";
import Start from "components/views/Start";
import UndercoverGameWinPage from "components/views/UndercoverGameWinPage"
import UndercoverGamePage from "components/views/UndercoverGamePage"


/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/platform">
          <PlatformGuard>
          <Platform/>
      </PlatformGuard>
        </Route>
        <Route path="/profile/:id">
          <ProfileGuard>
            <Profile/>
          </ProfileGuard>
        </Route>
        <Route path="/profile-edit/:id">
          <ProfileEditGuard>
            <ProfileEdit/>
          </ProfileEditGuard>
        </Route>
        <Route exact path="/register">
          <RegisterGuard>
            <Register/>
          </RegisterGuard>
        </Route>
        <Route exact path="/">
          <Redirect to="/login"/>
        </Route>
        <Route exact path="/login">
          <Login/>
        </Route>
        <Route exact path="/select">
          <Select/>
        </Route>
        <Route exact path="/room">
          <Rooms/>
        </Route>
        <Route exact path="/start">
          <Start/>
        </Route>
        <Route exact path="/UndercoverGameWinPage">
          <UndercoverGameWinPage/>
        </Route>
        <Route exact path="/undercover/:gameId">
          <UndercoverGamePage/>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;