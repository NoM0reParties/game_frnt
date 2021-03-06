import './gameProcess.css';
import { Redirect, useParams } from 'react-router';
import { useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';
import QuestionDetail from './questionDetail';

const GameProcess = () => {
    const [currentRound, setCurrentRound] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [questions, setQuestions] = useState({});
    const [condition, setCondition] = useState('gallery');
    const [players, setPlayers] = useState([])
    const [results, setResults] = useState([])
    const gameSocket = useRef(null)
    let params = useParams();

    const CSRFToken = Cookies.get('csrftoken');
    const axios = require('axios');
    const myHeaders = {
        'X-CSRFToken': CSRFToken
    }

    const room = window.location.search.split('=')

    async function getRound() {
        axios.get(`/api/quiz/players_dashboard?quiz_game_id=${params.id}`,
            { headers: myHeaders }).then((response) => {
                let data = response.data;
                setPlayers(data);
            })
    };

    async function getResults() {
        axios.get(`/api/quiz/results_table?quiz_game_id=${params.id}`,
            { headers: myHeaders }).then((response) => {
                let data = response.data;
                setResults(data);
            })
    };

    async function getQuestions() {
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

    const transitionText = () => {
        if (currentRound === 1) {
            return '?????????????? ???? ?????????????? ????????????'
        } else if (currentRound === 2) {
            return '?????????????? ?? ???????????????? ????????????'
        } else if (currentRound === 3) {
            return '?????????????? ?? ??????????-????????'
        } else if (currentRound === 4) {
            return '???????????????????? ????????????????????'
        }
    }

    useEffect(() => {
        getRound();
        getQuestions();
        gameSocket.current = new WebSocket(
            'ws://' + window.location.host + '/ws/game/' + room[1] + '/'
        );

        const wsCurrent = gameSocket.current;
        wsCurrent.onopen = () => console.log('ws opened')
        wsCurrent.onclose = () => console.log('ws closed');

        return () => {
            wsCurrent.close();
        }
    }, [])

    useEffect(() => {
        checkRound();
        getQuestions();
    }, [currentRound])

    const clickHandler = (e) => {
        setCurrentQuestion(e.target.id)
        gameSocket.current.send(JSON.stringify({
            'message': "unlock"
        }))
        setCondition('question');
    }

    if (condition === 'final') {
        return <Redirect to="/" />
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
                                        id={question.id} style={{ fontSize: 24 }}
                                        onClick={clickHandler}
                                    >??????????-????????</button>
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
                game_id={params.id} currentRound={currentRound} gameSocket={gameSocket.current}
                checkRound={checkRound} getRound={getRound} getQuestions={getQuestions}/>
            </div>
        )
    } else if (condition === 'results') {
        return (
            <div className="gallery">
                <div className="result__row headline">
                    <div className="result__name highlight">??????</div>
                    <div className="result__score highlight">????????</div>
                    <div className="result__percent highlight">% ???????????????????? ??????????????</div>
                </div>
                {results.map(result => {
                    return (
                        <div className="result__row" key={result.id}>
                            <div className="result__name">{result.name}</div>
                            <div className="result__score">{result.score}</div>
                            <div className="result__percent">{result.percent}</div>
                        </div>
                    )
                })}
                <button className="result__score" onClick={() => {
                    axios.post('/api/quiz/end_game', { game_id: params.id }, { headers: myHeaders });
                    setCondition('final');
                }}>?????????????????? ????????</button>
            </div>
        )
    } else if (condition === 'transition' && currentRound === 4) {
        return (
            <div className="transition">
                <button className="change__round" onClick={() => {
                    getResults();
                    setCondition('results');
                }}>???????????????? ????????????????????</button>
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