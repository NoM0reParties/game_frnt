import './mainForm.css';
import { useState } from 'react';
import Cookies from 'js-cookie'

const MainForm = ({ checkLog }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    const [username, setUsername] = useState('')

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    async function FormSend() {

        const payload = {
            "email": email,
            "password": password,
            "username": username
        };

        const myHeaders = {
            'X-CSRFToken': CSRFToken
        }

        if (password === password2) {
            let res = await axios.post("/api/user/register", payload, { headers: myHeaders });
            let data = res.data;
            checkLog();
        } else {
            alert('passes not match')
        }
    }

    const handleOnChange = (e) => {
        if (e.target.name === 'email') {
            setEmail(e.target.value)
        } else if (e.target.name === 'password') {
            setPassword(e.target.value)
        } else if (e.target.name === 'password2') {
            setPassword2(e.target.value)
        } else if (e.target.name === 'username') {
            setUsername(e.target.value)
        }
    }

    return (
        <form className="main__form">
            <div className="main__form-block">
                <label className="main__form-label" htmlFor="">Email</label>
                <input className="main__form-input" onChange={handleOnChange} type="email" name="email"></input>
            </div>
            <div className="main__form-block">
                <label className="main__form-label" htmlFor="">Имя на сайте</label>
                <input className="main__form-input" onChange={handleOnChange} type="text" name="username"></input>
            </div>
            <div className="main__form-block">
                <label className="main__form-label" htmlFor="">Пароль</label>
                <input className="main__form-input" onChange={handleOnChange} type="password" name="password"></input>
            </div>
            <div className="main__form-block">
                <label className="main__form-label" htmlFor="">Пароль повторно</label>
                <input className="main__form-input" onChange={handleOnChange} type="password" name="password2"></input>
            </div>
            <button className="main__form-btn" type="button" onClick={FormSend}>Войти</button>
        </form>
    )
};


export default MainForm;