/* =====================================================
   SELF-ATTENDING SYSTEM
   LOCAL HOST VERSION
   No Supabase
   No Firebase
   No Admin
===================================================== */


/* ================= STUDENTS ================= */

const students = [
    { roll: 28, name: "Student28" },
    { roll: 29, name: "Student29" },
    { roll: 30, name: "Student30" },
    { roll: 31, name: "Student31" },
    { roll: 32, name: "Student32" },
    { roll: 33, name: "Student33" },
    { roll: 34, name: "Student34" },
    { roll: 35, name: "Student35" },
    { roll: 36, name: "Student36" },
    { roll: 37, name: "Student37" },
    { roll: 38, name: "Student38" },
    { roll: 39, name: "Student39" },
    { roll: 40, name: "Student40" },
    { roll: 41, name: "Student41" },
    { roll: 42, name: "Student42" },
    { roll: 43, name: "Student43" },
    { roll: 44, name: "Student44" },
    { roll: 45, name: "Student45" },
    { roll: 46, name: "Student46" },
    { roll: 47, name: "Student47" },
    { roll: 48, name: "Student48" },
    { roll: 49, name: "Student49" },
    { roll: 50, name: "Student50" },
    { roll: 51, name: "Student51" }
];


/* ================= LOCAL STORAGE ================= */

let attendance = JSON.parse(
    localStorage.getItem("attendance")
) || {};

let requests = JSON.parse(
    localStorage.getItem("attendanceRequests")
) || [];

let onDuty = JSON.parse(
    localStorage.getItem("onDuty")
) || [];

let sessions = JSON.parse(
    localStorage.getItem("attendanceSessions")
) || {
    morning: true,
    afternoon: true
};

let currentUser = null;


/* ================= SAVE DATA ================= */

function saveData() {

    localStorage.setItem(
        "attendance",
        JSON.stringify(attendance)
    );

    localStorage.setItem(
        "attendanceRequests",
        JSON.stringify(requests)
    );

    localStorage.setItem(
        "onDuty",
        JSON.stringify(onDuty)
    );

    localStorage.setItem(
        "attendanceSessions",
        JSON.stringify(sessions)
    );
}


/* ================= PAGE CONTROL ================= */

function showPage(pageId) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
    });

    document.getElementById(pageId).classList.add("active");
}


function openLogin() {

    showPage("loginPage");

    document.getElementById("username").focus();
}


/* ================= LOGIN ================= */

document
    .getElementById("loginForm")
    .addEventListener("submit", function(event) {

        event.preventDefault();

        const username =
            document
                .getElementById("username")
                .value
                .trim();

        const password =
            document
                .getElementById("password")
                .value;

        const message =
            document.getElementById("loginMessage");


        /* STUDENT LOGIN */

        if (
            username.toLowerCase() === "student" &&
            password === ""
        ) {

            currentUser = {
                role: "student",
                username: "student"
            };

            openDashboard();

            return;
        }


        /* TEACHER LOGIN */

        if (
            username.toLowerCase() === "teacher" &&
            password === "teacher@2026"
        ) {

            currentUser = {
                role: "teacher",
                username: "teacher"
            };

            openDashboard();

            return;
        }


        message.innerHTML =
            `<span style="color:#d32f2f;">
                Invalid username or password.
            </span>`;
    });


/* ================= DASHBOARD ================= */

function openDashboard() {

    showPage("dashboardPage");

    const studentDashboard =
        document.getElementById("studentDashboard");

    const teacherDashboard =
        document.getElementById("teacherDashboard");

    if (currentUser.role === "student") {

        studentDashboard.style.display = "block";
        teacherDashboard.style.display = "none";

        document.getElementById(
            "dashboardTitle"
        ).textContent = "Welcome, Student";

        document.getElementById(
            "dashboardSubtitle"
        ).textContent =
            "Manage your attendance and on-duty requests.";

    }


    if (currentUser.role === "teacher") {

        studentDashboard.style.display = "none";
        teacherDashboard.style.display = "block";

        document.getElementById(
            "dashboardTitle"
        ).textContent = "Welcome, Teacher";

        document.getElementById(
            "dashboardSubtitle"
        ).textContent =
            "Review and manage student attendance.";
    }
}


/* ================= LOGOUT ================= */

