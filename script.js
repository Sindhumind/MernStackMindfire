// ELEMENTS
var form = document.getElementById("RegistrationForm");
var nameInput = document.getElementById("FullName");
var emailInput = document.getElementById("EmailAddress");
var phoneInput = document.getElementById("PhoneNumber");
var tableBody = document.getElementById("TableBody");

var editRow = null;

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

    var gender = getGender();
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
    var radios = document.getElementsByName("gender");

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
    return "";
}

// DUPLICATE CHECK
function isDuplicate(email) {
    var rows = tableBody.rows;

    for (var i = 0; i < rows.length; i++) {
        if (rows[i].cells[1].innerText == email) {
            return true;
        }
    }
    return false;
}

// ADD ROW
function addRow() {
    var row = tableBody.insertRow();

    row.innerHTML =
        "<td>" + nameInput.value + "</td>" +
        "<td>" + emailInput.value + "</td>" +
        "<td>" + phoneInput.value + "</td>" +
        "<td>" + getGender() + "</td>" +
        "<td>" +
        "<button class='ActionButton EditButton' onclick='editData(this)' title='Edit'>" +
                "<i class='fa-solid fa-pen'></i>" +
            "</button>" +
            "<button class='ActionButton DeleteButton' onclick='deleteData(this)' title='Delete'>" +
                "<i class='fa-solid fa-trash'></i>" +
            "</button>" +
        "</td>";
}

// EDIT
function editData(btn) {
    var row = btn.parentNode.parentNode;
    editRow = row;

    nameInput.value = row.cells[0].innerText;
    emailInput.value = row.cells[1].innerText;
    phoneInput.value = row.cells[2].innerText;

    var gender = row.cells[3].innerText;
    var radios = document.getElementsByName("gender");

    for (var i = 0; i < radios.length; i++) {
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
    var row = btn.parentNode.parentNode;

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

    var radios = document.getElementsByName("gender");
    for (var i = 0; i < radios.length; i++) {
        radios[i].checked = false;
    }
}


// LOCAL STORAGE


function saveData() {
    localStorage.setItem("tableData", tableBody.innerHTML);
}

function loadData() {
    var data = localStorage.getItem("tableData");

    if (data) {
        tableBody.innerHTML = data;
    }
}


// SORTING

function sortTable(colIndex, order) {
    var rows = tableBody.rows;
    var switching = true;

    while (switching) {
        switching = false;

        for (var i = 0; i < rows.length - 1; i++) {
            var x = rows[i].cells[colIndex].innerText.toLowerCase();
            var y = rows[i + 1].cells[colIndex].innerText.toLowerCase();

            var shouldSwitch = false;

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