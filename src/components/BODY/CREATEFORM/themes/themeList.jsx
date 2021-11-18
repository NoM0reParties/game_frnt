import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons' 

const ThemesList = ({ myHeaders, setRound }) => {
    const [dragElement, setDragElement] = useState(0)
    const [themes, setThemes] = useState([])
    const [confirmation, setConfirmation] = useState(false)
    const [delTheme, setDelTheme] = useState(null)
    const [delName, setDelName] = useState('')

    const params = useParams();

    const axios = require('axios');

    function getThemes(id) {
        axios.get(`/api/quiz/theme_list?quiz_id=${id}`, { headers: myHeaders }).then((response) => {
            let data = response.data;
            setThemes(data);
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

    const addTheme = () => {
        if (themes.length !== 16) {
            return <Link to={`/constructor/${params.id}/theme-create`} className="theme__btn" >Добавить тему</Link>
        }
    }

    const addToRound = (e) => {
        e.preventDefault();
        const payload = {
            "theme_id": dragElement,
            "round": e.target.id.slice(-1)
        };
        axios.put("/api/quiz/arrange_round", payload, { headers: myHeaders }).then((response) => {
            getThemes(params.id);
        })
    }

    const changeThemeOrder = (e) => {
        e.preventDefault();
        const payload = {
            "theme_id": dragElement,
            "target_id": e.target.id
        };
        axios.put("/api/quiz/change_round", payload, { headers: myHeaders }).then((response) => {
            getThemes(params.id);
        })
    }

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
    };

    useEffect(() => {
        getThemes(params.id);
    }, []);

    if (confirmation) {
        return (
            <div className="сhoice__block">
                <h1 className="form__header">Удаление</h1>
                <div className="choice__list">
                    <p className="delete__text">Вы действительно хотите удалить {delName}?</p>
                    <div className="delete__confirmation">
                        <button className="choice__btn"
                            onClick={() => {
                                axios.delete(`/api/quiz/update_theme/${delTheme}`, { headers: myHeaders }).then(response => {
                                    getThemes(params.id);
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
            <div className="theme__block">
                <h1 className="theme__header">Конструктор квиза</h1>
                <div className="theme__container">
                    <div className="theme__list">
                        <Link to="/constructor/choice" className="back" ></Link>
                        {themes.map(theme => {
                            const rowColor = findThemeColor(theme.round)
                            const btnStyle = {
                                color: rowColor,
                            }
                            return (
                                <div className="obj__row" key={theme.id}>
                                    <FontAwesomeIcon style={btnStyle} className="upd__link faicon icon__round" icon={faBookmark} size="2x" />
                                    <Link draggable={true} id={theme.id}
                                        to={`/constructor/${params.id}/${theme.id}/questions`}
                                        onDragStart={(e) => {
                                            setDragElement(theme.id);
                                        }}
                                        onDragEnd={(e) => { e.preventDefault() }}
                                        onDragOver={(e) => {
                                            e.preventDefault();
                                        }}
                                        onDrop={(e) => changeThemeOrder(e)}
                                        onMouseOver={(e) => {
                                            e.target.style.color = rowColor
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.color = "#252525"
                                        }}
                                        className="theme__item" onClick={themeDetail}>{theme.name}</Link>
                                    <Link className="upd__link icon__edit" to={`/constructor/${params.id}/${theme.id}/update`}>
                                        <FontAwesomeIcon className="faicon" icon={faEdit} size="2x" />
                                    </Link>
                                    <FontAwesomeIcon className="upd__link faicon icon__trash" icon={faTrash} size="2x"
                                    onClick={() => {
                                        setDelName(theme.name);
                                        setDelTheme(theme.id);
                                        setConfirmation(true);
                                    }}/>
                                </div>
                            )
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
            </div >
        )
    }
}

export default ThemesList