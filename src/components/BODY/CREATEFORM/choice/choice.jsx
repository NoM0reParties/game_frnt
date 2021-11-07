import { Link, Redirect } from "react-router-dom";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'

const Choice = ({ myHeaders }) => {
    const [quizes, setQuizes] = useState([])
    const [redirect, setRedirect] = useState(false)

    const axios = require('axios');

    async function getQuizes() {
        axios.get("/api/quiz/quiz_list", { headers: myHeaders }).then((response) => {
            let data = response.data;
            if (data !== []) {
                setQuizes(data);
            } else {
                setRedirect(true)
            }
        })
    };

    useEffect(() => {
        getQuizes();
    }, [])


    if (redirect) {
        <Redirect to="/constructor/no-choice" />
    }

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
                            <FontAwesomeIcon className="faicon icon__edit" icon={faEdit} size="3x" />
                            <FontAwesomeIcon className="faicon icon__trash" icon={faTrash} size="3x" />
                        </div>
                    )
                }
                )}
                <Link to="/constructor/quiz-create" className="choice__btn" >Создать квиз</Link>
            </div>
        </div>
    )
}

export default Choice;