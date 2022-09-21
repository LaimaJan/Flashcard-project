const addNewFlashcard = document.querySelector(".create-card-btn");
const cancelCreateNewCardIcon = document.querySelector(".fa-xmark");
const addNewQuestion = document.querySelector("#add-new-btn");
const questionInput = document.querySelector("#create-card-div-info-question");
const answerInput = document.querySelector("#create-card-div-info-answer");
const hintInput = document.querySelector("#create-card-div-info-hint");
const createNewCardDiv = document.querySelector(".create-card-div");
const flashcardHolder = document.querySelector(".new-card-holder");

let flashcardsInfo = JSON.parse(localStorage.getItem("newFlascards")) || [];

displayFlashcards();
// function renewData() {
// 	localStorage.setItem("newFlascards", JSON.stringify(flashcardsInfo));
// }

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

	// renewData();
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
			const flashcardInfoDiv = document.createElement("div");
			flashcardInfoDiv.setAttribute("class", "flashcardInfoDiv");

			const flashcardButtonHolder = document.createElement("div");
			flashcardButtonHolder.setAttribute("class", "flashcardButtonHolder");

			const questionLabel = document.createElement("p");
			questionLabel.innerHTML = "Question:";
			questionLabel.setAttribute("class", "questionLabel");

			const questionHolder = document.createElement(
				flashcard.editingText ? "input" : "p"
			);
			questionHolder.setAttribute("class", "questionHolder");

			const answerLabel = document.createElement("p");
			answerLabel.innerHTML = "Answer:";
			answerLabel.setAttribute("class", "answerLabel");
			const answerHolder = document.createElement(
				flashcard.editingText ? "input" : "p"
			);
			answerHolder.classList.add("answerHolder", "hide");

			const hintLabel = document.createElement("p");
			hintLabel.innerHTML = "Hint:";
			hintLabel.setAttribute("class", "hintLabel");
			const hintHolder = document.createElement(
				flashcard.editingText ? "input" : "p"
			);
			hintHolder.classList.add("hintHolder", "hide");

			const cardDeleteBtn = document.createElement("button");
			cardDeleteBtn.setAttribute("class", "cardDeleteBtn");
			cardDeleteBtn.textContent = "Delete Card";
			cardDeleteBtn.addEventListener("click", () => {
				flashcardsInfo.splice(index, 1);
				flashcardInfoDiv.remove();

				console.log("DeleteBtn is working!");
				// renewData();
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

			// const cardEditBtn = document.createElement("button");
			const cardEditBtn = document.createElement("button");
			// cardEditBtn.innerHTML = "fa-solid fa-trash-can";
			// cardEditBtn.setAttribute("class", "fa-solid fa-trash-can");
			cardEditBtn.setAttribute("class", "cardEditBtn");
			cardEditBtn.textContent = flashcard.editingText ? "Save" : "Edit Card";

			cardEditBtn.addEventListener("click", () => {
				if (flashcard.editingText) {
					flashcardsInfo[index].question = questionHolder.value;
					flashcardsInfo[index].answer = answerHolder.value;
					flashcardsInfo[index].hint = hintHolder.value;
				}

				flashcardsInfo[index].editingText = !flashcardsInfo[index].editingText;

				console.log("EditBtn is working!");
				// renewData();
				localStorage.setItem("newFlascards", JSON.stringify(flashcardsInfo));

				displayFlashcards();
			});

			// Toggle the answer
			let linkAnswer = document.createElement("a");
			linkAnswer.setAttribute("href", "#");
			linkAnswer.setAttribute("class", "show-hide-btn");
			linkAnswer.innerHTML = "Show/Hide";
			linkAnswer.addEventListener("click", () => {
				answerHolder.classList.toggle("hide");
			});
			//Toggle the hint
			let linkHint = document.createElement("a");
			linkHint.setAttribute("href", "#");
			linkHint.setAttribute("class", "show-hide-btn");
			linkHint.innerHTML = "Show/Hide";
			linkHint.addEventListener("click", () => {
				hintHolder.classList.toggle("hide");
			});

			//  Right answer - wrong answer

			flashcardButtonHolder.append(cardDeleteBtn, cardEditBtn);

			flashcardInfoDiv.append(
				questionLabel,
				questionHolder,
				answerLabel,
				linkAnswer,
				answerHolder,
				hintLabel,
				linkHint,
				hintHolder,
				flashcardButtonHolder
			);

			flashcardHolder.append(flashcardInfoDiv);
		});
}

// function cardsGame() {}