function logout() {

    currentUser = null;

    document.getElementById("loginForm").reset();

    document.getElementById("loginMessage").innerHTML = "";

    showPage("homePage");
}


/* ================= MODAL ================= */

function openModal(title, content) {

    document.getElementById(
        "modalTitle"
    ).textContent = title;

    document.getElementById(
        "modalContent"
    ).innerHTML = content;

    document
        .getElementById("modal")
        .classList.add("show");
}


function closeModal() {

    document
        .getElementById("modal")
        .classList.remove("show");
}


/* ================= STUDENT ATTENDANCE ================= */

function openAttendanceMenu() {

    const html = `

        <div class="session-buttons">

            <button
                class="session-button"
                onclick="chooseStudent('morning')"
                ${!sessions.morning ? "disabled" : ""}
            >

                <h3>Morning Attendance</h3>

                <p>
                    ${
                        sessions.morning
                        ? "Attendance is currently open."
                        : "Attendance is closed."
                    }
                </p>

            </button>


            <button
                class="session-button"
                onclick="chooseStudent('afternoon')"
                ${!sessions.afternoon ? "disabled" : ""}
            >

                <h3>Afternoon Attendance</h3>

                <p>
                    ${
                        sessions.afternoon
                        ? "Attendance is currently open."
                        : "Attendance is closed."
                    }
                </p>

            </button>

        </div>
    `;

    openModal(
        "Choose Attendance Session",
        html
    );
}


/* ================= CHOOSE STUDENT ================= */

function chooseStudent(session) {

    if (!sessions[session]) {

        alert("Attendance is currently closed.");

        return;
    }

    let html = `

        <p>
            Select your name from the list below.
        </p>

        <div class="student-list">
    `;


    students.forEach(student => {

        html += `

            <div
                class="student-option"
                id="student-${student.roll}"
                onclick="selectStudent(${student.roll})"
            >

                <span class="roll">
                    ${student.roll}
                </span>

                ${student.name}

            </div>
        `;
    });


    html += `
        </div>

        <button
            class="ok-button"
            onclick="submitAttendance('${session}')"
        >
            OK — Submit Request
        </button>
    `;

    window.selectedStudent = null;

    openModal(
        session === "morning"
            ? "Morning Attendance"
            : "Afternoon Attendance",
        html
    );
}


/* ================= SELECT STUDENT ================= */

function selectStudent(roll) {

    document
        .querySelectorAll(".student-option")
        .forEach(item => {
            item.classList.remove("selected");
        });

    const selected =
        document.getElementById(
            `student-${roll}`
        );

    selected.classList.add("selected");

    window.selectedStudent = roll;
}


/* ================= SUBMIT ATTENDANCE ================= */

function submitAttendance(session) {

    if (!window.selectedStudent) {

        alert("Please select your name.");

        return;
    }


    const roll = window.selectedStudent;

    const existing =
        requests.find(
            request =>
                request.roll === roll &&
                request.session === session &&
                request.status === "pending"
        );


    if (existing) {

        alert(
            "Your attendance request is already pending."
        );

        return;
    }


    requests.push({

        id: Date.now(),

        roll: roll,

        name:
            students.find(
                student => student.roll === roll
            ).name,

        session: session,

        status: "pending",

        time: new Date().toLocaleString()

    });


    saveData();

    closeModal();

    alert(
        "Attendance request submitted successfully. Please wait for teacher approval."
    );
}


/* ================= TEACHER: VIEW ATTENDANCE ================= */

function viewAttendance() {

    let html = `

        <table class="attendance-table">

            <thead>

                <tr>
                    <th>Roll</th>
                    <th>Student</th>
                    <th>Morning</th>
                    <th>Afternoon</th>
                    <th>Actions</th>
                </tr>

            </thead>

            <tbody>
    `;


    students.forEach(student => {

        const data =
            attendance[student.roll] || {};

        html += `

            <tr>

                <td>${student.roll}</td>

                <td>${student.name}</td>

                <td class="${
                    data.morning === "P"
                    ? "present"
                    : data.morning === "A"
                    ? "absent"
                    : ""
                }">

                    ${data.morning || "—"}

                </td>

                <td class="${
                    data.afternoon === "P"
                    ? "present"
                    : data.afternoon === "A"
                    ? "absent"
                    : ""
                }">

                    ${data.afternoon || "—"}

                </td>

                <td>

                    <button
                        class="action-btn edit"
                        onclick="editAttendance(${student.roll})"
                    >
                        Edit
                    </button>

                </td>

            </tr>
        `;
    });


    html += `
            </tbody>
        </table>
    `;


    openModal(
        "Student Attendance",
        html
    );
}


