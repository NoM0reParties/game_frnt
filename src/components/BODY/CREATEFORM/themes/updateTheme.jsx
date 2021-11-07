import { useEffect, useState } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';

const UpdateTheme = ({myHeaders}) => {
    const [name, setName] = useState('')
    const [redirect, setRedirect] = useState(false)

    const axios = require('axios');

    const params = useParams();

    const getDetails = () => {
        axios.get(`/api/quiz/theme_upd_detail?theme_id=${params.theme}`, { headers: myHeaders }).then(response => {
            setName(response.data.name)
        })
    }

    async function FormSend() {

        const payload = {
            "name": name,
        };

        await axios.put(`/api/quiz/update_theme/${params.theme}`, payload, { headers: myHeaders }).then(response => {
            setRedirect(true)
        })
    }

    const handleOnChange = (e) => {
        if (e.target.name === 'name') {
            setName(e.target.value)
        }
    };

    useEffect(() => {
        getDetails();
    }, [])

    if (redirect) {
        return <Redirect to={`/constructor/${params.id}/themes`} />
    }

    return (
        <form className="theme__form">
            <Link to={`/constructor/${params.id}/themes`} className="back"></Link>
            <div className="theme__form-block">
                <label className="main__form-label" htmlFor="">Название темы</label>
                <input onChange={handleOnChange} value={name} className="theme__form-input" name="name" type="text"></input>
            </div>
            <button className="theme__form-btn" type="button" onClick={FormSend}>Сохранить</button>
        </form>
    )
};


export default UpdateTheme;