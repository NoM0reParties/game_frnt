import { Link } from 'react-router-dom';
import './options.css';

const Options = () => {

    return (
        <ul className="options">
            <Link className="options__item-link" to="/player-connection"><li className="options__item">Присоединиться<br/>к игре</li></Link>
            <Link className="options__item-link" to="/game-list"><li className="options__item">Выбрать игру</li></Link>
            <Link className="options__item-link" to="/constructor/choice"><li className="options__item">Создать игру</li></Link>
        </ul>
    )
};


export default Options;