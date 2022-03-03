const UPDATE_CURRENT_QUESTION =
    'scratch-gui/current-question/UPDATE_CURRENT_QUESTION';
const UPDATE_KEY_CURRENT_QUESTION =
    'scratch-gui/current-question/UPDATE_KEY_CURRENT_QUESTION';

const updateCurrentQuestion = question => ({
    type: UPDATE_CURRENT_QUESTION,
    question,
});

const updateKeyCurrentQuestion = key => ({
    type: UPDATE_KEY_CURRENT_QUESTION,
    key,
});

const initialState = {
    questionData: {},
    key: '',
    courseId: '',
    lessonId: '',
    questionId: '',
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case UPDATE_CURRENT_QUESTION:
            return Object.assign({}, state, {
                questionData:
                    action.question && action.question.questionData
                        ? action.question.questionData
                        : {},
                courseId:
                    action.question && action.question.courseId
                        ? action.question.courseId
                        : '',
                lessonId:
                    action.question && action.question.lessonId
                        ? action.question.lessonId
                        : '',
                questionId:
                    action.question && action.question.questionId
                        ? action.question.questionId
                        : '',
            });
        case UPDATE_KEY_CURRENT_QUESTION:
            return Object.assign({}, state, {
                key: action.key,
            });
        default:
            return state;
    }
};

export {
    reducer as default,
    initialState as currentQuestionInitialState,
    updateCurrentQuestion,
    updateKeyCurrentQuestion,
};
