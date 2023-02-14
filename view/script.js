let input, btn, p, container;
let questionObjects = [];
let questions;

const main = () => {
  prepareDOMElements();
  prepareDOMEvents();
};

const prepareDOMElements = () => {
  container = document.querySelector(".container");
  input = document.querySelector("input[type=file]");
  btn = document.querySelector("button");
  p = document.querySelector("p");
};

const prepareDOMEvents = () => {
  input.addEventListener("change", onInputFileChange);
  btn.addEventListener("click", confirmTestFile);
};

const onInputFileChange = () => {
  const [file] = input.files;
  if (file) p.innerText = file.name;
  else p.innerText = "Nie wybrałeś pliku!";
};

const confirmTestFile = () => {
  const [file] = input.files;
  if (!file) {
    p.innerText = "Wybierz plik do przesłania!";
    return;
  }
  const reader = new FileReader();
  console.log(file);
  reader.addEventListener("load", () => {
    // p.innerText = reader.result;
    questions = reader.result.split(/[0-9]+[.]/g);
    questions.shift();
    questions = questions.map((question, i) => `${i}.` + question);
    console.log(questions);
    questionsToObjects();
    console.log(questionObjects[1]);
    if (questionObjects.length > 0) {
      console.log(container);
      container.style.display = "none";
    }
  });
  reader.readAsText(file);

  console.log(questionObjects[3]);

  console.log(questionObjects);
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
    p.innerText = "Ups! Coś poszło nie tak...";
  }
};

document.addEventListener("DOMContentLoaded", main);
