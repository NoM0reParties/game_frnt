import { useEffect, useState } from "react"
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

const QuestionsList = ({ myHeaders, round }) => {
    const [questions, setQuestions] = useState([])
    const [dragQuestion, setDragQuestion] = useState(0)
    const [confirmation, setConfirmation] = useState(false)
    const [delQuestion, setDelQuestion] = useState(null)

    const axios = require('axios');

    const params = useParams();

    const changeValue = (e) => {
        e.preventDefault();
        const payload = {
            "origin_id": dragQuestion,
            "destination_id": e.target.id
        };
        axios.put("/api/quiz/change_value", payload, { headers: myHeaders }).then((response) => {
            getQuestions(params.theme);
        })
    }

    const questionButton = () => {
        if ((questions.length < 5 && round !== 4) || (questions.length < 1 && round === 4)) {
            return (
                <Link to={`/constructor/${params.id}/${params.theme}/question-create`} className="questions__btn" >Добавить вопрос</Link>
            )
        }
    }

    async function getQuestions(id) {
        axios.get(`/api/quiz/question_list?theme_id=${id}`, { headers: myHeaders }).then((response) => {
            let data = response.data;
            setQuestions(data);
        })
    };

    useEffect(() => {
        getQuestions(params.theme);
    }, [])

    if (confirmation) {
        return (
            <div className="сhoice__block">
                <h1 className="form__header">Удаление</h1>
                <div className="choice__list">
                    <p className="delete__text">Вы действительно хотите удалить этот вопрос?</p>
                    <div className="delete__confirmation">
                        <button className="choice__btn"
                            onClick={() => {
                                axios.delete(`/api/quiz/update_question/${delQuestion}`, { headers: myHeaders }).then(response => {
                                    getQuestions(params.theme);
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
            <div className="questions__block">
                <h1 className="questions__header">Конструктор квиза</h1>
                <div className="questions__list">
                    {questions.map(question => {
                        return (
                            <div className="obj__row">
                                <Link
                                    to={`/constructor/${params.id}/${params.theme}/${question.id}/detail`}
                                    className="questions__item"
                                    id={question.id} key={question.id}
                                    draggable={true}
                                    onDragStart={(e) => {
                                        setDragQuestion(question.id);
                                    }}
                                    onDragEnd={(e) => { e.preventDefault() }}
                                    onDragOver={(e) => { e.preventDefault() }} onDrop={(e) => changeValue(e)}
                                >{question.text.slice(0, 10)} - {question.value}</Link>
                                <Link className="upd__link icon__edit" to={`/constructor/${params.id}/${params.theme}/${question.id}/update`}>
                                    <FontAwesomeIcon className="faicon" icon={faEdit} size="3x" />
                                </Link>
                                <FontAwesomeIcon className="upd__link faicon icon__trash" icon={faTrash} size="3x"
                                    onClick={() => {
                                        setDelQuestion(question.id);
                                        setConfirmation(true);
                                    }} />
                            </div>
                        )
                    }
                    )}
                    <Link className="back" to={`/constructor/${params.id}/themes`}></Link>
                    {questionButton()}
                </div>
            </div>
        )
    }
}

export default QuestionsList;