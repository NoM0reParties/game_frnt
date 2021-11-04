import './home.css';
import { Redirect } from 'react-router';
import Options from './options/options.jsx'

const Home = ({ logged }) => {

    if (!logged) {
        return (
            <Redirect to="/login-form" />
        )
    }

    return (
        <div className="home">
            <h1 className="main__header">
                Своя игра
            </h1>
            <Options />
        </div>
    )
};


export default Home;