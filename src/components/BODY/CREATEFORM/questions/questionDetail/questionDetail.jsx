import './questionDetail.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const QuestionDetail = ({ currentQuestion, setCondition }) => {
    const [question, setQuestion] = useState({});

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    }

    async function getQuestion() {
        axios.get(`/api/quiz/question_detail?question_id=${currentQuestion}`, { headers: myHeaders }).then((response) => {
            setQuestion(response.data)
        })
    };

    useEffect(() => {
        getQuestion()
    }, [])

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
                        data-path="one" src={question.image} />
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

    return (
        <div className="the__question">
            <button className="qback" onClick={() => {
                setCondition('questions');
            }}></button>
            <p className="the__question-text">{question.text}</p>
            {putMedia()}
        </div>
    )
};


export default QuestionDetail;