import './menu.css';
import { Link } from 'react-router-dom'

const Menu = () => {

    return (
        <ul className="menu">
            <Link className="menu__item-link" to="/"><li className="menu__item">Home</li></Link>
            {/* <Link className="menu__item-link" to=""><li className="menu__item">Quiz List</li></Link> */}
            {/* <Link className="menu__item-link" to="/create-form"><li className="menu__item">Create Quiz</li></Link>
            <Link className="menu__item-link" to=""><li className="menu__item">Top Scorers</li></Link> */}
        </ul>
    )
};


export default Menu;