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
import {RankingGuard} from "components/routing/routeProtectors/RankingGuard";
import Ranking from "components/views/Ranking";
import Select from "components/views/Select";
import Rooms from "components/views/Room";
import Start from "components/views/Start";
import UndercoverGameWinPage from "components/views/UndercoverGameWinPage"
import UndercoverGamePage from "components/views/UndercoverGamePage"
import UndercoverVotePage from "components/views/UndercoverVotePage"
import SudokuGameWinPage from "components/views/SudokuGameWinPage"
import SudokuSelectPage from "../../views/SudokuSelectPage";
import {SudokuGameGuard} from "components/routing/routeProtectors/SudokuGameGuard";
import SudokuGamePage from "../../views/SudokuGamePage";
import History from "components/views/History"

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
          <Route path="/ranking/:id">
            <RankingGuard>
              <Ranking/>
            </RankingGuard>
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
            <PlatformGuard>
              <Select/>
            </PlatformGuard>
          </Route>
          <Route exact path="/room">
            <PlatformGuard>
              <Rooms/>
            </PlatformGuard>
          </Route>
          <Route exact path="/start">
            <PlatformGuard>
              <Start/>
            </PlatformGuard>
          </Route>
        <Route exact path={"/SudokuSelect"}>
          <PlatformGuard>
            <SudokuSelectPage/>
          </PlatformGuard>
        </Route>
        <Route exact path="/UndercoverGameWinPage">
          <PlatformGuard>
              <UndercoverGameWinPage/>
            </PlatformGuard>
        </Route>
          <Route exact path="/SudokuGame/:id">
            <PlatformGuard>
              <SudokuGamePage/>
            </PlatformGuard>
          </Route>
          <Route exact path="/SudokuGameWinPage">
            <PlatformGuard>
            <SudokuGameWinPage/>
            </PlatformGuard>
          </Route>
        <Route exact path="/undercover/:gameId">
          <PlatformGuard>
            <UndercoverGamePage/>
          </PlatformGuard>
        </Route>
        <Route exact path="/undercover/:gameId/voting">
          <PlatformGuard>
            <UndercoverVotePage/>
          </PlatformGuard>
        </Route>
        <Route exact path="/history/:id">
          <PlatformGuard>
            <History/>
          </PlatformGuard>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
* Don't forget to export your component!
 */
export default AppRouter;