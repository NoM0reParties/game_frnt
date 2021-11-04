import './theme.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const ThemeForm = ({ setCondition, quiz, getThemes }) => {
    const [title, setTitle] = useState('')
    const [detail, setDetail] = useState('')

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    };

    async function FormSend() {
        const payload = {
            "name": title,
            "quiz": quiz
        };

        let response = await axios.post("/api/quiz/theme_cr", payload, { headers: myHeaders })
        if (response.data.hasOwnProperty('detail')) {
            setDetail(response.data.detail);
        } else {
            getThemes(quiz);
            setCondition('themes');
        }
    };

    const handleOnChange = (e) => {
        if (e.target.name === 'name') {
            setTitle(e.target.value);
        }
    };

    return (
        <form className="theme__form">
            <button className="back"></button>
            <div className="theme__form-block">
                <label className="main__form-label" htmlFor="">Название темы</label>
                <input onChange={handleOnChange} className="theme__form-input" name="name" type="text"></input>
                <div className="alert"><span className="detail">{detail}</span></div>
            </div>
            <button className="theme__form-btn" type="button" onClick={FormSend}>Создать</button>
        </form>
    )
};


export default ThemeForm;