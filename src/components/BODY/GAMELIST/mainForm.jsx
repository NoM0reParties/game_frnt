import { useState } from "react";
import Cookies from 'js-cookie';
import { Redirect } from "react-router";

const MainForm = ({ chosenQuiz }) => {
    const [title, setTitle] = useState('');
    const [created, setCreated] = useState(null);

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    }

    async function FormSend() {

        const payload = {
            "game_name": title,
            "data_id": chosenQuiz
        };

        await axios.post("/api/quiz/game_quiz_cr", payload, { headers: myHeaders }).then((response) => {
            let data = response.data;
            setCreated(data.id);
        });
    }

    const handleOnChange = (e) => {
        if (e.target.name === 'title') {
            setTitle(e.target.value)
        }
    };

    if (created) {
        let link = `/game-connection/${created}`
        return (
            <Redirect to={link} />
        )
    }

    return (
        <form className="main__formcq">
            <button className="back"></button>
            <div className="main__form-block">
                <label className="main__form-label" htmlFor="">Название</label>
                <input onChange={handleOnChange} className="main__form-input" name="title" type="text"></input>
            </div>
            <button className="main__form-btn" type="button" onClick={FormSend}>Создать</button>
        </form>
    )
}

export default MainForm;