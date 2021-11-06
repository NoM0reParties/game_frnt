import './login.css';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'

const Login = ({username, setUsername, logged, setLogged}) => {

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    async function sendLogOut() {
        await axios.post("/api/user/logout", {
            headers: { 'X-CSRFToken': CSRFToken }
        });
        setLogged(false);
    }

    if (logged) {
        return (
            <div className="header__login">
                <Link to="/login-form" className="header__login-btn">{username}</Link>
                <button to="/login-form" onClick={sendLogOut} className="header__login-btn">Logout</button>
            </div>
        )
    } else {
        return (
            <div className="header__login">
                <Link to="/login-form" className="header__login-btn">Login</Link>
                <Link to="/register-form" className="header__login-btn">Register</Link>
            </div>
        )
    }
};


export default Login;