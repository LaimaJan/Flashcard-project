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
			rightAnswerButton.innerHTML = `<i class="fa-regular fa-circle-xmark"></i>`;

			const wrongAnswerButton = generateObjectElement(
				"button",
				"wrongAnswerButton"
			);
			wrongAnswerButton.innerHTML = `<i class="fa-regular fa-circle-check"></i>`;

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

startBtn.addEventListener("click", () => {
	const rightWrongBtnDiv = document.getElementsByClassName("rightWrongBtnDiv");
	console.log("StartBtn working");
	console.log(rightWrongBtnDiv);

	Array.from(rightWrongBtnDiv).forEach((v) =>
		v.addEventListener("click", function () {
			this.parentElement
				.getElementsByClassName("content")[0]
				.classList.toggle("hidden");
		})
	);
	// for (let i = 0; i < rightWrongBtnDiv.length; i++) {
	// 	console.log(rightWrongBtnDiv.length);
	// }
	// if (
	// 	resetBtn.style.display === "none" &&
	// 	rightWrongBtnDiv.style.display === "none"
	// ) {
	// 	resetBtn.style.display = "block";
	// 	rightWrongBtnDiv.style.display = "block";
	// } else {
	// 	resetBtn.style.display = "none";
	// 	rightWrongBtnDiv.style.display = "none";
	// }

	// if (
	// 	resetBtn.style.display === "none" &&
	// 	rightWrongBtnDiv.style.display === "none"
	// ) {
	// 	resetBtn.style.display = "block";
	// 	rightWrongBtnDiv.style.display = "block";
	// } else {
	// 	resetBtn.style.display = "none";
	// 	rightWrongBtnDiv.style.display = "none";
	// }

	const createdFlashcardsNumber =
		flashcardHolder.getElementsByClassName("flashcardInfoDiv").length;

	allCardsNumber.innerHTML = `Out of: ${createdFlashcardsNumber}`;
});

document.querySelector(".fa-circle-xmark").addEventListener("click", () => {
	console.log("XMARK ICON working");
	// let flashcardInfoDiv = document.querySelector(".flashcardInfoDiv");
});

document.querySelector(".fa-circle-check").addEventListener("click", () => {
	console.log("CHECK ICON working");
});
