/* =========================================
   MEDIBRIDGE AI
   FRONTEND JAVASCRIPT
========================================= */

const screeningForm = document.getElementById("screeningForm");
const resultPanel = document.getElementById("resultPanel");

const patientNameInput = document.getElementById("patientName");
const ageInput = document.getElementById("age");
const symptomsInput = document.getElementById("symptoms");
const durationInput = document.getElementById("duration");

const handoverName = document.getElementById("handoverName");
const handoverAge = document.getElementById("handoverAge");
const handoverSymptoms = document.getElementById("handoverSymptoms");
const handoverDuration = document.getElementById("handoverDuration");
const handoverUrgency = document.getElementById("handoverUrgency");
const handoverDate = document.getElementById("handoverDate");

const historyContainer = document.getElementById("historyContainer");
const languageBtn = document.getElementById("languageBtn");


/* =========================================
   SCREENING LOGIC
========================================= */

screeningForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const patientName = patientNameInput.value.trim();
    const age = Number(ageInput.value);
    const symptoms = symptomsInput.value.trim().toLowerCase();
    const duration = durationInput.value;

    if (!patientName || !age || !symptoms || !duration) {
        alert("Please complete all required fields.");
        return;
    }

    /*
       This is DEMO screening logic.
       It is NOT medical diagnosis.
    */

    const emergencyKeywords = [
        "chest pain",
        "severe chest pain",
        "difficulty breathing",
        "breathing difficulty",
        "unconscious",
        "fainted",
        "seizure",
        "heavy bleeding",
        "severe bleeding",
        "stroke",
        "face drooping",
        "slurred speech"
    ];

    const urgentKeywords = [
        "high fever",
        "persistent vomiting",
        "severe pain",
        "dizziness",
        "weakness",
        "confusion",
        "dehydration",
        "continuous pain"
    ];

    let urgency = "Routine";
    let explanation =
        "The entered information does not indicate an obvious emergency keyword in this demo screening.";

    let recommendation =
        "Consider scheduling a consultation with a qualified healthcare professional if symptoms continue or worsen.";

    let matchedEmergency = emergencyKeywords.some(keyword =>
        symptoms.includes(keyword)
    );

    let matchedUrgent = urgentKeywords.some(keyword =>
        symptoms.includes(keyword)
    );


    /* Emergency */

    if (matchedEmergency) {

        urgency = "Emergency";

        explanation =
            "The entered symptoms may require immediate professional medical assessment.";

        recommendation =
            "Seek immediate medical care or contact your local emergency service.";

    }

    /* Urgent */

    else if (matchedUrgent) {

        urgency = "Urgent";

        explanation =
            "The entered symptoms may require timely medical assessment.";

        recommendation =
            "Consider contacting a qualified healthcare professional promptly.";

    }

    /* Recent symptoms */

    else if (duration === "minutes" || duration === "hours") {

        urgency = "Monitor Closely";

        explanation =
            "The symptoms are recent. Monitor them carefully and seek professional care if they worsen.";

        recommendation =
            "If symptoms become severe, sudden, or concerning, seek immediate medical attention.";

    }


    displayResult(
        patientName,
        age,
        symptoms,
        duration,
        urgency,
        explanation,
        recommendation
    );

});


/* =========================================
   DISPLAY SCREENING RESULT
========================================= */

function displayResult(
    patientName,
    age,
    symptoms,
    duration,
    urgency,
    explanation,
    recommendation
) {

    resultPanel.innerHTML = `

        <div class="result-success">

            <div class="result-level">

                <small>PRELIMINARY URGENCY</small>

                <strong>
                    ${urgency}
                </strong>

            </div>

            <div class="result-details">

                <div>
                    <small>PATIENT</small>
                    <strong>${escapeHTML(patientName)}</strong>
                </div>

                <div>
                    <small>AGE</small>
                    <strong>${age} years</strong>
                </div>

                <div>
                    <small>ASSESSMENT</small>
                    <p>
                        ${escapeHTML(explanation)}
                    </p>
                </div>

                <div>
                    <small>GUIDANCE</small>
                    <p>
                        ${escapeHTML(recommendation)}
                    </p>
                </div>

            </div>

        </div>
    `;


    updateHandoverCard(
        patientName,
        age,
        symptoms,
        duration,
        urgency
    );


    saveToHistory(
        patientName,
        age,
        symptoms,
        duration,
        urgency
    );


    /*
       Move user to result section on mobile.
    */

    resultPanel.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/* =========================================
   MEDICAL HANDOVER CARD
========================================= */

function updateHandoverCard(
    patientName,
    age,
    symptoms,
    duration,
    urgency
) {

    handoverName.textContent = patientName;

    handoverAge.textContent =
        `Age: ${age} years`;

    handoverSymptoms.textContent =
        symptoms;

    handoverDuration.textContent =
        formatDuration(duration);

    handoverUrgency.textContent =
        urgency;

    const today = new Date();

    handoverDate.textContent =
        today.toLocaleDateString("en-IN");

}


/* =========================================
   FORMAT DURATION
========================================= */

function formatDuration(duration) {

    const durationMap = {

        minutes: "Within the last few minutes",

        hours: "Within the last few hours",

        days: "1–3 days ago",

        long: "More than 3 days ago"

    };

    return durationMap[duration] || "Not available";
}


/* =========================================
   HISTORY
========================================= */

function saveToHistory(
    patientName,
    age,
    symptoms,
    duration,
    urgency
) {

    const history =
        JSON.parse(
            localStorage.getItem("mediBridgeHistory")
        ) || [];

    const record = {

        id: Date.now(),

        patientName,

        age,

        symptoms,

        duration,

        urgency,

        date: new Date().toLocaleDateString("en-IN")

    };


    history.unshift(record);


    /*
       Keep latest 10 records.
    */

    const limitedHistory =
        history.slice(0, 10);


    localStorage.setItem(
        "mediBridgeHistory",
        JSON.stringify(limitedHistory)
    );


    renderHistory();
}


/* =========================================
   RENDER HISTORY
========================================= */

function renderHistory() {

    const history =
        JSON.parse(
            localStorage.getItem("mediBridgeHistory")
        ) || [];


    if (history.length === 0) {

        historyContainer.innerHTML = `

            <div class="empty-history">

                <div>📊</div>

                <h3>
                    No screening history yet
                </h3>

                <p>
                    Your completed screenings will appear here.
                </p>

            </div>

        `;

        return;
    }


    historyContainer.innerHTML = `

        <div class="history-list">

            ${history.map(record => `

                <div class="history-item">

                    <div>

                        <strong>
                            ${escapeHTML(record.patientName)}
                        </strong>

                        <p>
                            ${escapeHTML(record.symptoms)}
                        </p>

                        <small>
                            ${record.date}
                        </small>

                    </div>

                    <span class="history-status">
                        ${record.urgency}
                    </span>

                </div>

            `).join("")}

        </div>

    `;

}


/* =========================================
   LANGUAGE BUTTON
========================================= */

languageBtn.addEventListener("click", function () {

    if (languageBtn.textContent.trim() === "தமிழ்") {

        languageBtn.textContent = "English";

        alert(
            "Tamil language interface will be integrated in the next version."
        );

    } else {

        languageBtn.textContent = "தமிழ்";

        alert(
            "English interface selected."
        );

    }

});


/* =========================================
   BASIC HTML SAFETY
========================================= */

function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");
}


/* =========================================
   LOAD SAVED HISTORY
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderHistory();

    }
);