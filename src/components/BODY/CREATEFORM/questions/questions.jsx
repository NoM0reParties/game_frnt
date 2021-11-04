import './questions.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const QuestionForm = ({setCondition, currentTheme, getQuestions, questions}) => {
    const [type, setType] = useState(1);
    const [text, setText] = useState('');
    const [types, setTypes] = useState([]);
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    }

    const getValues = () => {
        let currValues = [];
        questions.map((question) => {
            console.log(question.value);
            currValues.push(question.value);
        });

        return currValues;
    }

    async function onFormSub(e) {
        e.preventDefault();
        const currValues = getValues();
        let currValue;

        if (!currValues.includes(100)) {
            currValue = 100;
        } else if (!currValues.includes(200)) {
            currValue = 200;
        } else if (!currValues.includes(300)) {
            currValue = 300;
        } else if (!currValues.includes(400)) {
            currValue = 400;
        } else if (!currValues.includes(500)) {
            currValue = 500;
        }  

        const formData = new FormData();
        formData.append('image',image);
        formData.append('text',text);
        formData.append('type',type);
        formData.append('audio',audio);
        formData.append('value',currValue);
        formData.append('theme',currentTheme);

        const myMpHeaders = {
            'X-CSRFToken': CSRFToken,
            'content-type': 'multipart/form-data'
        }

        await axios.post("/api/quiz/question_cr", formData, { headers: myMpHeaders });
        setCondition('questions');
        getQuestions(currentTheme);
    }

    async function getTypes() {
        axios.get("/api/quiz/types", { headers: myHeaders }).then((response) => {
            let data = response.data;
            setTypes(data.types)
        })
    };

    const handleOnChange = (e) => {
        if (e.target.name === 'text') {
            setText(e.target.value)
        } else if (e.target.name === 'type') {
            types.map(type => {
                if (type[1] === e.target.value) {
                    setType(type[0]);
                }
            })
        } else if (e.target.name === 'image') {
            setImage(e.target.files[0]);
        } else if (e.target.name === 'audio') {
            setAudio(e.target.files[0])
        }
    };

    useEffect(() => {
        getTypes()
    }, [])

    if (!types) {
        return 'Loading...'
    }

    let UploadField = () => {
        if (type === 2) {
            return (
                <div className="question__form-block">
                    <label className="question__form-label" htmlFor="">Название</label>
                    <input onChange={handleOnChange} className="question__form-input" name="image" type="file"></input>
                </div>
            )
        } else if (type === 3) {
            return (
                <div className="question__form-block">
                    <label className="question__form-label" htmlFor="">Название</label>
                    <input onChange={handleOnChange} className="question__form-input" name="audio" type="file"></input>
                </div>
            )
        } else {
            return null;
        }
    };

    return (
        <form onSubmit={onFormSub} className="question__form">
            <button className="back" onClick={() => {
                        getQuestions(currentTheme);
                        setCondition('questions');
                    }}></button>
            <div className="question__form-block">
                <label className="question__form-label" htmlFor="">Текст вопроса</label>
                <textarea onChange={handleOnChange} className="question__form-input-text" name="text" type="text"></textarea>
            </div>
            <div className="question__form-block">
                <label className="question__form-label" htmlFor="">Раздел</label>
                <select onChange={handleOnChange} className="question__form-input" name="type">{types.map(type => {
                    return (<option key={type[0]}>{type[1]}</option>)
                }
                )}</select>
            </div>
            {UploadField()}
            <button className="main__form-btn" type="submit">Создать</button>
        </form>
    )
};


export default QuestionForm;