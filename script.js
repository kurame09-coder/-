const adminUsername = "admin";
const adminPassword = "1234";
let isAdmin = false;

const adminBtn = document.getElementById("adminBtn");
const form = document.getElementById("teacherForm");
const teacherContainer = document.getElementById("teacherContainer");

let teachers = [
    { name: "Саранчимэг", profession: "Хими,Газар зүй, Биологи", phone: "89528199" },
    { name: "Нямсүрэн", profession: "Мэдээлэл технологи", phone: "86224464" },
    { name: "Цэрэнтогтох", profession: "Сургалтын албаны дарга", phone: "88075209" }
];

// Давхар утасны дугаарыг устгах
teachers = teachers.filter((t, index, self) =>
    index === self.findIndex(s => s.phone === t.phone)
);

if (!localStorage.getItem("teachers")) {
    localStorage.setItem("teachers", JSON.stringify(teachers));
}

// Админ товч
adminBtn.addEventListener("click", () => {
    const user = prompt("Хэрэглэгчийн нэр:");
    const pass = prompt("Нууц үг:");

    if (user === adminUsername && pass === adminPassword) {
        alert("Админ амжилттай нэвтэрлээ!");
        isAdmin = true;
        form.style.display = "flex";
        displayTeachers();
    } else {
        alert("Зөвхөн жагсаалтыг харах боломжтой.");
    }
});

// Form submit
form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const teacher = {
        name: document.getElementById("name").value.trim(),
        profession: document.getElementById("profession").value.trim(),
        phone: document.getElementById("phone").value.trim()
    };

    if (!/^\d{8}$/.test(teacher.phone)) {
        alert("Утасны дугаар 8 оронтой байх ёстой!");
        return;
    }

    let storedTeachers = JSON.parse(localStorage.getItem("teachers")) || [];
    if (storedTeachers.some(t => t.phone === teacher.phone)) {
        alert("Энэ утасны дугаар бүртгэлтэй байна!");
        return;
    }

    storedTeachers.push(teacher);
    localStorage.setItem("teachers", JSON.stringify(storedTeachers));
    form.reset();
    displayTeachers();
});

// Card харуулах
function displayTeachers() {
    teacherContainer.innerHTML = "";
    const storedTeachers = JSON.parse(localStorage.getItem("teachers")) || [];

    storedTeachers.forEach((t, index) => {
        const card = document.createElement("div");
        card.className = "teacher-card";
        card.innerHTML = `
            <p class="profession">${t.profession}</p>
            <h2>${t.name}</h2>
            <p class="phone">Утас: ${t.phone}</p>
            ${isAdmin ? `<button class="delete-btn" data-index="${index}">🗑️</button>` : ""}
        `;
        teacherContainer.appendChild(card);
    });

    if (isAdmin) {
        teacherContainer.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => deleteTeacher(btn.dataset.index));
        });
    }
}

function deleteTeacher(index) {
    if (!isAdmin) return;
    let storedTeachers = JSON.parse(localStorage.getItem("teachers")) || [];
    storedTeachers.splice(index, 1);
    localStorage.setItem("teachers", JSON.stringify(storedTeachers));
    displayTeachers();
}

displayTeachers();
