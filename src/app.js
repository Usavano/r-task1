// ******IMPORTS****** //
import initialNotes from './modules/initialNotes.js';
import generate5Key from './modules/generateKey.js';
import months from './modules/monthesStorage.js';
import sliceLongText from './modules/sliceText.js';
import gatherDatesInText from './modules/gatherDatesInText.js';
import renderElement from './modules/renderElement.js';
import createStatArray from './modules/createStatArray.js';
import {
  openPopUpWinCreate,
  handlePopUpWinCreate,
  nullInputs,
} from './modules/PopUpWinCreate.js';
import infoRow from './modules/infoRow.js';

// ******VARIABLES****** //
let notesArray = [...initialNotes];
let notesAchivedArray = [];
let generalNotesArray = [];
let statArray = createStatArray(notesArray);
const queryMainTable = 'notesContainer';
const queryStatTable = 'statisticContainer';
const queryArchiveTable = 'notesArchiveContainer';
const createNoteBtn = document.querySelector('.createNoteBtn');
const popUpWinEdit = document.querySelector('.popUpWin-edit');
const editFormBtn = popUpWinEdit.querySelector('.editForm-btn');
let currentEditableElementKey = null;

// appoint keys to notes
notesArray.forEach((note) => (note.key = generate5Key()));

// ******EVENT LISTENERS****** //
document.addEventListener('DOMContentLoaded', () => {
  const renderNotes = renderData(queryMainTable, notesArray, createNote);
  renderNotes();

  const renderStats = renderData(queryStatTable, statArray, createStatRow);
  renderStats();

  const renderArchiveNotes = renderData(
    queryArchiveTable,
    notesAchivedArray,
    createArchiveNote
  );
  renderArchiveNotes();
});
createNoteBtn.addEventListener('click', () => {
  handleCreateNote();
});
editFormBtn.addEventListener('click', (event) => {
  handleEditNote(event);
});

