const inputName = document.getElementById("input-name");
const inputCardNum = document.getElementById("input-card-num");
const inputExpDateMonth = document.getElementById("input-exp-date--month");
const inputExpDateYear = document.getElementById("input-exp-date--year");
const inputCvc = document.getElementById("input-cvc");
const confirmBtn = document.getElementById("confirm-btn");
const continueBtn = document.getElementById("continue-btn");
const allInputs = document.querySelectorAll(".form-group input");

const d = new Date();
let year = d.getFullYear();
let month = d.getMonth();

confirmBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (validateInputs()) {
    const formState = document.getElementById("form-state");
    const successState = document.getElementById("success-state");

    formState.classList.add("hidden");
    successState.classList.remove("hidden");
  }
});

const validateInputs = () => {
  let isValidForm = true;
  let isValidDate = true;
  const inputNameValue = inputName.value.trim();
  const inputCardNumValue = inputCardNum.value.trim();
  const inputExpDateMonthValue = inputExpDateMonth.value.trim();
  const inputExpDateYearValue = inputExpDateYear.value.trim();
  const inputCvcValue = inputCvc.value.trim();

  if (inputNameValue === "") {
    showError(inputName, "Can't be blank");
    isValidForm = false;
  }

  if (inputCardNumValue === "") {
    showError(inputCardNum, "Can't be blank");
    isValidForm = false;
  } else if (inputCardNumValue.length < 19) {
    showError(inputCardNum, "Must be 16 characters long");
    isValidForm = false;
  } else if (isValidCardNum(inputCardNumValue)) {
    showError(inputCardNum, "Wrong format, numbers only");
    isValidForm = false;
  }

  if (inputExpDateMonthValue === "") {
    showError(inputExpDateMonth, "Can't be blank");
    isValidForm = false;
    isValidDate = false;
  } else if (inputExpDateMonthValue < 1 || inputExpDateMonthValue > 12) {
    showError(inputExpDateMonth, "Invalid month");
    isValidForm = false;
    isValidDate = false;
  }

  if (inputExpDateYearValue === "") {
    showError(inputExpDateYear, "Can't be blank");
    isValidForm = false;
    isValidDate = false;
  }

  if (isValidDate) {
    var date_1 = new Date(year, month);
    var date_2 = new Date(`20${inputExpDateYearValue}`, inputExpDateMonthValue);

    if (date_1.getTime() >= date_2.getTime()) {
      [inputExpDateMonth, inputExpDateYear].forEach((element) => {
        element.classList.add("error-state");
      });

      showError(inputExpDateMonth, "Expired date");
      isValidForm = false;
    }
  }

  if (inputCvcValue === "") {
    showError(inputCvc, "Can't be blank");
    isValidForm = false;
  } else if (inputCvcValue.length < 3) {
    showError(inputCvc, "Must be 3 characters long");
    isValidForm = false;
  }

  updateOutputs(
    inputNameValue,
    inputCardNumValue,
    inputExpDateMonthValue,
    inputExpDateYearValue,
    inputCvcValue
  );

  return isValidForm;
};

const showError = (element, message) => {
  const formGroup = element.parentElement;
  const errorMsgSpan = formGroup.querySelector(`.error-msg`);

  errorMsgSpan.textContent = message;
  element.classList.add("error-state");
};

const isValidCardNum = (inputValue) => {
  const regex = /[^\s\d]/g;
  return regex.test(inputValue);
};

const updateOutputs = (
  nameValue,
  cardValue,
  expDateMonthValue,
  expDateYearValue,
  cvcValue
) => {
  const cardFrontCardName = document.getElementById("card-front--card-name");
  const cardFrontCardNum = document.getElementById("card-front--card-number");
  const cardFrontCardExpDate = document.getElementById(
    "card-front--card-exp-date"
  );
  const cardBackCvc = document.getElementById("card-back--card-cvc");

  if (nameValue !== "") cardFrontCardName.textContent = nameValue.toUpperCase();
  if (cardValue !== "") cardFrontCardNum.textContent = cardValue.toUpperCase();
  if (expDateMonthValue && expDateYearValue !== "")
    cardFrontCardExpDate.textContent = `${expDateMonthValue}/${expDateYearValue}`;
  if (cvcValue !== "") cardBackCvc.textContent = cvcValue;
};

//format card number
inputCardNum.addEventListener(
  "input",
  () =>
    (inputCardNum.value = formatCardNumber(
      inputCardNum.value.replaceAll(" ", "")
    ))
);

const formatCardNumber = (cardNumber) =>
  cardNumber.split("").reduce((acc, num, index) => {
    if (index !== 0 && !(index % 4)) acc += " ";
    return acc + num;
  }, "");

allInputs.forEach((element) => {
  element.addEventListener("input", () => {
    const formGroup = element.parentElement;
    const elementsWithError = formGroup.querySelectorAll("input.error-state");
    const errorMsgSpan = formGroup.querySelector(`.error-msg`);

    errorMsgSpan.textContent = "";
    elementsWithError.forEach((element) => {
      element.classList.remove("error-state");
    });
  });
});

continueBtn.addEventListener("click", () => {
  location.reload();
});

//format exp date
[inputExpDateMonth, inputExpDateYear].forEach((item) => {
  item.addEventListener("change", () => formatExpDate(item));
});

const formatExpDate = (expDate) => {
  if (expDate.value.length === 1) expDate.value = `0${expDate.value}`;
};

//prevent keypress
[inputExpDateMonth, inputExpDateYear, inputCvc].forEach((item) => {
  item.addEventListener("keypress", (e) => {
    const allowedCharsRegex = /[0-9]+/;
    if (!allowedCharsRegex.test(e.key)) {
      e.preventDefault();
    }
  });
});
