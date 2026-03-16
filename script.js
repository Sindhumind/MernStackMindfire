let registrationForm = document.getElementById("RegistrationForm");
let fullNameInput = document.getElementById("FullName");
let emailAddressInput = document.getElementById("EmailAddress");
let phoneNumberInput = document.getElementById("PhoneNumber");
let genderInput = document.getElementsByName("gender");

let userTableBody = document.getElementById("TableBody");
let submitButton = document.getElementById("SubmitButton");

let editingRow = null;


/* GET SELECTED GENDER */

function getSelectedGender() {
    const selected = document.querySelector('input[name="gender"]:checked');
    return selected ? selected.value : "";
}


/* FORM SUBMIT */

registrationForm.addEventListener("submit", function (event)
{
    event.preventDefault();

    if (!validateForm())
        return;

    if (editingRow === null)
    {
        addRecord();
    }
    else
    {
        updateRecord();
    }

    clearForm();
});


/* VALIDATION */

function validateForm()
{
    if (
        fullNameInput.value === "" ||
        emailAddressInput.value === "" ||
        phoneNumberInput.value === "" ||
        getSelectedGender() === ""
    )
    {
        alert("Please fill all fields");
        return false;
    }

    let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(emailAddressInput.value))
    {
        alert("Please enter a valid email address");
        return false;
    }

    return true;
}


/* ADD RECORD */

function addRecord()
{
    const row = userTableBody.insertRow();

    row.innerHTML =
        `
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
}


/* ATTACH EVENTS */

function attachRowEvents(row)
{
    const editButton = row.querySelector(".EditButton");
    const deleteButton = row.querySelector(".DeleteButton");

    editButton.addEventListener("click", function ()
    {
        startEdit(row);
    });

    deleteButton.addEventListener("click", function ()
    {
        deleteRecord(row);
    });
}


/* START EDIT */

function startEdit(row)
{
    // Remove editing class from previous row
    if (editingRow) {
        editingRow.classList.remove("EditingRow");
    }
    editingRow = row;

    fullNameInput.value = row.cells[0].innerText;
    emailAddressInput.value = row.cells[1].innerText;
    phoneNumberInput.value = row.cells[2].innerText;

    const genderValue = row.cells[3].innerText;

    genderInput.forEach(radio =>
    {
        radio.checked = radio.value === genderValue;
    });

    submitButton.innerText = "Update";

    row.classList.add("EditingRow");
}


/* UPDATE RECORD */

function updateRecord()
{
    editingRow.cells[0].innerText = fullNameInput.value;
    editingRow.cells[1].innerText = emailAddressInput.value;
    editingRow.cells[2].innerText = phoneNumberInput.value;
    editingRow.cells[3].innerText = getSelectedGender();

    editingRow.classList.remove("EditingRow");

    editingRow = null;

    submitButton.innerText = "Submit";
}


/* DELETE RECORD */

function deleteRecord(row)
{
    const confirmation = confirm("Are you sure you want to delete this record?");

    if (confirmation)
    {
        row.remove();
    }
}


/* CLEAR FORM */

function clearForm()
{
    fullNameInput.value = "";
    emailAddressInput.value = "";
    phoneNumberInput.value = "";

    genderInput.forEach(radio =>
    {
        radio.checked = false;
    });
}