/* ================= EDIT ATTENDANCE ================= */

function editAttendance(roll) {

    const student =
        students.find(
            s => s.roll === roll
        );

    const current =
        attendance[roll] || {};


    const html = `

        <h3>
            ${student.roll} — ${student.name}
        </h3>

        <br>

        <label>Morning Attendance</label>

        <select id="editMorning">

            <option value="">Not Marked</option>

            <option value="P"
                ${current.morning === "P" ? "selected" : ""}>
                P — Present
            </option>

            <option value="A"
                ${current.morning === "A" ? "selected" : ""}>
                A — Absent
            </option>

        </select>

        <br><br>

        <label>Afternoon Attendance</label>

        <select id="editAfternoon">

            <option value="">Not Marked</option>

            <option value="P"
                ${current.afternoon === "P" ? "selected" : ""}>
                P — Present
            </option>

            <option value="A"
                ${current.afternoon === "A" ? "selected" : ""}>
                A — Absent
            </option>

        </select>

        <br>

        <button
            class="ok-button"
            onclick="saveAttendanceEdit(${roll})"
        >
            Save Changes
        </button>
    `;


    openModal(
        "Edit Attendance",
        html
    );
}


/* ================= SAVE ATTENDANCE EDIT ================= */

function saveAttendanceEdit(roll) {

    const morning =
        document.getElementById(
            "editMorning"
        ).value;

    const afternoon =
        document.getElementById(
            "editAfternoon"
        ).value;


    attendance[roll] = {
        morning: morning,
        afternoon: afternoon
    };


    saveData();

    closeModal();

    viewAttendance();
}


/* ================= TEACHER REQUESTS ================= */

function viewRequests() {

    if (requests.length === 0) {

        openModal(
            "Attendance Requests",
            `<p>No attendance requests currently exist.</p>`
        );

        return;
    }


    let html = "";


    requests.forEach(request => {

        html += `

            <div
                style="
                    padding:18px;
                    border:1px solid #e0e8f2;
                    border-radius:12px;
                    margin-bottom:12px;
                "
            >

                <strong>
                    ${request.roll} — ${request.name}
                </strong>

                <p>
                    ${
                        request.session === "morning"
                        ? "Morning Attendance"
                        : "Afternoon Attendance"
                    }
                </p>

                <p>
                    Status:
                    <strong>${request.status}</strong>
                </p>

                <p>
                    ${request.time}
                </p>

                ${
                    request.status === "pending"
                    ? `

                        <button
                            class="action-btn approve"
                            onclick="approveRequest(${request.id})"
                        >
                            Approve
                        </button>

                        <button
                            class="action-btn reject"
                            onclick="rejectRequest(${request.id})"
                        >
                            Reject
                        </button>

                    `
                    : ""
                }

            </div>
        `;
    });


    openModal(
        "Attendance Requests",
        html
    );
}


/* ================= APPROVE ================= */

function approveRequest(id) {

    const request =
        requests.find(
            r => r.id === id
        );

    if (!request) return;


    if (!attendance[request.roll]) {

        attendance[request.roll] = {};
    }


    attendance[request.roll][request.session] = "P";

    request.status = "approved";


    saveData();

    viewRequests();
}


/* ================= REJECT ================= */

function rejectRequest(id) {

    const request =
        requests.find(
            r => r.id === id
        );

    if (!request) return;

    request.status = "rejected";

    saveData();

    viewRequests();
}


/* ================= SESSION MANAGEMENT ================= */

