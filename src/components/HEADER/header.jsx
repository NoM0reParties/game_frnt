import './header.css';
import Menu from './menu/menu.jsx'
import Login from './login/login.jsx'

const Header = ({ username, setUsername, logged, setLogged }) => {

    return (
        <div className="header">
            <Menu />
            <Login username={username}
                setUsername={setUsername} logged={logged} setLogged={setLogged} />
        </div>
    )
};


export default Header;