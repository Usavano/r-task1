const popUpWinCreate = document.querySelector('.popUpWin-create');

function openPopUpWinCreate() {
  popUpWinCreate.classList.add('active');

  const closeBtn = popUpWinCreate.querySelector('.popUpWinCreate-closeBtn');
  closeBtn.addEventListener('click', () => {
    popUpWinCreate.classList.remove('active');
  });
}

// Функция, которая возвращает промис с данными после заполнения формы
function handlePopUpWinCreate() {
  return new Promise((resolve, reject) => {
    const submitBtn = popUpWinCreate.querySelector('.noteCreateForm-btn');

    submitBtn.addEventListener('click', (event) => {
      event.preventDefault();

      const inputNameVal = popUpWinCreate.querySelector('.noteNameInput').value;
      const selectCategoryVal =
        popUpWinCreate.querySelector('.noteCategoryList').value;
      const textContentVal =
        popUpWinCreate.querySelector('.noteContentArea').value;
      const currentDate = new Date();

      const newNoteObj = {
        name: inputNameVal,
        date: currentDate,
        category: selectCategoryVal,
        content: textContentVal,
        archiveStatus: false,
      };

      if (inputNameVal && selectCategoryVal) {
        resolve(newNoteObj);
        popUpWinCreate.classList.remove('active');
      }
    });
  });
}

function nullInputs() {
  popUpWinCreate.querySelector('.noteNameInput').value = '';
  popUpWinCreate.querySelector('.noteCategoryList').value = 'task';
  popUpWinCreate.querySelector('.noteContentArea').value = '';
}

export { openPopUpWinCreate, handlePopUpWinCreate, nullInputs };
