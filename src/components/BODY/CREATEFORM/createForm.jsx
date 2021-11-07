import { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import './createForm.css';
import MainForm from './mainForm/mainForm.jsx'
import ThemeForm from './themes/theme.jsx';
import QuestionForm from './questions/questions.jsx'
import Cookies from 'js-cookie';
import QuestionDetail from './questions/questionDetail/questionDetail'
import Choice from './choice/choice';
import ThemesList from './themes/themeList';
import QuestionsList from './questions/questionsList';
import UpdateQuiz from './mainForm/updateQuiz';
import UpdateTheme from './themes/updateTheme';
import QuestionUpdate from './questions/questionUpdate';

const CreateForm = () => {
    const [round, setRound] = useState(null)
    const CSRFToken = Cookies.get('csrftoken');

    const myHeaders = {
        'X-CSRFToken': CSRFToken
    };

    return (
        <Switch>
            <Route path="/constructor/choice">
                <Choice myHeaders={myHeaders} />
            </Route>
            <Route path="/constructor/quiz-create">
                <div className="create">
                    <h1 className="form__header">Создай Квиз</h1>
                    <div className="create__form">
                        <MainForm />
                    </div>
                </div>
            </Route>
            <Route path="/constructor/:id/update">
                <div className="create">
                    <h1 className="form__header">Редактирование</h1>
                    <div className="create__form">
                        <UpdateQuiz myHeaders={myHeaders} />
                    </div>
                </div>
            </Route>
            <Route path="/constructor/:id/themes">
                <ThemesList myHeaders={myHeaders} setRound={setRound} />
            </Route>
            <Route path="/constructor/:id/theme-create">
                <div className="create">
                    <h1 className="form__header">Создай тему</h1>
                    <div className="create__form">
                        <ThemeForm />
                    </div>
                </div>
            </Route>
            <Route path="/constructor/:id/:theme/update">
                <div className="create">
                    <h1 className="form__header">Редактирование</h1>
                    <div className="create__form">
                        <UpdateTheme myHeaders={myHeaders} />
                    </div>
                </div>
            </Route>
            <Route path="/constructor/:id/:theme/questions" >
                <QuestionsList myHeaders={myHeaders} round={round} />
            </Route>
            <Route path="/constructor/:id/:theme/update" >
                <QuestionsList myHeaders={myHeaders} round={round} />
            </Route>
            <Route path="/constructor/:id/:theme/question-create">
                <div className="create">
                    <h1 className="form__header">Новый вопрос</h1>
                    <div className="create__form">
                        <QuestionForm />
                    </div>
                </div>
            </Route>
            <Route path="/constructor/:id/:theme/:qid/detail">
                <div className="question__detail">
                    <h1 className="form__header">Предпросмотр вашего вопроса</h1>
                    <QuestionDetail />
                </div>
            </Route>
            <Route path="/constructor/:id/:theme/:qid/update">
                <div className="question__detail">
                    <h1 className="form__header">Редактирование</h1>
                    <QuestionUpdate />
                </div>
            </Route>
        </Switch>
    )
};


export default CreateForm;