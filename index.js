const addNewFlashcard = document.querySelector(".create-card-btn");
const cancelCreateNewCardIcon = document.querySelector(".fa-xmark");
const addNewQuestion = document.querySelector("#add-new-btn");
const questionInput = document.querySelector("#create-card-div-info-question");
const answerInput = document.querySelector("#create-card-div-info-answer");
const hintInput = document.querySelector("#create-card-div-info-hint");
const createNewCardDiv = document.querySelector(".create-card-div");
const flashcardHolder = document.querySelector(".new-card-holder");
const startBtn = document.querySelector(".start-game-btn");
const resetBtn = document.querySelector(".reset-btn");
const allCardsNumber = document.querySelector(".all-card-number");
const answeredCardNumber = document.querySelector(".answered-cards-number");
const wrongCardNumber = document.querySelector(".wrong-cards-number");
const endGameBtn = document.querySelector(".end-game-btn");

let flashcardsInfo = JSON.parse(localStorage.getItem("newFlascards")) || [];

displayFlashcards();

addNewFlashcard.addEventListener("click", function showCard() {
	console.log(`display of createNewCard: ${createNewCardDiv.style.display}`);

	if (createNewCardDiv.style.display === "none") {
		createNewCardDiv.style.display = "block";
		questionInput.value = " ";
		answerInput.value = " ";
		hintInput.value = " ";
	} else {
		createNewCardDiv.style.display = "none";
	}

	if (resetBtn.style.display === "block") {
		resetBtn.style.display = "none";
	}

	Array.from(rightWrongBtnDiv).forEach((el) => {
		el.style.display = "none";
	});

	allCardsNumber.style.display = "none";
	answeredCardNumber.style.display = "none";
	wrongCardNumber.style.display = "none";

	startBtn.style.visibility = "visible";
	endGameBtn.style.display = "none";

	Array.from(newFlashcard).forEach((el, index) => {
		el.style.backgroundColor = "transparent";
		rightWrongBtnDiv[index].style.backgroundColor = "transparent";
	});
});

cancelCreateNewCardIcon.addEventListener("click", function cancelCard() {
	if (createNewCardDiv.style.display === "block") {
		createNewCardDiv.style.display = "none";
	}
});

createNewCardDiv.addEventListener("submit", (e) => {
	console.log("Submit BTN is  working!");
	e.preventDefault();

	const formData = new FormData(e.target);
	let ourQuestions = Object.assign(Object.fromEntries(formData), {
		editingText: false,
	});

	flashcardsInfo = flashcardsInfo.concat(ourQuestions);

	e.target.reset();

	if (createNewCardDiv.style.display === "block") {
		createNewCardDiv.style.display = "none";
	}

	localStorage.setItem("newFlascards", JSON.stringify(flashcardsInfo));
	displayFlashcards();
});

function displayFlashcards() {
	document.querySelectorAll(".flashcardInfoDiv").forEach((el) => el.remove());

	flashcardsInfo
		.filter((flashcard) => {
			return flashcard.question || flashcard.answer || flashcard.hint;
		})
		.forEach((flashcard, index) => {
			const flashcardInfoDiv = generateObjectElement("div", "flashcardInfoDiv");

			const flashcardButtonHolder = generateObjectElement(
				"div",
				"flashcardButtonHolder"
			);

			const questionLabel = generateObjectElement(
				"p",
				"questionLabel",
				"Question:"
			);

			const questionHolder = generateObjectElement(
				flashcard.editingText ? "input" : "p",
				"questionHolder"
			);

			const answerLabel = generateObjectElement("p", "answerLabel", "Answer:");

			const answerHolder = document.createElement(
				flashcard.editingText ? "input" : "p"
			);
			answerHolder.classList.add("answerHolder", "hide");

			const hintLabel = generateObjectElement("p", "hintLabel", "Hint:");

			const hintHolder = document.createElement(
				flashcard.editingText ? "input" : "p"
			);
			hintHolder.classList.add("hintHolder", "hide");

			const cardDeleteBtn = generateObjectElement(
				"button",
				"cardDeleteBtn",
				"Delete Card"
			);
			cardDeleteBtn.addEventListener("click", () => {
				flashcardsInfo.splice(index, 1);
				flashcardInfoDiv.remove();

				console.log("DeleteBtn is working!");

				localStorage.setItem("newFlascards", JSON.stringify(flashcardsInfo));
				displayFlashcards();
			});

			console.log(flashcard.editingText);
			if (flashcard.editingText) {
				questionHolder.value = flashcard.question;
				answerHolder.value = flashcard.answer;
				hintHolder.value = flashcard.hint;
			} else {
				questionHolder.textContent = flashcard.question;
				answerHolder.textContent = flashcard.answer;
				hintHolder.textContent = flashcard.hint;
			}

			const cardEditBtn = generateObjectElement(
				"button",
				"cardEditBtn",
				flashcard.editingText ? "Save" : "Edit Card"
			);
			cardEditBtn.addEventListener("click", () => {
				if (flashcard.editingText) {
					flashcardsInfo[index].question = questionHolder.value;
					flashcardsInfo[index].answer = answerHolder.value;
					flashcardsInfo[index].hint = hintHolder.value;
				}

				flashcardsInfo[index].editingText = !flashcardsInfo[index].editingText;

				console.log("EditBtn is working!");
				localStorage.setItem("newFlascards", JSON.stringify(flashcardsInfo));

				displayFlashcards();
			});

			let linkAnswer = generateObjectElement("a", "show-hide-btn", "Show/Hide");
			linkAnswer.setAttribute("href", "#");
			linkAnswer.addEventListener("click", () => {
				answerHolder.classList.toggle("hide");
			});

			let linkHint = generateObjectElement("a", "show-hide-btn", "Show/Hide");
			linkHint.setAttribute("href", "#");
			linkHint.addEventListener("click", () => {
				hintHolder.classList.toggle("hide");
			});

			const rightWrongBtnDiv = generateObjectElement("div", "rightWrongBtnDiv");

			const rightAnswerButton = generateObjectElement(
				"button",
				"rightAnswerButton"
			);
			rightAnswerButton.innerHTML = `<i class="fa-regular fa-circle-xmark wrong"></i>`;

			const wrongAnswerButton = generateObjectElement(
				"button",
				"wrongAnswerButton"
			);
			wrongAnswerButton.innerHTML = `<i class="fa-regular fa-circle-check right"></i>`;

			flashcardButtonHolder.append(cardDeleteBtn, cardEditBtn);
			rightWrongBtnDiv.append(rightAnswerButton, wrongAnswerButton);

			flashcardInfoDiv.append(
				questionLabel,
				questionHolder,
				answerLabel,
				linkAnswer,
				answerHolder,
				hintLabel,
				linkHint,
				hintHolder,
				flashcardButtonHolder,
				rightWrongBtnDiv
			);

			flashcardHolder.append(flashcardInfoDiv);
		});
}

