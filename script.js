
const sessionForm = document.getElementById("sessionForm");

if (sessionForm) {
    sessionForm.addEventListener("submit", function (event) {
        event.preventDefault();

       
const ownerId = localStorage.getItem("peerlearnOwnerId") ||
    crypto.randomUUID();

localStorage.setItem("peerlearnOwnerId", ownerId);

const session = {
    id: Date.now(),
    room: "PeerLearnRoom" + Date.now(),
    ownerId: ownerId,
    explainerName: document.getElementById("explainerName").value.trim(),

            subject: document.getElementById("subject").value.trim(),
            topic: document.getElementById("topic").value.trim(),
            date: document.getElementById("sessionDate").value,
            time: document.getElementById("sessionTime").value,
            duration: document.getElementById("duration").value,
            capacity: document.getElementById("capacity").value
        };

        const sessions = JSON.parse(
            localStorage.getItem("peerlearnSessions") || "[]"
        );

        sessions.push(session);

        localStorage.setItem(
            "peerlearnSessions",
            JSON.stringify(sessions)
        );

        document.getElementById("message").textContent =
            "Session created successfully! 🎉";

        sessionForm.reset();
    });
}

const sessionList = document.getElementById("sessionList");

if (sessionList) {
    const sessions = JSON.parse(
        localStorage.getItem("peerlearnSessions") || "[]"
    );
    
const countElement = document.getElementById("sessionCount");

if (countElement) {
    countElement.textContent =
        "Total available sessions: " + sessions.length;
}


    sessionList.innerHTML = "";

    if (sessions.length === 0) {
        sessionList.innerHTML =
            "<p>No sessions available yet. Please check again later.</p>";
    } else {
        sessions.forEach(function (session) {
            const card = document.createElement("div");
            card.className = "card";

            const title = document.createElement("h3");
            title.textContent = "📚 " + session.subject;

            const details = [
                "👩‍🏫 Explainer: " + session.explainerName,
                "📖 Topic: " + session.topic,
                "📅 Date: " + session.date,
                "⏰ Time: " + session.time,
                "⌛ Duration: " + session.duration + " minutes",
                "👥 Maximum listeners: " + session.capacity
            ];

            card.appendChild(title);

            details.forEach(function (detail) {
                const paragraph = document.createElement("p");
                paragraph.textContent = detail;
                card.appendChild(paragraph);
            });
            
const joinButton = document.createElement("button");
joinButton.textContent = "🎥 Join Meeting";
joinButton.className = "btn";

joinButton.addEventListener("click", function () {
    const roomName = session.room ||
        ("PeerLearnRoom" + session.id);

    window.location.href =
        "meeting.html?room=" + encodeURIComponent(roomName);
});

card.appendChild(joinButton);

const currentOwnerId = localStorage.getItem("peerlearnOwnerId");

if (currentOwnerId && session.ownerId === currentOwnerId) {
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️ Delete Session";
    deleteButton.className = "btn";
    deleteButton.style.backgroundColor = "#dc3545";

    deleteButton.addEventListener("click", function () {
        const confirmed = confirm(
            "Ma, are you sure you want to delete this session?"
        );

        if (!confirmed) return;

        const savedSessions = JSON.parse(
            localStorage.getItem("peerlearnSessions") || "[]"
        );

        
const updatedSessions = savedSessions.filter(
    function (item) {
        return item.id !== session.id;
    }
);


        localStorage.setItem(
            "peerlearnSessions",
            JSON.stringify(updatedSessions)
        );

        window.location.reload();
    });

    card.appendChild(deleteButton);
}



            sessionList.appendChild(card);
        });
    }
}

