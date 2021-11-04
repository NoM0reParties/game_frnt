import './mainForm.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const MainForm = ({ setCondition, setCurrentQuiz  }) => {
    const [sections, setSections] = useState([])
    const [section, setSection] = useState(1)
    const [title, setTitle] = useState('')

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    }

    async function FormSend() {

        const payload = {
            "title": title,
            "section": section
        };

        await axios.post("/api/quiz/quiz_cr", payload, { headers: myHeaders }).then((response) => {
            let data = response.data;
            setCondition('themes');
            setCurrentQuiz(data.id);
        });
    }

    async function getSections() {
        axios.get("/api/quiz/sections", { headers: myHeaders }).then((response) => {
            let data = response.data;
            setSections(data.sections)
            setTitle(data.sections[0][1])
        })
    };

    const handleOnChange = (e) => {
        if (e.target.name === 'title') {
            setTitle(e.target.value)
        } else if (e.target.name === 'section') {
            sections.map(sec => {
                if (sec[1] === e.target.value) {
                    setSection(sec[0]);
                    return null;
                } 
            })
        }
    };

    useEffect(() => {
        getSections()
    }, [])

    if (!sections) {
        return 'Loading...'
    }

    return (
        <form className="main__formcq">
            <button className="back"></button>
            <div className="main__form-block">
                <label className="main__form-label" htmlFor="">Название</label>
                <input onChange={handleOnChange} className="main__form-input" name="title" type="text"></input>
            </div>
            <div className="main__form-block">
                <label className="main__form-label" htmlFor="">Раздел</label>
                <select onChange={handleOnChange} className="main__form-input" name="section">{sections.map(section => {
                    return (<option key={section[0]}>{section[1]}</option>)
                }
                )}</select>
            </div>
            <button className="main__form-btn" type="button" onClick={FormSend}>Создать</button>
        </form>
    )
};


export default MainForm;