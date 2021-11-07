import { Link, Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

const Choice = ({ myHeaders }) => {
    const [quizes, setQuizes] = useState([])
    const [confirmation, setConfirmation] = useState(false)
    const [delQuiz, setDelQuiz] = useState(null)
    const [delName, setDelName] = useState('')

    const axios = require('axios');

    async function getQuizes() {
        axios.get("/api/quiz/quiz_list", { headers: myHeaders }).then((response) => {
            let data = response.data;
            if (data !== []) {
                setQuizes(data);
            }
        })
    };

    useEffect(() => {
        getQuizes();
    }, [])

    if (confirmation) {
        return (
            <div className="сhoice__block">
                <h1 className="form__header">Удаление</h1>
                <div className="choice__list">
                    <p className="delete__text">Вы действительно хотите удалить {delName}?</p>
                    <div className="delete__confirmation">
                        <button className="choice__btn"
                            onClick={() => {
                                axios.delete(`/api/quiz/update_quiz/${delQuiz}`, { headers: myHeaders }).then(response => {
                                    getQuizes();
                                    setConfirmation(false);
                                })
                            }}>Да</button>
                        <button className="choice__btn" onClick={() => {
                            setConfirmation(false);
                        }}>Нет</button>
                    </div>
                </div>
            </div >
        )
    } else {
        return (
            <div className="сhoice__block">
                <h1 className="form__header">Конструктор квиза</h1>
                <div className="choice__list">
                    <Link className="back" to="/"></Link>
                    {quizes.map(quiz => {
                        const to = `/constructor/${quiz.id}/themes`
                        return (
                            <div className="obj__row">
                                <Link to={to} id={quiz.id} key={quiz.id}
                                    className="choice__item">{quiz.name}</Link>
                                <Link className="upd__link icon__edit" to={`/constructor/${quiz.id}/update`}>
                                    <FontAwesomeIcon className="faicon" icon={faEdit} size="3x" />
                                </Link>
                                <FontAwesomeIcon className="upd__link faicon icon__trash"
                                    icon={faTrash} size="3x" onClick={() => {
                                        setDelName(quiz.name);
                                        setDelQuiz(quiz.id);
                                        setConfirmation(true);
                                    }} />
                            </div>
                        )
                    }
                    )}
                    <Link to="/constructor/quiz-create" className="choice__btn" >Создать квиз</Link>
                </div>
            </div>
        )
    }
}

export default Choice;