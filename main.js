"use strict";

const btns = document.querySelectorAll(".answerBtn");
const introBtn = document.querySelector("#introBtn");
const retestBtn = document.querySelector(".retest");

const test_containers = document.querySelector(".test-containers");
const introduction = document.querySelector(".introduction");
const containers = document.querySelectorAll(".test-container");

const result = document.querySelector(".result");
const type = document.querySelector(".type");
const loader = document.querySelector(".loader");

const durationTime = 300;
const loadingTime = 1500;

let scrolling_keyframes = [{ transform: null }, { transform: null }];
const scrolling_options = {
  duration: durationTime,
  fill: "forwards",
  easing: "ease-in",
};

const evaluationPoints = {
  "class-style": null,
  attendance: null,
  document: null,
  exam: null,
  report: null,
  participation: null,
};

let difficultyPoint = 2;

const answers = ["易", "やや易", "中", "やや難", "難"];
let count = 0;

introBtn.addEventListener("click", () => {
  introduction.classList.add("outview");
  containers.forEach((el) => {
    el.classList.add("inview");
  });
});

for (const btn of btns) {
  btn.addEventListener("click", () => {
    evaluationPoints[`${btn.classList[1]}`] = btn.value;

    if (count < 5) {
      invalidateBtn();
      changeQuestion();
      setTimeout(enableBtn, durationTime);
      count++;
    } else {
      calcPoint();
      deleteQuestion();
      loading();
      setTimeout(getResult, loadingTime);
    }
  });
}

retestBtn.addEventListener("click", () => {
  location.reload();
});

function invalidateBtn() {
  btns.forEach((el) => {
    el.disabled = true;
  });
}

function enableBtn() {
  btns.forEach((el) => {
    el.disabled = false;
  });
}

function changeQuestion() {
  for (const container of containers) {
    if (window.innerWidth < 600) {
      // from
      scrolling_keyframes[0].transform = `translateX(-${count * 100}vw)`;
      // to
      scrolling_keyframes[1].transform = `translateX(-${(count + 1) * 100}vw)`;
    } else {
      scrolling_keyframes[0].transform = `translateX(-${count * 600}px)`;
      scrolling_keyframes[1].transform = `translateX(-${(count + 1) * 600}px)`;
    }
    container.animate(scrolling_keyframes, scrolling_options);
  }
}

function deleteQuestion() {
  containers.forEach((el) => {
    el.remove();
  });
}

function loading() {
  loader.classList.add("inview");
  setTimeout(() => {
    loader.classList.remove("inview");
  }, loadingTime);
}

function getResult() {
  type.textContent = answers[difficultyPoint];
  result.classList.add("inview");
}

function calcPoint() {
  if (evaluationPoints["class-style"] === "online") {
    difficultyPoint--;
  }
  if (evaluationPoints.attendance) {
    difficultyPoint++;
  }
  if (!evaluationPoints.document) {
    difficultyPoint++;
  }

  const evaluationList = [
    evaluationPoints.exam,
    evaluationPoints.report,
    evaluationPoints.participation,
  ];

  switch (evaluationList.filter((element) => element !== "").length) {
    case 3:
      difficultyPoint += 2;
      break;
    case 2:
      if (!evaluationPoints.exam) {
        break;
      } else {
        difficultyPoint++;
        break;
      }
    case 1:
      if (evaluationPoints.exam) {
        difficultyPoint--;
        break;
      } else {
        difficultyPoint -= 2;
        break;
      }
  }
  if (difficultyPoint > 4) {
    difficultyPoint = 4;
  }
  if (difficultyPoint < 0) {
    difficultyPoint = 0;
  }
}
