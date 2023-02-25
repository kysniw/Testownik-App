let chooseFileInput,
  chooseFileBtn,
  chooseFileText,
  chooseFileContainer,
  questionTitle,
  questionContainer,
  answersField,
  buttonNext,
  buttonPrev;
let questionObjects = [];
let questions;
let questionIndex = 0;

const main = () => {
  prepareDOMElements();
  prepareDOMEvents();
};

const prepareDOMElements = () => {
  chooseFileContainer = document.querySelector(".choose-file");
  chooseFileInput = document.querySelector(".choose-file__input");
  chooseFileBtn = document.querySelector(".choose-file__button");
  chooseFileText = document.querySelector(".choose-file__text");
  questionContainer = document.querySelector(".exam-body");
  questionTitle = document.querySelector(".exam-body__question");
  answersField = document.querySelector(".exam-body__answers");
  buttonNext = document.querySelector(".exam-body__next");
  buttonPrev = document.querySelector(".exam-body__prev");
};

const prepareDOMEvents = () => {
  chooseFileInput.addEventListener("change", onInputFileChange);
  chooseFileBtn.addEventListener("click", confirmTestFile);
  buttonNext.addEventListener("click", nextQuestion);
};

const onInputFileChange = () => {
  const [file] = chooseFileInput.files;
  if (file) chooseFileText.innerText = file.name;
  else chooseFileText.innerText = "Nie wybrałeś pliku!";
};

const confirmTestFile = () => {
  const [file] = chooseFileInput.files;
  if (!file) {
    chooseFileText.innerText = "Wybierz plik do przesłania!";
    return;
  }
  const reader = new FileReader();
  console.log(file);
  reader.readAsText(file);
  reader.addEventListener("load", () => loadQuestions(reader));
  reader.addEventListener("loadend", loadEndQuestions);
};

const loadQuestions = async (reader) => {
  questions = reader.result.split(/[0-9]+[.]/g);
  questions.shift();
  questions = questions.map((question, i) => `${i}.` + question);

  questionsToObjects();
};

const loadEndQuestions = () => {
  console.log(questionObjects);

  if (questionObjects.length > 0) {
    chooseFileContainer.classList.add("hide");
    questionContainer.classList.remove("hide");

    loadQuestionContent(0);
  }
};

const questionsToObjects = () => {
  if (questions) {
    questions.forEach((question) => {
      let quest,
        ans = [],
        cAn;
      const lines = question.split(/\n/g);
      // console.log(lines);
      lines.forEach((line) => {
        if (line.match(/([0-9]+[.])/g)) {
          const i = line.indexOf(".");
          quest = line.slice(i + 1);
        } else if (line.match(/([a-g]+[.])/i)) {
          if (line.includes("^^")) {
            cAn = line.slice(2, -3);
            ans.push(cAn);
          } else ans.push(line.slice(2));
        }
      });
      questionObjects.push({ question: quest, corrAnswer: cAn, answers: ans });
    });
  } else {
    chooseFileText.innerText = "Ups! Coś poszło nie tak...";
  }
};

const loadQuestionContent = (questionNumber) => {
  answersField.innerHTML = "";
  questionTitle.textContent = questionObjects[questionNumber].question;

  questionObjects[questionNumber].answers.forEach((answer, index) => {
    const ans = `<div class="exam-body__answer-group">
    <input type="radio" name="answer" id="${index}" value="${answer}" />
    <label for="${index}">${answer}</label>
  </div>`;
    answersField.innerHTML += ans;
  });
};

const nextQuestion = () => {
  if (questionIndex < questionObjects.length - 1) {
    questionIndex++;
    loadQuestionContent(questionIndex);
  }
};

document.addEventListener("DOMContentLoaded", main);
