let students = [];
let editStudentId = null;

const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const reset = document.getElementById("reset");
const search = document.getElementById("search");

const searchText = document.getElementById("searchcontent");

const studentName = document.getElementById("studentName");
const studentRoll = document.getElementById("studentRoll");
const studentBranch = document.getElementById("studentBranch");
const studentCgpa = document.getElementById("studentCgpa");

const tableBody = document.getElementById("tableBody");


function clearvalues(){
   studentName.value = "";
  studentRoll.value = "";
  studentBranch.value = "";
  studentCgpa.value = "";
}

reset.addEventListener("click",()=>{
  clearvalues();
});

function saveStudents() {
  localStorage.setItem("students", JSON.stringify(students));
}

function loadStudents() {
  const data = localStorage.getItem("students");
  if (data) {
    students = JSON.parse(data);
    renderStudents();
  }
}

function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
  students = students.filter(student => student.id !== id);
  saveStudents(); 
  renderStudents();
  }
}

function editStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  studentName.value = student.name;
  studentRoll.value = student.roll;
  studentBranch.value = student.branch;
  studentCgpa.value = student.cgpa;

  addBtn.hidden = true;
  updateBtn.hidden = false;

  editStudentId = id;
}

function renderStudents() {
  tableBody.innerHTML = "";
    if (students.length === 0) {
    document.getElementById("studentTable").hidden = true;   // hide whole table
    document.getElementById("emptyMessage").textContent = "No students found.";
    return;
  }

  document.getElementById("studentTable").hidden = false;    // show table again
  document.getElementById("emptyMessage").textContent = "";
  students.forEach((student, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.roll}</td>
        <td>${student.branch}</td>
        <td>${student.cgpa}</td>
        <td>
          <button onclick="editStudent(${student.id})">Edit</button>
          <button onclick="deleteStudent(${student.id})">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

addBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const name = studentName.value.trim();
  const roll = studentRoll.value.trim();
  const branch = studentBranch.value.trim();
  const cgpa = studentCgpa.value.trim();

  if (!name || !roll || !branch || !cgpa) {
    alert("Please fill in all fields!");
    return;
  }

  const student = { id: Date.now(), name, roll, branch, cgpa };
  students.push(student);

  saveStudents(); 
  renderStudents();
  clearvalues();

});

updateBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const name = studentName.value.trim();
  const roll = studentRoll.value.trim();
  const branch = studentBranch.value.trim();
  const cgpa = studentCgpa.value.trim();

  if (!name || !roll || !branch || !cgpa) {
    alert("Please fill in all fields!");
    return;
  }

  const student = students.find(s => s.id === editStudentId);
  if (student) {
    student.name = name;
    student.roll = roll;
    student.branch = branch;
    student.cgpa = cgpa;
  }

  saveStudents(); 
  renderStudents();

  clearvalues();
  addBtn.hidden = false;
  updateBtn.hidden = true;
  editStudentId = null;
});

search.addEventListener("click", () => {
  const query = searchText.value.trim().toLowerCase();
  const resultPara = document.getElementById("searchResult");

  // filter students by name or roll
  const results = students.filter(student =>
    student.name.toLowerCase().includes(query) ||
    student.roll.toLowerCase().includes(query)
  );

  if (results.length === 0) {
    resultPara.textContent = "No students found.";
    return;
  }

  // show each result in paragraph
  resultPara.textContent = results.map(student =>
    `ID: ${student.id}, Name: ${student.name}, Roll: ${student.roll}, Branch: ${student.branch}, CGPA: ${student.cgpa}`
  ).join(" | ");
});


window.onload = loadStudents;
