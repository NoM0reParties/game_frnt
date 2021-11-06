import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './createForm.css';
import MainForm from './mainForm/mainForm.jsx'
import ThemeForm from './themes/theme.jsx';
import QuestionForm from './questions/questions.jsx'
import Cookies from 'js-cookie';
import QuestionDetail from './questions/questionDetail/questionDetail'

const CreateForm = () => {
    const [condition, setCondition] = useState('choice')
    const [currentQuiz, setCurrentQuiz] = useState(null)
    const [currentTheme, setCurrentTheme] = useState(null)
    const [currentQuestion, setCurrentQuestion] = useState(null)
    const [themes, setThemes] = useState([])
    const [questions, setQuestions] = useState([])
    const [quizes, setQuizes] = useState([])
    const [dragElement, setDragElement] = useState(0)
    const [dragQuestion, setDragQuestion] = useState(0)
    const [round, setRound] = useState(null)

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    };

    async function getQuizes() {
        axios.get("/api/quiz/quiz_list", { headers: myHeaders }).then((response) => {
            let data = response.data;
            setQuizes(data);
        })
    };

    async function getThemes(id) {
        axios.get(`/api/quiz/theme_list?quiz_id=${id}`, { headers: myHeaders }).then((response) => {
            let data = response.data;
            setThemes(data);
        })
    };

    async function getQuestions(id) {
        axios.get(`/api/quiz/question_list?theme_id=${id}`, { headers: myHeaders }).then((response) => {
            let data = response.data;
            setQuestions(data);
        })
    };

    const findThemeColor = (round) => {
        if (round === null) {
            return 'grey'
        } else if (round === 1) {
            return '#408513'
        } else if (round === 2) {
            return '#cedd00'
        } else if (round === 3) {
            return '#f38123'
        } else if (round === 4) {
            return 'red'
        }
    };

    const findQuestionColor = (value) => {
        if (value === 100) {
            return { backgroundColor: '#b4ffa1', color: 'black' }
        } else if (value === 200) {
            return { backgroundColor: '#72d35a', color: '#191d18' }
        } else if (value === 300) {
            return { backgroundColor: '#58ad43', color: '#293625' }
        } else if (value === 400) {
            return { backgroundColor: '#377727', color: '#a9fa95' }
        } else if (value === 500) {
            return { backgroundColor: '#215813', color: '#d1f6c7' }
        }
    };

    useEffect(() => {
        getQuizes();
    })

    const quizDetail = (e) => {
        setCurrentQuiz(e.target.id);
        getThemes(e.target.id);
        setCondition('themes');
    };

    const quizCreate = () => {
        setCondition('quizCreate');
    };

    const themeDetail = (e) => {
        if (e.target.style.backgroundColor === 'red') {
            setRound(4);
        } else if (e.target.style.backgroundColor === 'rgb(243, 129, 35)') {
            setRound(3);
        } else if (e.target.style.backgroundColor === 'rgb(206, 221, 0)') {
            setRound(2);
        } else if (e.target.style.backgroundColor === 'rgb(64, 133, 19)') {
            setRound(1);
        }
        setCondition('questions');
        getQuestions(e.target.id)
        setCurrentTheme(e.target.id);
    };

    const themeCreate = () => {
        setCondition('themeCreate');
    };

    const questionDetail = (e) => {
        setCondition('questionDetail');
        setCurrentQuestion(e.target.id);
    };

    const questionCreate = () => {
        setCondition('questionCreate');
    };

    const addTheme = () => {
        if (themes.length !== 16) {
            return <button className="theme__btn" onClick={themeCreate}>Добавить тему</button>
        }
    }

    const addToRound = (e) => {
        e.preventDefault();
        const payload = {
            "theme_id": dragElement,
            "round": e.target.id.slice(-1)
        };
        axios.put("/api/quiz/arrange_round", payload, { headers: myHeaders }).then((response) => {
            getThemes(currentQuiz);
        })
    }

    const changeThemeOrder = (e) => {
        e.preventDefault();
        const payload = {
            "theme_id": dragElement,
            "target_id": e.target.id
        };
        axios.put("/api/quiz/change_round", payload, { headers: myHeaders }).then((response) => {
            getThemes(currentQuiz);
        })
    }

    const changeValue = (e) => {
        e.preventDefault();
        const payload = {
            "origin_id": dragQuestion,
            "destination_id": e.target.id
        };
        axios.put("/api/quiz/change_value", payload, { headers: myHeaders }).then((response) => {
            getQuestions(currentTheme);
        })
    }

    const roundSpot = (round_id) => {
        const div_id = `round_${round_id}`
        let phrase;
        if (round_id === 1) {
            phrase = 'Первый Раунд'
        } else if (round_id === 2) {
            phrase = 'Второй Раунд'
        } else if (round_id === 3) {
            phrase = 'Третий Раунд'
        } else if (round_id === 4) {
            phrase = 'Супер-игра'
        }

        let full = 0;

        themes.map((theme) => {
            if (theme.round === round_id) {
                full += 1;
            }
        })

        if (round_id === 4 && full < 1) {
            return <div className="theme__round" id={div_id} style={{ backgroundColor: findThemeColor(round_id) }}
                draggable={true} onDragEnd={(e) => { e.preventDefault() }}
                onDragOver={(e) => { e.preventDefault() }} onDrop={(e) => addToRound(e)}
            >{phrase}</div>
        } else if (full < 5 && round_id !== 4) {
            return <div className="theme__round" id={div_id} style={{ backgroundColor: findThemeColor(round_id) }}
                draggable={true} onDragEnd={(e) => { e.preventDefault() }}
                onDragOver={(e) => { e.preventDefault() }} onDrop={(e) => addToRound(e)}
            >{phrase}</div>
        } else {
            return <div className="theme__round" style={{ backgroundColor: "grey" }}
            >{phrase} (заполнен)</div>
        }
    }

    const questionButton = () => {
        if (questions.length < 5 && round !== 4) {
            return (
                <button className="questions__btn" onClick={questionCreate}>Добавить вопрос</button>
            )
        } else if (questions.length < 1 && round === 4) {
            return (
                <button className="questions__btn" onClick={questionCreate}>Добавить вопрос</button>
            )
        }
    }

    if (condition === 'choice' && quizes.length !== 0) {
        return (
            <div className="сhoice__block">
                <h1 className="form__header">Конструктор квиза</h1>
                <div className="choice__list">
                    <Link className="back" to="/"></Link>
                    {quizes.map(quiz => {
                        const btnStyle = {
                            backgroundColor: quiz.color,
                        }
                        return (<button style={btnStyle} id={quiz.id} key={quiz.id}
                            onClick={quizDetail} className="choice__item">{quiz.name}</button>)
                    }
                    )}
                    <button className="choice__btn" onClick={quizCreate}>Создать квиз</button>
                </div>
            </div>
        )
    } else if (condition === 'choice' && quizes.length === 0) {
        return (
            <div className="сhoice__block">
                <h1 className="form__header">Конструктор квиза</h1>
                <div className="choice__list">
                    <p className="choice__empty">Вы ещё не создавали игр, самое время приступить!</p>
                    <button className="choice__btn" onClick={quizCreate}>Создать квиз</button>
                </div>
            </div>
        )
    } else if (condition === 'quizCreate') {
        return (
            <div className="create">
                <h1 className="form__header">Создай Квиз</h1>
                <div className="create__form">
                    <MainForm setCondition={setCondition} setCurrentQuiz={setCurrentQuiz} />
                </div>
            </div>
        )
    } else if (condition === 'themes') {
        return (
            <div className="theme__block">
                <h1 className="theme__header">Конструктор квиза</h1>
                <div className="theme__container">
                    <div className="theme__list">
                        <button className="back" onClick={() => {
                            getQuizes();
                            setCondition('choice');
                        }}></button>
                        {themes.map(theme => {
                            const btnStyle = {
                                backgroundColor: findThemeColor(theme.round),
                            }
                            return (<button draggable={true} style={btnStyle} id={theme.id} key={theme.id}
                                onDragStart={(e) => {
                                    setDragElement(theme.id);
                                }}
                                onDragEnd={(e) => { e.preventDefault() }}
                                onDragOver={(e) => { e.preventDefault() }} onDrop={(e) => changeThemeOrder(e)}
                                className="theme__item" onClick={themeDetail}>{theme.name}</button>)
                        }
                        )}
                        {addTheme()}
                    </div>
                    <div className="theme__roundlist">
                        {roundSpot(1)}
                        {roundSpot(2)}
                        {roundSpot(3)}
                        {roundSpot(4)}
                    </div>
                </div>
            </div>
        )
    } else if (condition === 'themeCreate') {
        return (
            <div className="create">
                <h1 className="form__header">Создай Квиз</h1>
                <div className="create__form">
                    <ThemeForm setCondition={setCondition} quiz={currentQuiz} getThemes={getThemes} />
                </div>
            </div>
        )
    } else if (condition === 'questions') {
        return (
            <div className="questions__block">
                <h1 className="questions__header">Конструктор квиза</h1>
                <div className="questions__list">
                    {questions.map(question => {
                        const btnStyle = findQuestionColor(question.value)
                        return (<button style={btnStyle} className="questions__item"
                            id={question.id} key={question.id}
                            draggable={true}
                            onDragStart={(e) => {
                                setDragQuestion(question.id);
                            }}
                            onDragEnd={(e) => { e.preventDefault() }}
                            onDragOver={(e) => { e.preventDefault() }} onDrop={(e) => changeValue(e)}
                            onClick={questionDetail}>{question.text.slice(0, 20)} - {question.value}</button>)
                    }
                    )}
                    <button className="back" onClick={() => {
                        getThemes(currentQuiz);
                        setCondition('themes');
                    }}></button>
                    {questionButton()}
                </div>
            </div>
        )
    } else if (condition === 'questionCreate') {
        return (
            <div className="create">
                <h1 className="form__header">Новый вопрос</h1>
                <div className="create__form">
                    <QuestionForm setCondition={setCondition} currentTheme={currentTheme}
                        getQuestions={getQuestions} questions={questions} />
                </div>
            </div>
        )
    } else if (condition === 'questionDetail') {
        return (
            <div className="question__detail">
                <h1 className="form__header">Предпросмотр вашего вопроса</h1>
                <QuestionDetail currentQuestion={currentQuestion} setCondition={setCondition} />
            </div>
        )
    } else if (condition === 'superQuestion') {
        return (
            <div className="question__detail">
                <h1 className="form__header">Предпросмотр вашего вопроса</h1>
                <QuestionDetail currentQuestion={currentQuestion} setCondition={setCondition} />
            </div>
        )
    } else {
        return (
            'Page is Loading...'
        )
    }
};


export default CreateForm;