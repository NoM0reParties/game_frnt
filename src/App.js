import './App.css';
import { useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom'
import Header from './components/HEADER/header.jsx';
import Home from './components/BODY/HOME/home.jsx';
import CreateForm from './components/BODY/CREATEFORM/createForm.jsx';
import LoginForm from './components/BODY/LOGINFORM/loginForm.jsx';
import RegisterForm from './components/BODY/REGISTERFORM/registerForm.jsx';
import Cookies from 'js-cookie';
import GameList from './components/BODY/GAMELIST/gameList'
import GameConnection from './components/BODY/GAMEPROCCESS/gameConnection';
import GameProcess from './components/BODY/GAMEPROCCESS/PROCESS/gameProcess';
import InGame from './components/BODY/PLAYER/inGame';
import PlayerConnection from './components/BODY/PLAYER/playerConnection';

const App = () => {
  const [username, setUsername] = useState('');
  const [logged, setLogged] = useState(false)

  const CSRFToken = Cookies.get('csrftoken');
  const axios = require('axios');

  async function checkLog() {
    let res = await axios.get("/api/user/check_logged", {
      headers: { 'X-CSRFToken': CSRFToken }
    });
    let data = res.data;
    setLogged(data.logged);
    if (data.logged) {
      setUsername(data.username)
    }
  }

  useEffect(() => {
    checkLog()
  }, [])

  return (
    <div className="container">
      <Header username={username}
          setUsername={setUsername} logged={logged} setLogged={setLogged} />
      <Switch>
        <Route exact path="/">
          <Home logged={logged} />
        </Route>
        <Route path="/create-form">
          <CreateForm />
        </Route>
        <Route path="/login-form">
          <LoginForm checkLog={checkLog} logged={logged} />
        </Route>
        <Route path="/register-form">
          <RegisterForm checkLog={checkLog} logged={logged} />
        </Route>
        <Route path="/game-list">
          <GameList />
        </Route>
        <Route path="/game-connection/:id">
          <GameConnection />
        </Route>
        <Route path="/game-proccess/:id">
          <GameProcess />
        </Route>
        <Route path="/player-connection">
          <PlayerConnection />
        </Route>
        <Route path="/player-proccess/:id">
          <InGame />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