function manageSessions() {

    const html = `

        <div class="session-buttons">

            <div class="session-button">

                <h3>
                    Morning Attendance
                </h3>

                <p>
                    Status:
                    <strong>
                        ${
                            sessions.morning
                            ? "OPEN"
                            : "CLOSED"
                        }
                    </strong>
                </p>

                <br>

                <button
                    class="ok-button"
                    onclick="toggleSession('morning')"
                >
                    ${
                        sessions.morning
                        ? "Close"
                        : "Open / Re-open"
                    }
                </button>

            </div>


            <div class="session-button">

                <h3>
                    Afternoon Attendance
                </h3>

                <p>
                    Status:
                    <strong>
                        ${
                            sessions.afternoon
                            ? "OPEN"
                            : "CLOSED"
                        }
                    </strong>
                </p>

                <br>

                <button
                    class="ok-button"
                    onclick="toggleSession('afternoon')"
                >
                    ${
                        sessions.afternoon
                        ? "Close"
                        : "Open / Re-open"
                    }
                </button>

            </div>

        </div>
    `;


    openModal(
        "Attendance Sessions",
        html
    );
}


/* ================= TOGGLE SESSION ================= */

function toggleSession(session) {

    sessions[session] =
        !sessions[session];

    saveData();

    manageSessions();
}


/* ================= ON DUTY STUDENT ================= */

function openOnDuty() {

    let html = `

        <p>
            Select your name. You must have an approved
            attendance record to mark yourself as on duty.
        </p>

        <div class="student-list">
    `;


    students.forEach(student => {

        html += `

            <div
                class="student-option"
                onclick="selectOnDuty(${student.roll})"
            >

                <span class="roll">
                    ${student.roll}
                </span>

                ${student.name}

            </div>
        `;
    });


    html += `

        </div>

        <button
            class="ok-button"
            onclick="submitOnDuty()"
        >
            OK — Mark On Duty
        </button>
    `;


    window.selectedDutyStudent = null;


    openModal(
        "Mark Yourself as On Duty",
        html
    );
}


/* ================= SELECT DUTY ================= */

function selectOnDuty(roll) {

    document
        .querySelectorAll(".student-option")
        .forEach(item => {
            item.classList.remove("selected");
        });


    event.currentTarget.classList.add("selected");

    window.selectedDutyStudent = roll;
}


/* ================= SUBMIT DUTY ================= */

function submitOnDuty() {

    const roll =
        window.selectedDutyStudent;


    if (!roll) {

        alert("Please select your name.");

        return;
    }


    const record =
        attendance[roll];


    if (
        !record ||
        (
            record.morning !== "P" &&
            record.afternoon !== "P"
        )
    ) {

        alert(
            "You are not present. You are absent. You are not able to mark yourself as on duty."
        );

        return;
    }


    if (
        onDuty.some(
            student =>
                student.roll === roll
        )
    ) {

        alert(
            "This student is already marked as on duty."
        );

        return;
    }


    const student =
        students.find(
            s => s.roll === roll
        );


    onDuty.push({

        roll: roll,

        name: student.name,

        time: new Date().toLocaleString()

    });


    saveData();

    closeModal();

    alert(
        "You have been marked as on duty."
    );
}


/* ================= TEACHER ON DUTY ================= */

function viewOnDutyTeacher() {

    if (onDuty.length === 0) {

        openModal(
            "On-Duty Students",
            `<p>No students are currently on duty.</p>`
        );

        return;
    }


    let html = `
        <table class="attendance-table">

            <thead>

                <tr>
                    <th>Roll</th>
                    <th>Student</th>
                    <th>Time</th>
                    <th>Action</th>
                </tr>

            </thead>

            <tbody>
    `;


    onDuty.forEach((student, index) => {

        html += `

            <tr>

                <td>${student.roll}</td>

                <td>${student.name}</td>

                <td>${student.time}</td>

                <td>

                    <button
                        class="action-btn reject"
                        onclick="removeOnDuty(${index})"
                    >
                        Remove
                    </button>

                </td>

            </tr>
        `;
    });


    html += `
            </tbody>
        </table>
    `;


    openModal(
        "On-Duty Students",
        html
    );
}


/* ================= REMOVE DUTY ================= */

function removeOnDuty(index) {

    onDuty.splice(index, 1);

    saveData();

    viewOnDutyTeacher();
}


/* ================= RESET ATTENDANCE ================= */

function resetAttendance() {

    const confirmation =
        confirm(
            "Are you sure you want to reset all attendance?"
        );


    if (!confirmation) return;


    attendance = {};

    requests = [];

    onDuty = [];


    saveData();


    alert(
        "Attendance has been reset successfully."
    );
}
