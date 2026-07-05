let students = [];
let editStudentId = null;

const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");

const studentName = document.getElementById("studentName");
const studentRoll = document.getElementById("studentRoll");
const studentBranch = document.getElementById("studentBranch");
const studentCgpa = document.getElementById("studentCgpa");

const tableBody = document.getElementById("tableBody");

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
  students = students.filter(student => student.id !== id);
  saveStudents(); 
  renderStudents();
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

  // studentName.value = "";
  // studentRoll.value = "";
  // studentBranch.value = "";
  // studentCgpa.value = "";
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

  studentName.value = "";
  studentRoll.value = "";
  studentBranch.value = "";
  studentCgpa.value = "";
  addBtn.hidden = false;
  updateBtn.hidden = true;
  editStudentId = null;
});

window.onload = loadStudents;

