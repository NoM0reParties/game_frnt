import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { Link } from "react-router-dom";
import MainForm from "./mainForm";

const GameList = () => {
    const [quizes, setQuizes] = useState([])
    const [chosenQuiz, setChosenQuiz] = useState(0)

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    };

    async function getQuizes() {
        axios.get("/api/quiz/game_quiz_list", { headers: myHeaders }).then((response) => {
            let data = response.data;
            setQuizes(data);
        })
    };

    useEffect(() => {
        getQuizes();
    }, [])

    if (!quizes) {
        return 'Page is Loading...'
    }

    if (chosenQuiz === 0) {
        return (
            <div className="сhoice__block">
                <h1 className="form__header">Выберите квиз</h1>
                <div className="choice__list">
                    <Link className="back" to="/"></Link>
                    {quizes.map(quiz => {
                        return (<button id={quiz.id} key={quiz.id}
                            onClick={(e)=>{
                                setChosenQuiz(e.target.id)
                            }} className="choice__item">{quiz.name}</button>)
                    }
                    )}
                </div>
            </div>
        )
    } else {
        return (
            <div className="create">
                <h1 className="form__header">Создай Квиз</h1>
                <div className="create__form">
                    <MainForm chosenQuiz={chosenQuiz} />
                </div>
            </div>
        )
    }
}

export default GameList;