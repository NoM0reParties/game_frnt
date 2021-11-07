import './questions.css';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useParams, Link, Redirect } from 'react-router-dom';

const QuestionUpdate = () => {
    const [type, setType] = useState(1);
    const [text, setText] = useState('');
    const [types, setTypes] = useState([]);
    const [image, setImage] = useState(null);
    const [audio, setAudio] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const params = useParams();
    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');
    
    const myHeaders = {
        'X-CSRFToken': CSRFToken
    };

    async function onFormSub(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('text',text);
        formData.append('type',type);
        if (audio) {
            formData.append('audio',audio);
        }
        if (image) {
            formData.append('image',image);
        }

        const myMpHeaders = {
            'X-CSRFToken': CSRFToken,
            'content-type': 'multipart/form-data'
        }

        await axios.post(`/api/quiz/update_question/${params.qid}`, formData, { headers: myMpHeaders }).then(response => {
            setRedirect(true);
        });
    }

    async function getTypes() {
        axios.get("/api/quiz/types", { headers: myHeaders }).then((response) => {
            let data = response.data;
            setTypes(data.types)
        })
    };

    const getDetails = () => {
        axios.get(`/api/quiz/question_upd_detail?question_id=${params.qid}`, { headers: myHeaders }).then(response => {
            setText(response.data.text);
            setType(response.data.type);
        })
    }

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
        getDetails()
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

    if (redirect) {
        return <Redirect to={`/constructor/${params.id}/${params.theme}/questions`} />
    }

    return (
        <form onSubmit={onFormSub} className="question__form">
            <Link to={`/constructor/${params.id}/${params.theme}/questions`} className="back"></Link>
            <div className="question__form-block">
                <label className="question__form-label" htmlFor="">Текст вопроса</label>
                <textarea onChange={handleOnChange} value={text} className="question__form-input-text" name="text" type="text"></textarea>
            </div>
            <div className="question__form-block">
                <label className="question__form-label" htmlFor="">Раздел</label>
                <select onChange={handleOnChange} className="question__form-input" name="type">{types.map(curType => {
                    if (curType[0] === type) {
                        return (<option selected key={curType[0]}>{curType[1]}</option>)
                    } else {
                        return (<option key={curType[0]}>{curType[1]}</option>)
                    }
                }
                )}</select>
            </div>
            {UploadField()}
            <button className="main__form-btn" type="submit">Сохранить</button>
        </form>
    )
};


export default QuestionUpdate;