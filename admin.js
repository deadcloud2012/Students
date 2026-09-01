import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
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
const auth = getAuth(app);
const db = getFirestore(app);

const ADMIN_EMAIL = "tabib20120@gmail.com";


const $ = id => document.getElementById(id);


$("loginBtn").onclick = async () => {

  const email = $("email").value.trim();
  const password = $("password").value;

  if (email !== ADMIN_EMAIL) {
    $("loginMessage").textContent =
      "Only the administrator can login.";
    return;
  }

  try {

    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    $("loginMessage").textContent = "";

  } catch (error) {

    $("loginMessage").textContent =
      "Login failed. Check your email and password.";

  }
};


onAuthStateChanged(auth, user => {

  if (user && user.email === ADMIN_EMAIL) {

    $("loginArea").style.display = "none";
    $("adminArea").style.display = "block";

    loadStudents();

  } else {

    $("loginArea").style.display = "block";
    $("adminArea").style.display = "none";

  }

});


async function loadStudents() {

  const container = $("adminStudents");

  container.innerHTML =
    "<h2>All Students</h2>";

  try {

    const snapshot =
      await getDocs(collection(db, "students"));

    if (snapshot.empty) {

      container.innerHTML +=
        "<p>No students added yet.</p>";

      return;
    }


    snapshot.forEach(studentDoc => {

      const student = studentDoc.data();

      const card =
        document.createElement("div");

      card.className = "admin-card";

      card.innerHTML = `

        <h3>${student.name || "Unnamed Student"}</h3>

        <p>
          Class: ${student.class || "-"}
          | Roll: ${student.roll || "-"}
        </p>

        <button class="editBtn">
          ✏️ Edit
        </button>

        <button class="danger deleteBtn">
          🗑️ Delete
        </button>

      `;


      card.querySelector(".editBtn").onclick =
        () => editStudent(studentDoc.id, student);


      card.querySelector(".deleteBtn").onclick =
        () => deleteStudent(studentDoc.id);


      container.appendChild(card);

    });

  } catch (error) {

    container.innerHTML +=
      "<p>Could not load students.</p>";

    console.error(error);

  }

}


$("saveBtn").onclick = async () => {

  const name = $("name").value.trim();

  if (!name) {

    alert("Please enter the student's name.");

    return;
  }


  const student = {

    name: name,

    school: $("school").value.trim(),

    class: $("studentClass").value.trim(),

    roll: $("roll").value.trim(),

    section: $("section").value.trim(),

    age: $("age").value.trim(),

    dob: $("dob").value,

    gender: $("gender").value.trim(),

    religion: $("religion").value.trim(),

    blood: $("blood").value.trim(),

    studentId:
      $("studentIdNumber").value.trim(),

    photo: $("photo").value.trim(),

    about: $("about").value.trim()

  };


  const id = $("studentId").value;


  try {

    if (id) {

      await updateDoc(
        doc(db, "students", id),
        student
      );

      alert("Student updated successfully!");

    } else {

      await addDoc(
        collection(db, "students"),
        student
      );

      alert("Student added successfully!");

    }


    clearForm();

    loadStudents();

  } catch (error) {

    alert(
      "Operation failed: " + error.message
    );

  }

};


function editStudent(id, student) {

  $("studentId").value = id;

  $("name").value =
    student.name || "";

  $("school").value =
    student.school || "";

  $("studentClass").value =
    student.class || "";

  $("roll").value =
    student.roll || "";

  $("section").value =
    student.section || "";

  $("age").value =
    student.age || "";

  $("dob").value =
    student.dob || "";

  $("gender").value =
    student.gender || "";

  $("religion").value =
    student.religion || "";

  $("blood").value =
    student.blood || "";

  $("studentIdNumber").value =
    student.studentId || "";

  $("photo").value =
    student.photo || "";

  $("about").value =
    student.about || "";


  $("formTitle").textContent =
    "Edit Student";

  $("saveBtn").textContent =
    "💾 Save Changes";

  $("cancelBtn").style.display =
    "inline-block";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


async function deleteStudent(id) {

  const confirmed =
    confirm(
      "Are you sure you want to delete this student?"
    );

  if (!confirmed) return;


  try {

    await deleteDoc(
      doc(db, "students", id)
    );

    alert("Student deleted.");

    loadStudents();

  } catch (error) {

    alert(
      "Delete failed: " + error.message
    );

  }

}


function clearForm() {

  $("studentId").value = "";

  $("name").value = "";
  $("school").value = "";
  $("studentClass").value = "";
  $("roll").value = "";
  $("section").value = "";
  $("age").value = "";
  $("dob").value = "";
  $("gender").value = "";
  $("religion").value = "";
  $("blood").value = "";
  $("studentIdNumber").value = "";
  $("photo").value = "";
  $("about").value = "";


  $("formTitle").textContent =
    "Add Student";

  $("saveBtn").textContent =
    "Add Student";

  $("cancelBtn").style.display =
    "none";

}


$("cancelBtn").onclick =
  clearForm;


$("logoutBtn").onclick =
  () => signOut(auth);
