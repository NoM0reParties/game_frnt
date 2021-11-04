import './mainForm.css';
import Cookies from 'js-cookie'
import { useState } from 'react';
import { Redirect } from 'react-router';

const MainForm = ({ checkLog }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [redirect, setRedirect] = useState(false)

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    async function FormSend() {

        const payload = {
            "email": email,
            "password": password
        };

        const myHeaders = {
            'X-CSRFToken': CSRFToken
        }

        let res = await axios.post("/api/user/login", payload, { headers: myHeaders });
        let data = res.data;
        if (data.detail === "Successfully logged in") {
            setRedirect(true);
            checkLog();
        }
    }

    const handleOnChange = (e) => {
        if (e.target.name === 'email') {
            console.log('1')
            setEmail(e.target.value)
        } else if (e.target.name === 'password') {
            console.log('2')
            setPassword(e.target.value)
        }
    }

    if (redirect) {
        return (
            <Redirect to="/" />
        )
    } else {
        return (
            <form className="main__form">
                <div className="main__form-block">
                    <label className="main__form-label" htmlFor="">Логин</label>
                    <input className="main__form-input" onChange={handleOnChange} name="email"></input>
                </div>
                <div className="main__form-block">
                    <label className="main__form-label" htmlFor="">Пароль</label>
                    <input className="main__form-input" onChange={handleOnChange} name="password" type="password"></input>
                </div>
                <button className="main__form-btn" onClick={FormSend} type="button">Войти</button>
            </form>
        )
    }
};

export default MainForm;