// ******FUNCTIONS****** //
// creating single note
function createNote(noteObj) {
  const { key, name, date, category, content } = noteObj;

  const maxNameLength = 20;
  const maxContentLength = 25;
  const formatedName = sliceLongText(name, maxNameLength);
  const formatedContent = sliceLongText(content, maxContentLength);

  const innerDates = gatherDatesInText(content);

  const noteElement = document.createElement('tr');
  const attr = document.createAttribute('data-key');
  attr.value = key;
  noteElement.setAttributeNode(attr);

  noteElement.classList.add('note');

  noteElement.innerHTML = `
    <td class="noteName">${formatedName}</td>
    <td class="noteCreationDate">${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}</td>
    <td class="noteCategory">${
      category === 'randomThought' ? 'random thought' : category
    }</td>
    <td class="noteContent">${formatedContent}</td>
    <td class="noteDates">${innerDates}</td>
    <td class="noteActions">
        <button class="btnEdit">
            <i class="fa-solid fa-pen-to-square fa-xl"></i>
        </button>
        <button class="btnArchive">
            <i class="fa-solid fa-box-archive fa-xl"></i>
        </button>
        <button class="btnDelete">
            <i class="fa-solid fa-trash fa-xl"></i>
        </button>
    </td>`;

  const deleteBtn = noteElement.querySelector('.btnDelete');
  deleteBtn.addEventListener('click', (event) => {
    deleteNote(event);
  });
  const editBtn = noteElement.querySelector('.btnEdit');
  editBtn.addEventListener('click', (event) => {
    openEditPopUp(event);
  });
  const archiveBtn = noteElement.querySelector('.btnArchive');
  archiveBtn.addEventListener('click', (event) => {
    archiveNote(event);
  });

  return noteElement;
}
// creating single category stats
function createStatRow(categoryObj) {
  const { category, activeAmount, archivedAmount } = categoryObj;
  const statEl = document.createElement('tr');

  statEl.classList.add('category');

  statEl.innerHTML = `              
    <td class="categoryName">${category}</td>
    <td class="categoryActives">${activeAmount}</td>
    <td class="categoryArchived">${archivedAmount}</td>`;

  return statEl;
}
// creating single arhive note
function createArchiveNote(archNoteObj) {
  const { key, name, date, category, content } = archNoteObj;

  const maxNameLength = 20;
  const maxContentLength = 25;
  const formatedName = sliceLongText(name, maxNameLength);
  const formatedContent = sliceLongText(content, maxContentLength);

  const innerDates = gatherDatesInText(content);

  const noteArchiveElement = document.createElement('tr');
  const attr = document.createAttribute('data-key');
  attr.value = key;
  noteArchiveElement.setAttributeNode(attr);

  noteArchiveElement.classList.add('archiveNote');

  noteArchiveElement.innerHTML = `
    <td class="noteArchiveName td-archive">${formatedName}</td>
    <td class="noteArchiveCreationDate td-archive">${
      months[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}</td>
    <td class="noteArchiveCategory td-archive">${
      category === 'randomThought' ? 'random thought' : category
    }</td>
    <td class="noteArchiveContent td-archive">${formatedContent}</td>
    <td class="noteArchiveDates td-archive">${innerDates}</td>
    <td class="noteArchiveActions td-archive">
        <button class="btnUnarchive btn">Unarchive</button>
    </td>`;

  const unarchiveBtn = noteArchiveElement.querySelector('.btnUnarchive');
  unarchiveBtn.addEventListener('click', (event) => {
    unarchiveNote(event);
  });

  return noteArchiveElement;
}
// rendering data
function renderData(qContainer, data, createFn) {
  return () => {
    const dataContainer = document.querySelector(`.${qContainer}`);

    if (data.length === 0) {
      dataContainer.appendChild(infoRow.cloneNode(true));
    } else {
      data.forEach((obj) => {
        renderElement(dataContainer, obj, createFn);
      });
    }
  };
}
// handle delete Note
function deleteNote(e) {
  const parent = e.currentTarget.parentElement.parentElement;
  const parentKey = parent.getAttribute('data-key');

  const newNotesArray = notesArray.filter(
    (note) => note.key !== parseInt(parentKey)
  );
  notesArray = newNotesArray;

  generalNotesArray = generalNotesArray.filter(
    (note) => note.key !== parseInt(parentKey)
  );
  statArray =
    generalNotesArray.length > 0
      ? createStatArray(generalNotesArray)
      : createStatArray(notesArray);

  const updateMainTableData = updateDataOnPage(
    notesArray,
    queryMainTable,
    createNote
  );
  updateMainTableData();

  const updateStatTableData = updateDataOnPage(
    statArray,
    queryStatTable,
    createStatRow
  );
  updateStatTableData();
}
// open Edit Pop Up
function openEditPopUp(e) {
  const parent = e.currentTarget.parentElement.parentElement;
  currentEditableElementKey = parent.getAttribute('data-key');

  popUpWinEdit.classList.add('active');
  const closeBtn = popUpWinEdit.querySelector('.popUpWinEdit-closeBtn');
  closeBtn.addEventListener('click', () => {
    currentEditableElementKey = null;
    popUpWinEdit.classList.remove('active');
  });
  const certainNote = notesArray.find(
    (note) => note.key === parseInt(currentEditableElementKey)
  );

  const inputName = popUpWinEdit.querySelector('.editNameInput');
  const selectCategory = popUpWinEdit.querySelector('.editCategoryList');
  const textContent = popUpWinEdit.querySelector('.editContentArea');

  inputName.value = certainNote.name;
  selectCategory.value = certainNote.category;
  textContent.value = certainNote.content;
}
// handle edit Note
function handleEditNote(e) {
  e.preventDefault();
  const inputName = popUpWinEdit.querySelector('.editNameInput');
  const selectCategory = popUpWinEdit.querySelector('.editCategoryList');
  const textContent = popUpWinEdit.querySelector('.editContentArea');

  const inputNameVal = inputName.value;
  const selectCategoryVal = selectCategory.value;
  const textContentVal = textContent.value;

  const editNoteData = {
    name: inputNameVal,
    category: selectCategoryVal,
    content: textContentVal,
  };

  notesArray.forEach((note) => {
    if (note.key === parseInt(currentEditableElementKey)) {
      note.name = editNoteData.name;
      note.category = editNoteData.category;
      note.content = editNoteData.content;
    }
  });

  const updateMainTableData = updateDataOnPage(
    notesArray,
    queryMainTable,
    createNote
  );
  updateMainTableData();

  statArray =
    generalNotesArray.length > 0
      ? createStatArray(generalNotesArray)
      : createStatArray(notesArray);

  const updateStatTableData = updateDataOnPage(
    statArray,
    queryStatTable,
    createStatRow
  );
  updateStatTableData();

  popUpWinEdit.classList.remove('active');
}
// handle archive Note
function archiveNote(e) {
  const parent = e.currentTarget.parentElement.parentElement;
  const parentKey = parent.getAttribute('data-key');
  notesArray.forEach((note) => {
    if (note.key === parseInt(parentKey)) {
      note.archiveStatus = true;
    }
  });

  const notesActiveArray = notesArray.filter((note) => {
    if (!note.archiveStatus) {
      return note;
    } else {
      notesAchivedArray.push(note);
    }
  });

  notesArray = notesActiveArray;
  const updateMainTableData = updateDataOnPage(
    notesArray,
    queryMainTable,
    createNote
  );
  updateMainTableData();

  const updateArchiveTableData = updateDataOnPage(
    notesAchivedArray,
    queryArchiveTable,
    createArchiveNote
  );
  updateArchiveTableData();

  generalNotesArray = notesArray.concat(notesAchivedArray);
  statArray = createStatArray(generalNotesArray);
  const updateStatTableData = updateDataOnPage(
    statArray,
    queryStatTable,
    createStatRow
  );
  updateStatTableData();
}
// handle unarchive Note
function unarchiveNote(e) {
  const parent = e.currentTarget.parentElement.parentElement;
  const parentKey = parent.getAttribute('data-key');
  notesAchivedArray.forEach((note) => {
    if (note.key === parseInt(parentKey)) {
      note.archiveStatus = false;
    }
  });

  const notesUnactiveArray = notesAchivedArray.filter((note) => {
    if (note.archiveStatus) {
      return note;
    } else {
      notesArray.push(note);
    }
  });

  notesAchivedArray = notesUnactiveArray;
  const updateArchiveTableData = updateDataOnPage(
    notesAchivedArray,
    queryArchiveTable,
    createArchiveNote
  );
  updateArchiveTableData();

  const updateMainTableData = updateDataOnPage(
    notesArray,
    queryMainTable,
    createNote
  );
  updateMainTableData();

  generalNotesArray = notesArray.concat(notesAchivedArray);
  statArray = createStatArray(generalNotesArray);
  const updateStatTableData = updateDataOnPage(
    statArray,
    queryStatTable,
    createStatRow
  );
  updateStatTableData();
}
// handle create Note
async function handleCreateNote() {
  nullInputs();
  openPopUpWinCreate();
  try {
    const newSingleNote = await handlePopUpWinCreate();
    newSingleNote.key = generate5Key();
    notesArray.push(newSingleNote);

    const updateMainTableData = updateDataOnPage(
      notesArray,
      queryMainTable,
      createNote
    );
    updateMainTableData();

    generalNotesArray = notesArray.concat(notesAchivedArray);
    statArray =
      generalNotesArray.length > 0
        ? createStatArray(generalNotesArray)
        : createStatArray(notesArray);

    const updateStatTableData = updateDataOnPage(
      statArray,
      queryStatTable,
      createStatRow
    );
    updateStatTableData();
  } catch (error) {
    console.error(error);
  }
}
// update all data on page
function updateDataOnPage(data, queryContainer, createFn) {
  return () => {
    const tableContainer = document.querySelector(`.${queryContainer}`);
    tableContainer.innerHTML = '';

    if (data.length === 0) {
      tableContainer.appendChild(infoRow.cloneNode(true));
    } else {
      data.forEach((item) => {
        renderElement(tableContainer, item, createFn);
      });
    }
  };
}
