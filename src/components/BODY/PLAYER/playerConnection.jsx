import { useEffect, useState } from "react";
import { Redirect, useParams } from "react-router"
import { Link } from "react-router-dom";
import Cookies from 'js-cookie';

const PlayerConnection = () => {
    const [games, setGames] = useState([]);
    const [connected, setConnected] = useState(false);
    const [link, setLink] = useState(false);

    const CSRFToken = Cookies.get('csrftoken');

    const axios = require('axios');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    };

    async function getGames() {
        axios.get(`/api/quiz/games_available`, { headers: myHeaders }).then((response) => {
            let data = response.data;
            if (data !== []) {
                setGames(data);
            }
        })
    };

    async function connectToGame(game_id) {
        const payload = {
            game_id: game_id
        }

        axios.post(`/api/quiz/connect`, payload, { headers: myHeaders }).then((response) => {
            setLink(`/player-proccess/${game_id}`);
            setConnected(true);
        })
    };

    useEffect(() => {
        getGames();
    }, [])


    if (connected) {
        return <Redirect to={link} />
    } else {
        return (
            <div className="сhoice__block">
                <h1 className="form__header">Подключайся к игре</h1>
                <ul className="choice__list">
                    <Link className="back" to="/" style={{ backgroundColor: "red" }}></Link>
                    {games.map(game => {
                        return (<button id={game.id} key={game.id}
                            onClick={(e) => {
                                connectToGame(e.target.id)
                            }} className="choice__item">{game.name}</button>)
                    }
                    )}
                    <Link className="choice__btn" to={link}
                    style={{textDecoration: "none",
                    display: "flex",
                    alignItems: "center"}}
                    onClick={() => {
                    }}>Начать игру</Link>
                </ul>
            </div>
        )
    }
}

export default PlayerConnection;