function generateObjectElement(selector, className, text) {
	const element = document.createElement(selector);
	element.classList.add(className);

	if (typeof text !== "undefined") {
		element.innerText = text;
	}

	return element;
}

const rightWrongBtnDiv = document.getElementsByClassName("rightWrongBtnDiv");
startBtn.addEventListener("click", function startGame() {
	console.log("StartBtn working");

	Array.from(rightWrongBtnDiv).forEach((el) => {
		el.style.display = "block";
		// console.log(el);
	});

	if (
		resetBtn.style.display === "block" ||
		endGameBtn.style.display === "block"
	) {
		resetBtn.style.display = "none";
		endGameBtn.style.display = "none";
	} else {
		resetBtn.style.display = "block";
		endGameBtn.style.display = "block";
	}

	const createdFlashcardsNumber =
		flashcardHolder.getElementsByClassName("flashcardInfoDiv").length;

	allCardsNumber.style.display = "block";
	answeredCardNumber.style.display = "block";
	wrongCardNumber.style.display = "block";

	allCardsNumber.innerHTML = `Out of: ${createdFlashcardsNumber}`;
	answeredCardNumber.innerHTML = `Answered right: 0`;
	wrongCardNumber.innerHTML = `Answered wrong: 0`;

	startBtn.style.visibility = "hidden";
});

let newFlashcard = document.getElementsByClassName("flashcardInfoDiv");
let i = 0;
const wrongBtn = document.querySelectorAll(".wrong");
wrongBtn.forEach((elem, index) => {
	elem.addEventListener("click", function () {
		i++;
		wrongCardNumber.innerHTML = `Answered wrong: ${i}`;

		newFlashcard[index].style.backgroundColor = "rgb(240, 84, 84)";
		rightWrongBtnDiv[index].style.display = "none";

		console.log(`Button WRONG is clicked ${index}`);
	});
});

let m = 0;
const rightBtn = document.querySelectorAll(".right");
rightBtn.forEach((elem, index) => {
	elem.addEventListener("click", function () {
		m++;
		answeredCardNumber.innerHTML = `Answered right: ${m}`;

		newFlashcard[index].style.backgroundColor = "rgb(103, 198, 103)";
		rightWrongBtnDiv[index].style.display = "none";

		console.log(`Button RIGHT is clicked ${index}`);
	});
});

resetBtn.addEventListener("click", function resetGame() {
	let newFlashcard = document.getElementsByClassName("flashcardInfoDiv");

	Array.from(newFlashcard).forEach((el, index) => {
		el.style.backgroundColor = "transparent";
		rightWrongBtnDiv[index].style.backgroundColor = "transparent";

		rightWrongBtnDiv[index].style.display = "block";
	});

	i = 0;
	m = 0;
	answeredCardNumber.innerHTML = `Answered right: ${m}`;
	wrongCardNumber.innerHTML = `Answered wrong: ${i}`;

	const createdFlashcardsNumber =
		flashcardHolder.getElementsByClassName("flashcardInfoDiv").length;

	allCardsNumber.innerHTML = `Out of: ${createdFlashcardsNumber}`;

	console.log(`Pressed reset btn is clicked`);
});

endGameBtn.addEventListener("click", function endGame() {
	console.log("End Game Btn working");

	if (resetBtn.style.display === "none") {
		resetBtn.style.display = "block";
	} else {
		resetBtn.style.display = "none";
	}

	Array.from(rightWrongBtnDiv).forEach((el) => {
		el.style.display = "none";
	});

	allCardsNumber.style.display = "none";
	answeredCardNumber.style.display = "none";
	wrongCardNumber.style.display = "none";

	startBtn.style.visibility = "visible";
	endGameBtn.style.display = "none";

	Array.from(newFlashcard).forEach((el, index) => {
		el.style.backgroundColor = "transparent";
		rightWrongBtnDiv[index].style.backgroundColor = "transparent";
	});
});
