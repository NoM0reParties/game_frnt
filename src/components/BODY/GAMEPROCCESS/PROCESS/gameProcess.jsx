import './gameProcess.css';
import { Redirect, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import QuestionDetail from './questionDetail';

const GameProcess = () => {
    const [currentRound, setCurrentRound] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questions, setQuestions] = useState({});
    const [condition, setCondition] = useState('gallery');
    const [players, setPlayers] = useState([])
    let params = useParams();

    const CSRFToken = Cookies.get('csrftoken');
    const axios = require('axios');
    const myHeaders = {
        'X-CSRFToken': CSRFToken
    }

    async function getRound() {
        axios.get(`/api/quiz/players_dashboard?quiz_game_id=${params.id}`,
            { headers: myHeaders }).then((response) => {
                let data = response.data;
                setPlayers(data);
            })
    };

    async function getPlayers() {
        axios.get(`/api/quiz/quiz_game_round?quiz_game_id=${params.id}&round=${currentRound}`,
            { headers: myHeaders }).then((response) => {
                let data = response.data;
                setQuestions(data);
            })
    };

    async function checkRound() {
        axios.get(`/api/quiz/round_completed?quiz_game_id=${params.id}&round=${currentRound}`,
            { headers: myHeaders }).then((response) => {
                let data = response.data;
                if (!data.alive) {
                    setCondition('transition');
                }
            })
    };

    const clickHandler = (e) => {
        setCurrentQuestion(e.target.id)
        setCondition('question');
    }

    const transitionText = () => {
        if (currentRound === 1) {
            return 'Перейти ко Второму раунду'
        } else if (currentRound === 2) {
            return 'Перейти к Третьему раунду'
        } else if (currentRound === 3) {
            return 'Перейти к Супер-Игре'
        } else if (currentRound === 4) {
            return 'Кажется всё'
        }
    }

    useEffect(() => {
        if (condition === 'gallery') {
            checkRound();
        }
        getRound();
        getPlayers();
    }, [condition])

    if (condition === 'final') {
        <Redirect to="/" />
    }

    if (condition === 'gallery') {
        return (
            <div className="gallery">
                <div className="players__bar">
                    {players.map(player => {
                        return (
                            <div className="player__board" key={player.id}>{player.name}: {player.score}</div>
                        )
                    })}
                </div>
                {Object.keys(questions).map(theme => {
                    return (
                        <div className="gallery__row" key={theme}>
                            <div className="gtheme" >{theme}</div>
                            {questions[theme].map(question => {
                                if (question.fresh && currentRound === 4) {
                                    return <button className="fresh__question" key={question.id} 
                                        id={question.id} style={{fontSize: 24}}
                                        onClick={clickHandler}
                                    >Супер-Игра</button>
                                } else if (question.fresh) {
                                    return <button className="fresh__question" key={question.id} id={question.id}
                                        onClick={clickHandler}
                                    >{question.value * currentRound}</button>
                                } else {
                                    return <div className="answered__question" key={question.id} id={question.id}></div>
                                }
                            })}
                        </div>
                    )
                }
                )}
            </div>
        )
    } else if (condition === 'question') {
        return (
            <div className="question__detail">
                <QuestionDetail currentQuestion={currentQuestion} setCondition={setCondition}
                game_id={params.id} currentRound={currentRound} />
            </div>
        )
    } else if (condition === 'transition' && currentRound === 5) {
        return (
            <div className="transition">
                <button className="change__round" onClick={() => {
                    axios.post('/api/quiz/end_game', {game_id: params.id}, { headers: myHeaders });
                    setCondition('final');
                }}>Спасибо за игру!</button>
            </div>
        )
    } else if (condition === 'transition') {
        return (
            <div className="transition">
                <button className="change__round" onClick={() => {
                    setCurrentRound(currentRound + 1);
                    setCondition('gallery');
                }}>{transitionText()}</button>
            </div>
        )
    }
}

export default GameProcess;