import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const QuestionDetail = ({ currentQuestion, setCondition, game_id, currentRound }) => {
    const [question, setQuestion] = useState({});
    const [playerReady, setPlayerReady] = useState({});
    const [answers, setAnswers] = useState([])

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    }

    async function getQuestion() {
        axios.get(`/api/quiz/ig_question_detail?question_id=${currentQuestion}&game_id=${game_id}`, { headers: myHeaders }).then((response) => {
            setQuestion(response.data)
        })
    };

    async function getReady() {
        axios.get(`/api/quiz/check_ready_players?&quiz_game_id=${game_id}`, { headers: myHeaders }).then((response) => {
            setPlayerReady(response.data)
        })
    };

    async function sendCorr() {
        const payload = {
            player_id: playerReady.id,
            game_id: game_id,
            question_id: currentQuestion
        }

        axios.post("/api/quiz/corr_answer", payload, { headers: myHeaders }).then((response) => {
            setCondition('gallery')
        })
    };

    async function sendWrong() {
        const payload = {
            player_id: playerReady.id,
            game_id: game_id,
            question_id: currentQuestion
        }

        axios.post("/api/quiz/wrong_answer", payload, { headers: myHeaders }).then((response) => {
            if (response.data.hasOwnProperty('new')) {
                setPlayerReady(response.data.new)
            } else {
                setPlayerReady({})
            }
        })
    };

    async function sendSuperCorr(player_id) {
        const payload = {
            player_id: player_id
        }
        axios.post("/api/quiz/corr_answer_super", payload, { headers: myHeaders })
    };

    async function sendSuperWrong(player_id) {
        const payload = {
            player_id: player_id
        }
        axios.post("/api/quiz/wrong_answer_super", payload, { headers: myHeaders })
    };

    const showAnswers = () => {
        axios.get(`/api/quiz/get_answers?game_id=${game_id}&q_id=${currentQuestion}`, { headers: myHeaders }).then((response) => {
            if (response.data.ready) {
                setAnswers(response.data.answers);
            }
        })
    }

    useEffect(() => {
        getQuestion();
        const readyInterval = setInterval(() => {
            getReady()
        }, 5000)
        return () => clearInterval(readyInterval)
    })

    if (!question) {
        return 'Loading...'
    }

    const putMedia = () => {
        if (question.hasOwnProperty('image')) {
            return (
                <div className="image__container">
                    <img class="question__image"
                        onClick={(e) => {
                            let path = e.currentTarget.getAttribute('data-path');
                            const modalOverlay = document.querySelector('.modal-overlay');
                            document.querySelector(`[data-target="${path}"]`).classList.add('modal--visible');
                            modalOverlay.classList.add('modal-overlay--visible');
                            document.querySelector('body').classList.add('stop-scroll');
                        }}
                        data-path="one" src={question.image} alt="gallery-pic" />
                    <div class="modal">
                        <div class="modal-overlay">
                            <div class="modal modal--1" data-target="one">
                                <button class="modal-close"
                                    onClick={(el) => {
                                        const modalOverlay = document.querySelector('.modal-overlay');
                                        modalOverlay.classList.remove('modal-overlay--visible');
                                        document.querySelector('.modal--visible').classList.remove('modal--visible')
                                        document.querySelector('body').classList.remove('stop-scroll');
                                    }}></button>
                                <img class="modal-picture" src={question.image} alt="gallery-pic" />
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else if (question.hasOwnProperty('audio')) {
            let audio = new Audio(question.audio);
            return (
                <div className="question__audio">
                    <button className="audio" onClick={() => {
                        audio.play();
                    }}>Play</button>
                    <button className="audio" onClick={() => {
                        audio.pause();
                    }}>Pause</button>
                    <button className="audio" onClick={() => {
                        audio.load();
                    }}>Reload</button>
                </div >
            );
        }
    }

    if (currentRound < 4) {
        return (
            <div className="q__block">
                <div className="the__question">
                    <button className="qback" onClick={() => {
                        setCondition('gallery');
                    }}></button>
                    <p className="the__question-text">{question.text}</p>
                    {putMedia()}
                </div>
                <div className="player__ready">
                    {playerReady.name}
                    <button className="ans corr_ans" onClick={() => {
                        sendCorr();
                        setPlayerReady({});
                    }}></button>
                    <button className="ans wrong_ans" onClick={() => {
                        sendWrong();
                    }}></button>
                    <button className="ans nobody_ans" onClick={() => {
                        axios.post('/api/quiz/nobody', { question_id: currentQuestion }, { headers: myHeaders });
                        setCondition('gallery');
                    }}></button>
                </div>
            </div>
        )
    } else {
        return (
            <div className="q__block">
                <div className="the__question">
                    <button className="qback" onClick={() => {
                        setCondition('gallery');
                    }}></button>
                    <p className="the__question-text">{question.text}</p>
                    {putMedia()}
                    <div className="super__answers">
                        {answers.map(answer => {
                            let classAnswer = `player__answer answer_${answer.id}`
                            let classBet = `player__bet bet_${answer.id}`
                            let classAnswerClose = `.answer_${answer.id}`
                            let classBetClose = `.bet_${answer.id}`
                            let shadowBet = `player__bet-close-${answer.id} player__bet-close`
                            let shadowBetCloser = `.player__bet-close-${answer.id}`
                            let shadowAnswer = `player__answer-close-${answer.id} player__answer-close`
                            let shadowAnsCloser = `.player__answer-close-${answer.id}`
                            let playerRow = `player__row player__row-${answer.id}`
                            let playerRowCloser = `.player__row-${answer.id}`
                            let corrButton = `ans corr_ans corr_${answer.id}`
                            let wrongButton = `ans wrong_ans wrong_${answer.id}`
                            let corrSelector = `.corr_${answer.id}`
                            let wrongSelector = `.wrong_${answer.id}`
                            return (
                                <div className={playerRow} key={answer.id}>
                                    <div className="player__name">{answer.name}</div>
                                    <div className={classAnswer}>{answer.answer}</div>
                                    <div className={classBet}>{answer.bet}</div>
                                    <button className={shadowAnswer} onClick={() => {
                                        document.querySelector(shadowAnsCloser).style.display = 'none';
                                        document.querySelector(classAnswerClose).style.display = 'block';
                                    }}>Показать ответ</button>
                                    <button className={shadowBet} onClick={() => {
                                        document.querySelector(shadowBetCloser).style.display = 'none';
                                        document.querySelector(classBetClose).style.display = 'block';
                                    }}>Показать ставку</button>
                                    <button className={corrButton} onClick={() => {
                                        sendSuperCorr(answer.id);
                                        document.querySelector(playerRowCloser).style.backgroundColor = '#064700';
                                        document.querySelector(corrSelector).style.display = 'none';
                                        document.querySelector(wrongSelector).style.display = 'none';
                                    }}></button>
                                    <button className={wrongButton} onClick={() => {
                                        sendSuperWrong(answer.id);
                                        document.querySelector(playerRowCloser).style.backgroundColor = '#850505';
                                        document.querySelector(corrSelector).style.display = 'none';
                                        document.querySelector(wrongSelector).style.display = 'none';
                                    }}></button>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="player__ready">
                    <button className="show__answers" onClick={() => {
                        showAnswers();
                        document.querySelector('.the__question-text').style.display = 'none';
                        if (question.type === 2) {
                            document.querySelector('.image__container').style.display = 'none';
                        }
                        if (question.type === 3) {
                            document.querySelector('.question__audio').style.display = 'none';
                        }
                    }}>Показать ответы</button>
                </div>
            </div>
        )
    }
};


export default QuestionDetail;