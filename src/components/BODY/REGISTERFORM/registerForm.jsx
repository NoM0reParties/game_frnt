import './registerForm.css';
import MainForm from './mainForm/mainForm.jsx'
import { Redirect } from 'react-router';

const RegisterForm = ({ checkLog, logged }) => {

    if (logged) {
        return (
            <Redirect to="/" />
        )
    }

    return (
        <div className="register">
            <h1 className="form__header">Регистрация</h1>
            <div className="register__form">
                <MainForm checkLog={checkLog} />
            </div>
        </div>
    )
};


export default RegisterForm;