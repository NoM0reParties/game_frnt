import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

const GameConnection = () => {
    const [players, setPlayers] = useState([]);
    let params = useParams();

    const link = `/game-proccess/${params.id}`
    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    };

    async function getPlayers() {
        axios.get(`/api/quiz/quiz_game_players?quiz_game_id=${params.id}`, { headers: myHeaders }).then((response) => {
            let data = response.data;
            console.log(data);
            if (data !== []) {
                setPlayers(data);
            }
        })
    };


    useEffect(() => {
        const updInterval = setInterval(() => {
            getPlayers();
        }, 5000)
        return () => clearInterval(updInterval);
    }, [])


    return (
        <div className="сhoice__block">
            <h1 className="form__header">Подключившиеся игроки</h1>
            <ul className="choice__list">
                <Link className="back" to="/" style={{ backgroundColor: "red" }}></Link>
                {players.map(player => {
                    return (<button id={player.id} key={player.id}
                        onClick={() => {}} className="choice__item">{player.name}</button>)
                }
                )}
                <Link className="choice__btn" to={link}
                style={{textDecoration: "none",
                display: "flex",
                alignItems: "center"}}
                onClick={() => {
                    axios.post('/api/quiz/start_game', { game_id: params.id }, { headers: myHeaders })
                }}>Начать игру</Link>
            </ul>
        </div>
    )
}

export default GameConnection;