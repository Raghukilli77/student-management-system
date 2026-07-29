let students = [];
let editStudentId = null;

const addBtn = document.getElementById("addBtn");
const updateBtn = document.getElementById("updateBtn");
const reset = document.getElementById("reset");
const search = document.getElementById("search");

const searchText = document.getElementById("searchcontent");
const totalStudentsElement = document.getElementById("totalstudents");
const averageCgpaElement = document.getElementById("averagecgpa");
const highestCgpaElement = document.getElementById("highestcgpa");
const dashboard = document.getElementById("x");

const studentName = document.getElementById("studentName");
const studentRoll = document.getElementById("studentRoll");
const studentBranch = document.getElementById("studentBranch");
const studentCgpa = document.getElementById("studentCgpa");

const tableBody = document.getElementById("tableBody");
const searchTable = document.getElementById("searchTable");
searchTable.hidden=true;


function clearForm(){
   studentName.value = "";
  studentRoll.value = "";
  studentBranch.value = "";
  studentCgpa.value = "";
}

reset.addEventListener("click",()=>{
  clearForm();
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
function ifempty(){
   document.getElementById("studentTable").hidden = true;   // hide whole table
   document.getElementById("tablecardid").hidden = true;
    document.getElementById("emptyMessage").textContent = "No students found.";
    // totalStudentsElement.textContent = "Total number of Students: 0";
    // highestCgpaElement.textContent = "Highest CGPA: -";
    dashboard.hidden=true;

}
function ifnotempty(){
  dashboard.hidden=false;
  document.getElementById("studentTable").hidden = false;    // show table again
  document.getElementById("tablecardid").hidden = false;
  document.getElementById("emptyMessage").textContent = "";
  students.forEach((student, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${student.name}</td>
        <td>${student.roll}</td>
        <td>${student.branch}</td>
        <td>${student.cgpa}</td>
        <td class="actions">
          <button onclick="editStudent(${student.id})">Edit</button>
          <button onclick="deleteStudent(${student.id})">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}
function updatedashboard(){
  
   totalStudentsElement.textContent = `Total number of Students: ${students.length}`;
   

  // find max cgpa
  const maxcgpa = Math.max(...students.map(s => Number(s.cgpa)));
  highestCgpaElement.textContent = `Highest CGPA: ${maxcgpa}`;
  
  const sumCgpa = students.reduce((sum, s) => sum + Number(s.cgpa), 0);
  const avgCgpa = (sumCgpa / students.length).toFixed(2);
  averageCgpaElement.textContent = `Average CGPA: ${avgCgpa}`;
}
function renderStudents() {
  tableBody.innerHTML = "";
    if (students.length === 0) {
      ifempty();
    return;
  }else{
       ifnotempty();

  }
  updatedashboard();
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
  clearForm();

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

  clearForm();
  addBtn.hidden = false;
  updateBtn.hidden = true;
  editStudentId = null;
});


searchText.addEventListener("input", () => {
  const query = searchText.value.trim().toLowerCase();
  const searchTable = document.getElementById("searchTable");
  const searchTableBody = document.getElementById("searchTableBody");
  const searchMessage = document.getElementById("searchMessage");

  // clear previous search results
  searchTableBody.innerHTML = "";
  searchMessage.textContent = "";

  // case 1: nothing typed → hide everything
  if (!query) {
    searchTable.hidden = true;
    return;
  }

  // filter students by name or roll
  const results = students.filter(student =>
    student.name.toLowerCase().includes(query) ||
    student.roll.toLowerCase().includes(query)
  );

  // case 2: typed but no matches → hide table, show message
  if (results.length === 0) {
    searchTable.hidden = true;
    searchMessage.textContent = "No students found.";
    return;
  }

  // case 3: typed and matches found → show table with results
  searchTable.hidden = false;
  results.forEach((student, index) => {
    const serialNumber = students.findIndex(s => s.id === student.id) + 1;
    searchTableBody.innerHTML += `
      <tr>
        <td>${serialNumber}</td>
        <td>${student.name}</td>
        <td>${student.roll}</td>
        <td>${student.branch}</td>
        <td>${student.cgpa}</td>
      </tr>
    `;
  });
});

window.onload = loadStudents;
