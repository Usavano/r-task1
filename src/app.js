// import modules
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

// ******VARIABLES****** //
let notesArray = [...initialNotes];
let statArray = createStatArray(notesArray);
const queryMainTable = 'notesContainer';
const queryStatTable = 'statisticContainer';
const createNoteBtn = document.querySelector('.createNoteBtn');

// appoint keys to notes
notesArray.forEach((note) => (note.key = generate5Key()));

// ******EVENT LISTENERS****** //
document.addEventListener('DOMContentLoaded', () => {
  const renderNotes = renderData(queryMainTable, notesArray, createNote);
  renderNotes();

  const renderStats = renderData(queryStatTable, statArray, createStatRow);
  renderStats();
});
createNoteBtn.addEventListener('click', () => {
  handleCreateNoteBtnClick();
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

// rendering data
function renderData(qContainer, data, createFn) {
  return () => {
    const dataContainer = document.querySelector(`.${qContainer}`);

    data.forEach((obj) => {
      renderElement(dataContainer, obj, createFn);
    });
  };
}

// delete notes
function deleteNote(e) {
  const parent = e.currentTarget.parentElement.parentElement;
  const parentKey = parent.getAttribute('data-key');
  const newNotesArray = notesArray.filter(
    (note) => note.key !== parseInt(parentKey)
  );

  notesArray = newNotesArray;
  statArray = createStatArray(notesArray);

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

// update all data on page
function updateDataOnPage(data, queryContainer, createFn) {
  return () => {
    const tableContainer = document.querySelector(`.${queryContainer}`);
    tableContainer.innerHTML = '';

    data.forEach((item) => {
      renderElement(tableContainer, item, createFn);
    });
  };
}

// handle create Note Button click
async function handleCreateNoteBtnClick() {
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

    statArray = createStatArray(notesArray);

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
