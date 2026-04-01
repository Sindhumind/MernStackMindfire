/* ELEMENTS= */
let registrationForm = document.getElementById("RegistrationForm");
let fullNameInput = document.getElementById("FullName");
let emailAddressInput = document.getElementById("EmailAddress");
let phoneNumberInput = document.getElementById("PhoneNumber");
let genderInput = document.getElementsByName("gender");

let userTableBody = document.getElementById("TableBody");
let submitButton = document.getElementById("SubmitButton");

let searchInput = document.getElementById("SearchInput");

let editingRow = null;
let sortDirections = {};


function isEmailDuplicate(email) {
    const rows = Array.from(userTableBody.rows);

    return rows.some(row => {
        const existingEmail = row.cells[1].innerText.trim().toLowerCase();
        return existingEmail === email.trim().toLowerCase();
    });
}

/* GET SELECTED GENDER */

function getSelectedGender() {
    const selected = document.querySelector('input[name="gender"]:checked');
    return selected ? selected.value : "";
}

/* FORM SUBMIT */

registrationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!validateForm()) return;

    if (editingRow === null) {
        addRecord();
    } else {
        updateRecord();
    }

    clearForm();
});

/* VALIDATION */

function validateForm() {
    if (
        fullNameInput.value === "" ||
        emailAddressInput.value === "" ||
        phoneNumberInput.value === "" ||
        getSelectedGender() === ""
    ) {
        alert("Please fill all fields");
        return false;
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailAddressInput.value)) {
        alert("Invalid email");
        return false;
    }

    //Prevent duplicate (only for new records)
    if (editingRow === null && isEmailDuplicate(emailAddressInput.value)) {
        alert("Email already exists!");
        return false;
    }

    return true;
}

/* LOCAL STORAGE */

function saveToLocalStorage() {
    localStorage.setItem("userTableBody", userTableBody.innerHTML);
}

function loadFromLocalStorage() {
    const data = localStorage.getItem("userTableBody");

    if (data) {
        userTableBody.innerHTML = data;

        const rows = userTableBody.querySelectorAll("tr");
        rows.forEach(row => attachRowEvents(row));
    }
}

/* LOAD AI USERS */

function loadGeneratedUser() {
    const data = localStorage.getItem("newUser");
    if (!data) return;

    const users = JSON.parse(data);

    users.forEach(user => {
        //Skip duplicates
        if (isEmailDuplicate(user.email)) {
            console.log("Skipped duplicate:", user.email);
            return;
        }

        fullNameInput.value = user.name;
        emailAddressInput.value = user.email;
        phoneNumberInput.value = user.phone;

        genderInput.forEach(radio => {
            radio.checked = radio.value === user.gender;
        });

        addRecord();
    });

    localStorage.removeItem("newUser");
}

window.onload = function () {
    loadFromLocalStorage();
    loadGeneratedUser();
    clearForm();
};

/* ADD RECORD */

function addRecord() {
    const row = userTableBody.insertRow();

    row.innerHTML = `
        <td>${fullNameInput.value}</td>
        <td>${emailAddressInput.value}</td>
        <td>${phoneNumberInput.value}</td>
        <td>${getSelectedGender()}</td>
        <td class="ActionColumn">
            <button class="ActionButton EditButton" title="Edit">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="ActionButton DeleteButton" title="Delete">
                <i class="fa-solid fa-trash"></i>
            </button>
        </td>
    `;

    attachRowEvents(row);
    saveToLocalStorage();
}

/* EVENTS */

function attachRowEvents(row) {
    row.querySelector(".EditButton").onclick = () => startEdit(row);
    row.querySelector(".DeleteButton").onclick = () => deleteRecord(row);
}

/* EDIT */

function startEdit(row) {

   // Remove editing class from previous row
    if (editingRow) {
        editingRow.classList.remove("EditingRow");
    }

    editingRow = row;
    fullNameInput.value = row.cells[0].innerText;
    emailAddressInput.value = row.cells[1].innerText;
    phoneNumberInput.value = row.cells[2].innerText;

    const genderValue = row.cells[3].innerText;

    genderInput.forEach(radio => {
        radio.checked = radio.value === genderValue;
    });

    submitButton.innerText = "Update";
    row.classList.add("EditingRow");
}

