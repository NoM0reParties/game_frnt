import './mainForm.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

const UpdateQuiz = ({myHeaders}) => {
    const [sections, setSections] = useState([])
    const [section, setSection] = useState(0)
    const [title, setTitle] = useState('')
    const [redirect, setRedirect] = useState(false)

    const axios = require('axios');

    const params = useParams();

    const getDetails = () => {
        axios.get(`/api/quiz/quiz_upd_detail?quiz_id=${params.id}`, { headers: myHeaders }).then(response => {
            setSection(response.data.section);
            setTitle(response.data.title)
        })
    }

    async function FormSend() {

        const payload = {
            "title": title,
            "section": section
        };

        await axios.put(`/api/quiz/update_quiz/${params.id}`, payload, { headers: myHeaders }).then(response => {
            setRedirect(true)
        })
    }

    async function getSections() {
        axios.get("/api/quiz/sections", { headers: myHeaders }).then((response) => {
            let data = response.data;
            setSections(data.sections)
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
        getSections();
        getDetails();
    }, [])

    if (!sections) {
        return 'Loading...'
    }

    if (redirect) {
        return <Redirect to="/constructor/choice" />
    }

    return (
        <form className="main__formcq">
            <Link to="/constructor/choice" className="back"></Link>
            <div className="main__form-block">
                <label className="main__form-label" htmlFor="">Название</label>
                <input onChange={handleOnChange} value={title} className="main__form-input" name="title" type="text"></input>
            </div>
            <div className="main__form-block">
                <label className="main__form-label" htmlFor="">Раздел</label>
                <select onChange={handleOnChange} className="main__form-input" name="section">{sections.map(sec => {
                    if (sec[0] === section) {
                        return (
                            <option key={sec[0]} selected>{sec[1]}</option>
                        )
                    } else {
                        return (
                            <option key={sec[0]}>{sec[1]}</option>
                        )
                    }
                }
                )}</select>
            </div>
            <button className="main__form-btn" type="button" onClick={FormSend}>Сохранить</button>
        </form>
    )
};


export default UpdateQuiz;