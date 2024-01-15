const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

let startQuiz = () => {
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    showQuestion();
}

let resetState = () => {
    nextButton.style.display = "none";
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

let showQuestion = async () => {
    resetState();
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986");
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            throw new Error('No results found in the API response.');
        }
       
        const currentQuestion = data.results[0];
        console.log(currentQuestion);
        const options = [...currentQuestion.incorrect_answers, currentQuestion.correct_answer];
        options.sort(() => Math.random() - 0.5);

        // Decode the URL-encoded question
        const decodedQuestion = decodeURIComponent(currentQuestion.question);

        questionElement.innerHTML = decodedQuestion;

        options.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = decodeURIComponent(answer);
            button.classList.add("btn");
            answerButtons.appendChild(button);
            if (answer === currentQuestion.correct_answer) {
                button.dataset.correct = "true";
            }
            button.addEventListener("click", selectAnswer);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

let selectAnswer = (e) => {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        }
        button.disabled = true;
    });

    nextButton.style.display = "block";
}

let showScore = () => {
    resetState();
    questionElement.innerHTML = `You Scored ${score} out of ${currentQuestionIndex}!`;
    nextButton.innerHTML = "Play Again";
    nextButton.style.display = "block";
}

let handleNextButton = () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < 10) {
        setTimeout(showQuestion, 2000); 
    } else {
        showScore();
    }
}
nextButton.addEventListener("click", () => {
    if (currentQuestionIndex < 10) { 
        handleNextButton();
    } else {
        startQuiz();
    }
});

startQuiz();
