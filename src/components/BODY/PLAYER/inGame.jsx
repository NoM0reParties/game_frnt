import './inGame.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Cookies from 'js-cookie';

const InGame = () => {
    const room = window.location.search.split('=')
    
    const [condition, setCondition] = useState('ready');
    const [score, setScore] = useState(0);
    const [bet, setBet] = useState(0);
    const [answer, setAnswer] = useState('');
    const [responder, setResponder] = useState('');
    const [attemptUsed, setAttemptUsed] = useState(false);
    
    const gameSocket = new WebSocket('ws://' + window.location.host + '/ws/game/' + room[1] + '/')

    let params = useParams();

    const CSRFToken = Cookies.get('csrftoken');
    const axios = require('axios');
    const myHeaders = {
        'X-CSRFToken': CSRFToken
    }

    console.log(gameSocket)

    gameSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log(data)
        if (data.message === 'block') {
            setResponder(data.username);
            setCondition('ready');
        } else if (data.message === 'unlock') {
            setResponder('');
            checkScore();
            if (!attemptUsed) {
                setCondition('button');
            }
        } else if (data.message === 'update') {
            setAttemptUsed(false);
            checkScore();
            setCondition('ready');
        }
    }

    async function sendReady() {
        setAttemptUsed(true);
        gameSocket.send(JSON.stringify({
            'message': "ready"
        }))
    };

    async function checkScore() {
        axios.get(`/api/quiz/player_score?quiz_game_id=${params.id}`, { headers: myHeaders }).then((response) => {
            setScore(response.data.score);
            if (response.data.round === 4 && ['ready', 'button'].includes(condition)) {
                setCondition('superbet')
            }
        })
    };

    async function FormSend() {

        const payload = {
            "bet": bet,
        };

        const myHeaders = {
            'X-CSRFToken': CSRFToken
        }

        axios.post("/api/quiz/bet_super", payload, { headers: myHeaders }).then(response => {
            document.querySelector('.main__form-input').value = '';
            setCondition('superanswer')
        })
    }

    async function FormAnswerSend() {

        const payload = {
            "answer": answer,
        };

        const myHeaders = {
            'X-CSRFToken': CSRFToken
        }

        axios.post("/api/quiz/answer_super", payload, { headers: myHeaders });
        setCondition('end')
    }

    const handleOnChange = (e) => {
        if (e.target.name === 'bet') {
            if (e.target.value > score) {
                e.target.value = score
            }
            setBet(e.target.value)
        } else if (e.target.name === 'answer') {
            setAnswer(e.target.value)
        }
    }

    const scoreDraw = () => {
        return <div className="score">Ваш счёт: {score}</div>
    }

    const maxScore = () => {
        if (score > 0) {
            return score
        } else {
            return 0
        }
    }

    const makeMessage = () => {
        if (responder) {
            return 'Отвечает ' + responder
        } else {
            return 'Ждите, пока не появится кнопка'
        }
    }

    if (condition === 'ready') {
        return (
            <div className="ready__block">
                <div className="ready__info">
                    {scoreDraw()}
                </div>
                <p className="ready_notion">{makeMessage()}</p>
            </div>
        )
    } else if (condition === 'button') {
        return (
            <div className="ready__block">
                <div className="ready__info">
                    {scoreDraw()}
                </div>
                <button className="ready__button" onClick={sendReady}>ЗНАЮ!</button>
            </div>
        )
    } else if (condition === 'superbet') {
        return (
            <form className="main__Sockform">
                <div className="ready__info">
                    {scoreDraw()}
                </div>
                <div className="main__form-block">
                    <label className="main__form-label" htmlFor="">Ставка</label>
                    <input className="main__form-input" type="number" min="0" max={maxScore()} onChange={handleOnChange} name="bet"></input>
                </div>
                <button className="main__form-btn" onClick={FormSend} type="button">Поставить</button>
            </form>
        )
    } else if (condition === 'superanswer') {
        return (
            <form className="main__form">
                <div className="ready__info">
                    {scoreDraw()}
                </div>
                <div className="main__form-block">
                    <label className="main__form-label" htmlFor="">Ваш Ответ</label>
                    <input className="main__form-input" maxLength="128" type="text" onChange={handleOnChange} name="answer"></input>
                </div>
                <button className="main__form-btn" onClick={FormAnswerSend} type="button">Ответить</button>
            </form>
        )
    } else if (condition === 'end') {
        return (
            <div className="ready__block">
                <div className="ready__info">
                    {scoreDraw()}
                </div>
                <p className="ready_notion">Спасибо за игру!</p>
            </div>
        )
    }
}

export default InGame;