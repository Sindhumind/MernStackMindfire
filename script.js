// ELEMENTS
const form = document.getElementById("registration-form");
const nameInput = document.getElementById("full-name");
const emailInput = document.getElementById("email-address");
const phoneInput = document.getElementById("phone-number");
const tableBody = document.getElementById("table-body");

const editRow = null;
const searchInput = document.getElementById("search-input");

//to load data once page loaded
window.onload = function () {
    loadData();
};

// FORM SUBMIT
form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (nameInput.value == "" || emailInput.value == "" || phoneInput.value == "") {
        alert("Fill all fields");
        return;
    }

    let gender = getGender();
    if (gender == "") {
        alert("Select gender");
        return;
    }

    if (editRow == null && isDuplicate(emailInput.value)) {
        alert("Email exists");
        return;
    }

    if (editRow == null) {
        addRow();
    } else {
        updateRow();
    }

    saveData();
    clearForm();
});

// GET GENDER
function getGender() {
    const radios = document.getElementsByName("gender");

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return "";
}

// DUPLICATE CHECK
function isDuplicate(email) {
    let rows = tableBody.rows;

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells[1].innerText == email) {
            return true;
        }
    }
    return false;
}

// ADD ROW
function addRow() {
    let row = tableBody.insertRow();

    row.innerHTML =
        "<td>" + nameInput.value + "</td>" +
        "<td>" + emailInput.value + "</td>" +
        "<td>" + phoneInput.value + "</td>" +
        "<td>" + getGender() + "</td>" +
        "<td>" +
        "<button class='action-button edit-button' onclick='editData(this)' title='Edit'>" +
                "<i class='fa-solid fa-pen'></i>" +
            "</button>" +
            "<button class='action-button delete-button' onclick='deleteData(this)' title='Delete'>" +
                "<i class='fa-solid fa-trash'></i>" +
            "</button>" +
        "</td>";
}

// EDIT
function editData(btn) {
    let row = btn.parentNode.parentNode;
    editRow = row;

    nameInput.value = row.cells[0].innerText;
    emailInput.value = row.cells[1].innerText;
    phoneInput.value = row.cells[2].innerText;

    let gender = row.cells[3].innerText;
    let radios = document.getElementsByName("gender");

    for (let i = 0; i < radios.length; i++) {
        radios[i].checked = (radios[i].value == gender);
    }
}

// UPDATE
function updateRow() {
    editRow.cells[0].innerText = nameInput.value;
    editRow.cells[1].innerText = emailInput.value;
    editRow.cells[2].innerText = phoneInput.value;
    editRow.cells[3].innerText = getGender();

    editRow = null;
}

// DELETE
function deleteData(btn) {
    let row = btn.parentNode.parentNode;

    if (confirm("Delete record?")) {
        row.remove();
        saveData();
    }
}

// CLEAR
function clearForm() {
    nameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";

    let radios = document.getElementsByName("gender");
    for (let i = 0; i < radios.length; i++) {
        radios[i].checked = false;
    }
}


// LOCAL STORAGE

function saveData() {
  const rows = tableBody.rows;
  const data = [];

  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].cells;

    const rowData = {
      name: cells[0].innerText,
      email: cells[1].innerText,
      phone: cells[2].innerText,
      gender: cells[3].innerText
    };

    data.push(rowData);
  }

  localStorage.setItem("users", JSON.stringify(data));
}

function loadData() {
  const data = JSON.parse(localStorage.getItem("users")) || [];

  tableBody.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const row = `
      <tr>
        <td>${data[i].name}</td>
        <td>${data[i].email}</td>
        <td>${data[i].phone}</td>
        <td>${data[i].gender}</td>
        <td>
          <button onclick="editData(this)">Edit</button>
          <button onclick="deleteData(this)">Delete</button>
        </td>
      </tr>
    `;

    tableBody.innerHTML += row;
  }
}

/*
function saveData() {
    localStorage.setItem("tableData", tableBody.innerHTML);
}

function loadData() {
    let data = localStorage.getItem("tableData");

    if (data) {
        tableBody.innerHTML = data;
    }
}*/

//SEARCH 

searchInput.addEventListener("input", function () {

  // 1. Get input value
  const value = searchInput.value.toLowerCase();

  // 2. Get all rows
  const rows = tableBody.rows;

  // 3. Loop through rows
  for (let i = 0; i < rows.length; i++) {

    const rowText = rows[i].innerText.toLowerCase();

    // 4. Check match
    if (rowText.includes(value)) {
      rows[i].style.display = "";      // show
    } else {
      rows[i].style.display = "none";  // hide
    }
  }

});


// SORTING

function sortTable(colIndex, order) {
    let rows = tableBody.rows;
    let switching = true;

    while (switching) {
        switching = false;

        for (let i = 0; i < rows.length - 1; i++) {
            let x = rows[i].cells[colIndex].innerText.toLowerCase();
            let y = rows[i + 1].cells[colIndex].innerText.toLowerCase();

            let shouldSwitch = false;

            if (order == "asc") {
                if (x > y) shouldSwitch = true;
            } else {
                if (x < y) shouldSwitch = true;
            }

            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                break;
            }
        }
    }
}