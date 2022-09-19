const addNewFlashcard = document.querySelector(".create-card-btn");
const cancelCreateNewCardIcon = document.querySelector(".fa-circle-minus");
const addNewQuestion = document.querySelector("#add-new-btn");
const questionInput = document.querySelector("#create-card-div-info-question");
const answerInput = document.querySelector("#create-card-div-info-answer");
const hintInput = document.querySelector("#create-card-div-info-hint");
const createNewCardDiv = document.querySelector(".create-card-div");
const flashcardHolder = document.querySelector(".new-card-holder");

let flashcardsInfo = [];

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
		// addNewFlashcard.innerHTML = "Return to flashcards";
	} else {
		createNewCardDiv.style.display = "none";
		// addNewFlashcard.innerHTML = "Add new flashcard";
	}
});

cancelCreateNewCardIcon.addEventListener("click", function cancelCard() {
	if (createNewCardDiv.style.display === "block") {
		createNewCardDiv.style.display = "none";
	} else {
		createNewCardDiv.style.display = "block";
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
	} else {
		createNewCardDiv.style.display = "block";
	}

	// renewData();
	localStorage.setItem("newFlascards", JSON.stringify(flashcardsInfo));
	displayFlashcards();
});

function displayFlashcards() {
	let flashcardsInfo = JSON.parse(localStorage.getItem("newFlascards")) || [];
	console.log(flashcardsInfo);

	flashcardsInfo
		.filter((flashcard) => {
			return flashcard.question || flashcard.answer || flashcard.hint;
		})
		.forEach((flashcard, index) => {
			const flashcardInfoDiv = document.createElement("div");
			flashcardInfoDiv.setAttribute("class", "flashcardInfoDiv");

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

			if (flashcard.editingText) {
				questionHolder.value = flashcard.question;
				answerHolder.value = flashcard.answer;
				hintHolder.value = flashcard.hint;
			} else {
				questionHolder.textContent = flashcard.question;
				answerHolder.textContent = flashcard.answer;
				hintHolder.textContent = flashcard.hint;
			}

			const cardEditBtn = document.createElement("button");
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

			flashcardInfoDiv.append(
				questionLabel,
				questionHolder,
				answerLabel,
				linkAnswer,
				answerHolder,
				hintLabel,
				linkHint,
				hintHolder,
				cardDeleteBtn,
				cardEditBtn
			);

			flashcardHolder.append(flashcardInfoDiv);
		});
}
