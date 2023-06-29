
//Global variables
let questionCount = 0;
let score = {
  correct: [],
  wrong : [],
  
};

//To retrieve data from the JSON file
fetch('./quiz-data.json')
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('json', JSON.stringify(data));
    });

const data = JSON.parse(localStorage.getItem('json'));

//Generates buttons of the quizzes available
function chooseQuiz(data){
  for (i=0; i<data.movieQuiz.length;i++){
    document.querySelector('.js-choose').innerHTML += `<button class = "movie-quiz js-movie-quiz js-${i}-button" onclick = "quizChoice(${i}); erase(${i});">${data.movieQuiz[i].name}</button>`;
  
  }
}

chooseQuiz(data);

//Generates the questions and options the user has selected
function quizChoice(movieCount){
  
  document.querySelector('.js-answers').innerHTML = "";

  //To ensure all questions are displayed and cleared after submitting
  if(questionCount < data.movieQuiz[movieCount].questions.length){

    let question = data.movieQuiz[movieCount].questions[questionCount].question;

    document.querySelector('.js-questions').innerHTML = `${questionCount+1}) ${question}`;

    document.querySelector('.js-answers').innerHTML = '<select class="options js-options"></select>';

    //Populate the answers in a drop down
    for(j=0;j<data.movieQuiz[movieCount].questions[questionCount].answers.length;j++){

      let answer = data.movieQuiz[movieCount].questions[questionCount].answers[j].answer;
    
      document.querySelector('.js-options').innerHTML += `<option value=${j}>${answer}</option>`;
    }

  //submit button to run quizChoice function with next question and capture score
  document.querySelector('.js-submit').innerHTML = `<button class ="js-submit-button submit-button" onclick = "scoreTotal(${movieCount},${questionCount});quizChoice(${movieCount}); ${questionCount++}">Submit</button>`;

  } else {
  document.querySelector('.js-questions').innerHTML = "";
  document.querySelector('.js-submit').innerHTML = "";
  displayScore(movieCount);

}
  
}

//To capture score and user incorrect answered questions
function scoreTotal(movieCount,questionCount){
  let c = 0;
  let w = 0;
  let index = document.querySelector('.js-options').value;

  let chosenAnswer = data.movieQuiz[movieCount].questions[questionCount].answers[index];

  if (chosenAnswer.isCorrect === true){
    score.correct.push(questionCount);
  } else{
    score.wrong.push({
      question : questionCount,
      userAnswer : chosenAnswer['answer']
    });
  }
  
}

//Removes buttons and replaces it with a text of chosen quiz
function erase(i){
  document.querySelector('.js-choose').innerHTML = `<h2>${data.movieQuiz[i].name}</h2>`;
}

//displays the score and the incorrect answers with the correct answers
function displayScore(movieCount){
  let answerDS ="";

  document.querySelector('.js-score').innerHTML = `<h3>Your score is ${score.correct.length} out of ${score.correct.length+score.wrong.length}</h3><h4>Questions incorrect</h4>`;

  //to select the incorrect question
  for (let i=0; i<score.wrong.length;i++){
    let questionWrongDS = data.movieQuiz[movieCount].questions[score.wrong[i].question].question;
    
    //to find the correct answer for incorrect question
    for (let j=0; j<data.movieQuiz[movieCount].questions[score.wrong[i].question].answers.length; j++){

    let correctAnswerDS = data.movieQuiz[movieCount].questions[score.wrong[i].question].answers[j];
    
    if(correctAnswerDS.isCorrect === true){
      answerDS = correctAnswerDS.answer;
    }
  }
  //display the wrong question, user answer and correct answer.
  let num = i;
  document.querySelector('.js-score').innerHTML += `${num+=1}) ${questionWrongDS}<br>Your answer : ${score.wrong[i].userAnswer}<br>Correct Answer : ${answerDS}<br><br>`;
  }
  //creates reset button to take another quiz.
  document.querySelector('.js-score').innerHTML += `
  <button class="restart" onclick ="location.reload();chooseQuiz(data);">Choose a quiz</button>`;
}





