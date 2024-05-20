const startBtn = document.querySelector('.startBtn');
const exitBtn = document.querySelector('.exitBtn');
const continueBtn = document.querySelector('.continueBtn');
const main = document.querySelector('main');
const popupInfo = document.querySelector('.popup-info');
const questionsContainer = document.querySelector('.questionsContainer');
const queContent = document.querySelector('.que-content');
const quizExitBtn = document.querySelector('.quizExitBtn');
const quizNextBtn = document.querySelector('.quizNextBtn');
const options = document.querySelectorAll('.options');
const circle = document.querySelectorAll('.circle');

let questionsObj = [];
let score = 0;
let index = 0;

startBtn.addEventListener("click", () => {
    popupInfo.classList.add('active');
    main.classList.add('active');
});

exitBtn.addEventListener("click", () => {
    popupInfo.classList.remove('active');
    main.classList.remove('active');
});

quizExitBtn.addEventListener('click', () => {
    questionsContainer.classList.remove('active');
    main.classList.remove('active');
    questionsObj = [];
    score = 0;
});

continueBtn.addEventListener("click", () => {
    let amount = document.getElementById('amount').value;
    let category = document.getElementById('category').value;
    let difficulty = document.getElementById('difficulty').value;
    getQues(amount, category, difficulty);
    popupInfo.classList.remove('active');
});

quizNextBtn.addEventListener("click", () => {
    if(index < questionsObj.length) {
        queChange(questionsObj[index], index);
        index++;
    }
    else {
        alert(`Congo your score is : ${score}`);
        questionsContainer.classList.remove('active');
        main.classList.remove('active');
        index = 0;
        score = 0;
    }
});

async function getQues(amount, category, difficulty) {

    let promise = await fetch(`https://opentdb.com/api.php?amount=${String(amount)}&category=${String(category)}&difficulty=${difficulty}&type=multiple`);
    
    let jsonObj = await promise.json();

    questionsObj = [...jsonObj.results];    

    queChange(questionsObj[0], 0);
    index++;

    questionsContainer.classList.add('active');

}

function queChange(que, index) {

    Array.from(options).forEach(option => {
        option.style.borderColor = '#999';
    })

    let questionHeading = `Question ${Math.min(index+1,10)}`;
    let questionProblem = `${que.question}`;
    queContent.children[0].innerText = questionHeading;
    queContent.children[1].innerText = questionProblem;

    let answers = [...que.incorrect_answers, que.correct_answer];
    answers.sort(() => Math.random() - 0.5);
        
    Array.from(options).map((option, i) => option.innerHTML = `<p>${answers[i]}</p><span class="circle"></span>`);

    Array.from(options).forEach(option => {
        option.addEventListener('click', function(event) { 
            if(option.children[0].textContent === que.correct_answer) {
                score++;
                option.style.borderColor = 'green';
                option.children[1].style.backgroundColor = 'green';
                Array.from(options).forEach((option) => {option.removeEventListener('click', arguments.callee);});
            }
            else {
                option.style.borderColor = 'red';
                option.children[1].style.backgroundColor = 'red';
                Array.from(options).forEach((option) => {option.removeEventListener('click', arguments.callee);});
            }
        });
    });     

}


