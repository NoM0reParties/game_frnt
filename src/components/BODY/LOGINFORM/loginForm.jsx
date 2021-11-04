import './loginForm.css';
import MainForm from './mainForm/mainForm.jsx'
import { Redirect } from 'react-router';

const LoginForm = ({ checkLog, logged }) => {

    if (logged) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="login">
            <h1 className="form__header">Вход</h1>
            <div className="login__form">
                <MainForm checkLog={checkLog} />
            </div>
        </div>
    )
};


export default LoginForm;