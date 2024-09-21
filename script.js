let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// JSONファイルを読み込む関数
function loadQuestions(callback) {
    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            callback();
        })
        .catch(error => console.error('JSONの読み込みに失敗しました:', error));
}

// URLからクエリパラメータを取得する関数
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// クイズ画面の問題をロードする
function loadQuiz() {
    if (document.getElementById('questionText')) {
        loadQuestions(() => {
            // クエリパラメータから問題番号を取得
            const questionIndex = getQueryParam('questionIndex');
            if (questionIndex !== null) {
                currentQuestionIndex = parseInt(questionIndex);
                loadSingleQuestion(currentQuestionIndex);
            } else {
                loadQuestion();
            }
        });
    }
}

// 特定の問題を表示する関数
function loadSingleQuestion(index) {
    const currentQuestion = questions[index];
    document.getElementById('questionText').textContent = currentQuestion.question;
    document.getElementById('result').textContent = '';
}

// 全体の問題から次の問題を表示する
function loadQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('questionText').textContent = currentQuestion.question;
    document.getElementById('result').textContent = '';
    document.getElementById('nextButton').style.display = 'none';
}

// 答えを確認する関数
function checkAnswer(answer) {
    const currentQuestion = questions[currentQuestionIndex];
    let resultText = '';

    if (answer === currentQuestion.correct) {
        resultText = '正解！';
        document.getElementById('result').style.color = 'green';
        score++;
    } else {
        resultText = '不正解！';
        document.getElementById('result').style.color = 'red';
    }

    document.getElementById('result').textContent = resultText;
    document.getElementById('nextButton').style.display = 'inline-block';

    currentQuestionIndex++;
}

// ○ボタンをクリックしたときの処理
if (document.getElementById('trueButton')) {
    document.getElementById('trueButton').addEventListener('click', () => {
        checkAnswer(true);
    });
}

// ×ボタンをクリックしたときの処理
if (document.getElementById('falseButton')) {
    document.getElementById('falseButton').addEventListener('click', () => {
        checkAnswer(false);
    });
}

// 次の問題を表示する
if (document.getElementById('nextButton')) {
    document.getElementById('nextButton').addEventListener('click', () => {
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            document.getElementById('result').textContent = `クイズ終了！スコア: ${score}/${questions.length}`;
            document.getElementById('nextButton').style.display = 'none';
        }
    });
}

// 問題一覧を表示する関数
function loadQuestionList() {
    if (document.getElementById('questionList')) {
        loadQuestions(() => {
            const questionList = document.getElementById('questionList');
            questionList.innerHTML = '';
            questions.forEach((question, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}: ${question.question}`;
                listItem.addEventListener('click', () => {
                    // クイズページに問題番号を渡すためのリンク
                    location.href = `quiz.html?questionIndex=${index}`;
                });
                questionList.appendChild(listItem);
            });
        });
    }
}

// クイズページでの処理を開始
if (window.location.pathname.includes('quiz.html')) {
    loadQuiz();
}

// 問題一覧ページでの処理を開始
if (window.location.pathname.includes('question-list.html')) {
    loadQuestionList();
}