/* UPDATE */

function updateRecord() {
     const newEmail = emailAddressInput.value;

    const rows = Array.from(userTableBody.rows);

    const isDuplicate = rows.some(row => {
        if (row === editingRow) return false;
        return row.cells[1].innerText.trim().toLowerCase() === newEmail.toLowerCase();
    });

    if (isDuplicate) {
        alert("Email already exists!");
        return;
    }

    editingRow.cells[0].innerText = fullNameInput.value;
    editingRow.cells[1].innerText = emailAddressInput.value;
    editingRow.cells[2].innerText = phoneNumberInput.value;
    editingRow.cells[3].innerText = getSelectedGender();

    editingRow.classList.remove("EditingRow");

    editingRow = null;

    submitButton.innerText = "Submit";

    saveToLocalStorage();
}

/* DELETE */

function deleteRecord(row) {
    if (confirm("Delete this record?")) {
        row.remove();
        saveToLocalStorage();
    }
}

/* CLEAR */

function clearForm() {
    fullNameInput.value = "";
    emailAddressInput.value = "";
    phoneNumberInput.value = "";

    genderInput.forEach(r => (r.checked = false));
}

/* SEARCH  */

searchInput.addEventListener("input", function () {
    const value = searchInput.value.toLowerCase();

    Array.from(userTableBody.rows).forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value)
            ? ""
            : "none";
    });
});

/* SORT */

function sortTable(columnIndex, order) {
  const direction = order === "asc" ? 1 : -1;

  const tbody = document.getElementById("TableBody");
  const rowsArray = Array.from(tbody.rows);

  rowsArray.sort((a, b) => {
    let valA = a.cells[columnIndex].innerText.trim().toLowerCase();
    let valB = b.cells[columnIndex].innerText.trim().toLowerCase();

    if (!isNaN(valA) && !isNaN(valB)) {
      return (valA - valB) * direction;
    }

    return valA.localeCompare(valB) * direction;
  });

  tbody.innerHTML = "";
  rowsArray.forEach(row => tbody.appendChild(row));

  highlightArrow(columnIndex, order);
}

function highlightArrow(columnIndex, order) {
  // reset all arrows
  document.querySelectorAll(".sort-icon").forEach(icon => {
    icon.classList.remove("active-sort");
  });

  // highlight selected arrow
  document
    .getElementById(`${order}-${columnIndex}`)
    .classList.add("active-sort");
}


/* AI GENERATE USERS */


async function generateAIData() {
    try {
        const response = await fetch("https://api.cohere.ai/v1/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer cKGgiPFn8mez4qOghJYjS1td7B3h4Wpry0yNqbjm" 
            },
            body: JSON.stringify({
                model: "command-nightly", 
                message: "Generate an array of 10 user objects in valid JSON format. Each user must include: name, email, phone, and gender. Ensure phone numbers follow valid Indian format (e.g., +91XXXXXXXXXX or 10-digit mobile numbers starting with 6–9). Use realistic data. Return only valid JSON without any explanation or extra text.",
                max_tokens: 1000 
            })
        });

        if (!response.ok) {
            const errorBody = await response.json();
            throw new Error(`API Error: ${response.status} - ${errorBody.message || 'Unknown'}`);
        }

        const data = await response.json();
        
        const rawText = data.text;

        const jsonString = extractJSON(rawText);
        const users = JSON.parse(jsonString);

        localStorage.setItem("newUser", JSON.stringify(users));
        window.location.href = "index.html";

    } catch (error) {
        console.error("Integration Error:", error);
        alert("Error: " + error.message);
    }
}

// Utility function to strip any non-JSON text the AI might provide
function extractJSON(str) {
    const firstBracket = str.indexOf('[');
    const lastBracket = str.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
        return str.substring(firstBracket, lastBracket + 1);
    }
    return str;
}