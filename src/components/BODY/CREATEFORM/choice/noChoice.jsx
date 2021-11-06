const NoChoice = ({ setCondition }) => {

    const quizCreate = () => {
        setCondition('quizCreate');
    };

    return (
        <div className="сhoice__block">
            <h1 className="form__header">Конструктор квиза</h1>
            <div className="choice__list">
                <p className="choice__empty">Вы ещё не создавали игр, самое время приступить!</p>
                <button className="choice__btn" onClick={quizCreate}>Создать квиз</button>
            </div>
        </div>
    )
}

export default NoChoice;