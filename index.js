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
const endGameBtn = document.querySelector(".end-game-btn");

let flashcardsInfo = JSON.parse(localStorage.getItem("newFlashcards")) || [];

displayFlashcards();

let i = 0;
let m = 0;

let addingNewCard = false;

addNewFlashcard.addEventListener("click", function showCard() {
	document
		.querySelectorAll(".guessedCardsNumberDiv")
		.forEach((el) => el.remove());

	if (!addingNewCard) {
		addingNewCard = true;
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

	localStorage.setItem("newFlashcards", JSON.stringify(flashcardsInfo));

	addingNewCard = false;
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

				localStorage.setItem("newFlashcards", JSON.stringify(flashcardsInfo));
				displayFlashcards();
			});

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

				localStorage.setItem("newFlashcards", JSON.stringify(flashcardsInfo));

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
			rightAnswerButton.innerHTML = `<i class="fa-regular fa-circle-check right"></i>`;

			const wrongAnswerButton = generateObjectElement(
				"button",
				"wrongAnswerButton"
			);
			wrongAnswerButton.innerHTML = `<i class="fa-regular fa-circle-xmark wrong"></i>`;

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

	let newFlashcard = document.getElementsByClassName("flashcardInfoDiv");
	const wrongBtn = document.querySelectorAll(".wrong");

	wrongBtn.forEach((elem, index) => {
		elem.addEventListener("click", function () {
			i++;
			const outOfWrongCards = document.querySelector(".outOfWrongCards");
			outOfWrongCards.textContent = `${i}`;

			newFlashcard[index].style.backgroundColor = "rgb(240, 84, 84)";
			rightWrongBtnDiv[index].style.display = "none";
		});
	});

	const rightBtn = document.querySelectorAll(".right");
	rightBtn.forEach((elem, index) => {
		elem.addEventListener("click", function () {
			m++;
			const outOfRightsCards = document.querySelector(".outOfRightsCards");
			outOfRightsCards.innerHTML = `${m}`;

			newFlashcard[index].style.backgroundColor = "rgb(103, 198, 103)";
			rightWrongBtnDiv[index].style.display = "none";
		});
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
const guessedCards = document.querySelector(".guessed-cards");

startBtn.addEventListener("click", function startGame() {
	i = 0;
	m = 0;

	Array.from(rightWrongBtnDiv).forEach((el) => {
		el.style.display = "block";
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

	let guessedCardsNumberDiv = generateObjectElement(
		"div",
		"guessedCardsNumberDiv"
	);

	let outOfAllCards = generateObjectElement(
		"p",
		"outOfAllCards",
		`${createdFlashcardsNumber}`
	);

	let outOfRightsCards = generateObjectElement("p", "outOfRightsCards", `${m}`);

	let outOfWrongCards = generateObjectElement("p", "outOfWrongCards", `${i}`);

	let allCardsNumber = generateObjectElement("p", "allCardsNumber", `Out of:`);
	let answeredCardsNumber = generateObjectElement(
		"p",
		"answeredCardsNumber",
		"Answered right:"
	);
	let wrongCardsNumber = generateObjectElement(
		"p",
		"wrongCardsNumber",
		"Answered wrong:"
	);

	guessedCardsNumberDiv.append(
		allCardsNumber,
		outOfAllCards,
		answeredCardsNumber,
		outOfRightsCards,
		wrongCardsNumber,
		outOfWrongCards
	);

	guessedCards.append(guessedCardsNumberDiv);

	startBtn.style.visibility = "hidden";
});

let newFlashcard = document.getElementsByClassName("flashcardInfoDiv");

resetBtn.addEventListener("click", function resetGame() {
	const outOfRightsCards = document.querySelector(".outOfRightsCards");
	const outOfWrongCards = document.querySelector(".outOfWrongCards");
	const outOfAllCards = document.querySelector(".outOfAllCards");

	Array.from(newFlashcard).forEach((el, index) => {
		el.style.backgroundColor = "transparent";
		rightWrongBtnDiv[index].style.backgroundColor = "transparent";

		rightWrongBtnDiv[index].style.display = "block";
	});

	i = 0;
	m = 0;
	outOfRightsCards.textContent = `${m}`;
	outOfWrongCards.textContent = `${i}`;

	const createdFlashcardsNumber =
		flashcardHolder.getElementsByClassName("flashcardInfoDiv").length;

	outOfAllCards.innerHTML = `${createdFlashcardsNumber}`;
});

endGameBtn.addEventListener("click", function endGame() {
	document
		.querySelectorAll(".guessedCardsNumberDiv")
		.forEach((el) => el.remove());

	if (resetBtn.style.display === "none") {
		resetBtn.style.display = "block";
	} else {
		resetBtn.style.display = "none";
	}

	Array.from(rightWrongBtnDiv).forEach((el) => {
		el.style.display = "none";
	});

	startBtn.style.visibility = "visible";
	endGameBtn.style.display = "none";

	Array.from(newFlashcard).forEach((el, index) => {
		el.style.backgroundColor = "transparent";
		rightWrongBtnDiv[index].style.backgroundColor = "transparent";
	});
});
