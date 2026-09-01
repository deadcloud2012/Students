import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAse91Q6ehsJIndyzAxHNZKkoVKZyT31W4",
  authDomain: "students-3750a.firebaseapp.com",
  projectId: "students-3750a",
  storageBucket: "students-3750a.firebasestorage.app",
  messagingSenderId: "455003349275",
  appId: "1:455003349275:web:269f1dfd123159af6373be",
  measurementId: "G-DRZGQZNH0Z"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const studentsDiv = document.getElementById("students");
const search = document.getElementById("search");

let students = [];


async function loadStudents() {

  try {

    const snapshot =
      await getDocs(collection(db, "students"));

    students = [];

    snapshot.forEach(doc => {

      students.push({
        id: doc.id,
        ...doc.data()
      });

    });

    displayStudents(students);

  } catch (error) {

    studentsDiv.innerHTML =
      "<p>Unable to load students.</p>";

    console.error(error);
  }
}


function displayStudents(list) {

  studentsDiv.innerHTML = "";

  if (list.length === 0) {

    studentsDiv.innerHTML =
      "<p>No students found.</p>";

    return;
  }


  list.forEach(student => {

    const card = document.createElement("div");

    card.className = "card";


    const photo =
      student.photo ||
      "https://via.placeholder.com/150";


    card.innerHTML = `

      <img src="${photo}" alt="Student">

      <h3>${student.name || "Unnamed Student"}</h3>

      <p>
        Class ${student.class || "-"}
        • Roll ${student.roll || "-"}
      </p>

    `;


    card.onclick = () => showProfile(student);

    studentsDiv.appendChild(card);

  });
}


search.addEventListener("input", () => {

  const text =
    search.value.toLowerCase().trim();


  const filtered = students.filter(student =>

    (student.name || "")
      .toLowerCase()
      .includes(text)

    ||

    String(student.class || "")
      .toLowerCase()
      .includes(text)

    ||

    String(student.roll || "")
      .toLowerCase()
      .includes(text)

    ||

    (student.school || "")
      .toLowerCase()
      .includes(text)

  );


  displayStudents(filtered);

});


window.showProfile = function(student) {

  document.getElementById("profilePhoto").src =
    student.photo ||
    "https://via.placeholder.com/150";


  document.getElementById("profileName").textContent =
    student.name || "-";


  document.getElementById("profileSchool").textContent =
    student.school || "-";


  document.getElementById("profileClass").textContent =
    student.class || "-";


  document.getElementById("profileRoll").textContent =
    student.roll || "-";


  document.getElementById("profileSection").textContent =
    student.section || "-";


  document.getElementById("profileStudentId").textContent =
    student.studentId || "-";


  document.getElementById("profileAge").textContent =
    student.age || "-";


  document.getElementById("profileDob").textContent =
    student.dob || "-";


  document.getElementById("profileGender").textContent =
    student.gender || "-";


  document.getElementById("profileReligion").textContent =
    student.religion || "-";


  document.getElementById("profileBlood").textContent =
    student.blood || "-";


  document.getElementById("profileAbout").textContent =
    student.about || "-";


  document.getElementById("profileModal").style.display =
    "block";
};


window.closeProfile = function() {

  document.getElementById("profileModal").style.display =
    "none";

};


loadStudents();
