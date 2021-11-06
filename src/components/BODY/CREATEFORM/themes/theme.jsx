import './theme.css';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Redirect, useParams, Link } from 'react-router-dom';

const ThemeForm = () => {
    const [title, setTitle] = useState('')
    const [detail, setDetail] = useState('')

    const CSRFToken = Cookies.get('csrftoken');
    const [redirect, setRedirect] = useState(false);

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    };

    const params = useParams();

    async function FormSend() {
        const payload = {
            "name": title,
            "quiz": params.id
        };

        let response = await axios.post("/api/quiz/theme_cr", payload, { headers: myHeaders })
        if (response.data.hasOwnProperty('detail')) {
            setDetail(response.data.detail);
        } else {
            setRedirect(true);
        }
    };

    const handleOnChange = (e) => {
        if (e.target.name === 'name') {
            setTitle(e.target.value);
        }
    };

    if (redirect) {
        return <Redirect to={`/constructor/${params.id}/themes`} />
    }

    return (
        <form className="theme__form">
            <Link to={`/constructor/${params.id}/themes`} className="back"></Link>
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