
import {
    database,
    auth,
    signInAnonymously,
    waitForAuth
} from "./firebase.js";

import {
    ref,
    set,
    remove,
    onValue
} from "https://www.gstatic.com/firebasejs/13.0.0/firebase-database.js";

const sessionForm = document.getElementById("sessionForm");
const sessionList = document.getElementById("sessionList");

async function startPeerLearn() {
    try {
        await waitForAuth();

if (!auth.currentUser) {
    await signInAnonymously(auth);
}
        }

        const user = auth.currentUser;

        if (!user) {
            throw new Error("Unable to sign in.");
        }

        // Create a new session in Firebase
        if (sessionForm) {
            sessionForm.addEventListener("submit", async function (event) {
                event.preventDefault();

                const sessionId = String(Date.now());

                const session = {
                    id: sessionId,
                    room: "PeerLearnRoom" + sessionId,
                    ownerId: user.uid,
                    explainerName:
                        document.getElementById("explainerName").value.trim(),
                    subject:
                        document.getElementById("subject").value.trim(),
                    topic:
                        document.getElementById("topic").value.trim(),
                    date:
                        document.getElementById("sessionDate").value,
                    time:
                        document.getElementById("sessionTime").value,
                    duration:
                        document.getElementById("duration").value,
                    capacity:
                        document.getElementById("capacity").value
                };

                const message = document.getElementById("message");

                try {
                    await set(
                        ref(database, "sessions/" + sessionId),
                        session
                    );

                    message.textContent =
                        "Session created successfully! 🎉";

                    sessionForm.reset();
                } catch (error) {
                    console.error(error);
                    message.textContent =
                        "Could not create session. Please try again.";
                }
            });
        }

        // Listen for sessions shared through Firebase
        if (sessionList) {
            onValue(
                ref(database, "sessions"),
                function (snapshot) {
                    sessionList.innerHTML = "";

                    const sessions = [];

                    snapshot.forEach(function (childSnapshot) {
                        sessions.push(childSnapshot.val());
                    });

                    const countElement =
                        document.getElementById("sessionCount");

                    if (countElement) {
                        countElement.textContent =
                            "Total available sessions: " + sessions.length;
                    }

                    if (sessions.length === 0) {
                        sessionList.innerHTML =
                            "<p>No sessions available yet. Please check again later.</p>";
                        return;
                    }

                    sessions.forEach(function (session) {
                        const card = document.createElement("div");
                        card.className = "card";

                        const title = document.createElement("h3");
                        title.textContent = "📚 " + session.subject;
                        card.appendChild(title);

                        const details = [
                            "👩‍🏫 Explainer: " + session.explainerName,
                            "📖 Topic: " + session.topic,
                            "📅 Date: " + session.date,
                            "⏰ Time: " + session.time,
                            "⌛ Duration: " + session.duration + " minutes",
                            "👥 Maximum listeners: " + session.capacity
                        ];

                        details.forEach(function (detail) {
                            const paragraph = document.createElement("p");
                            paragraph.textContent = detail;
                            card.appendChild(paragraph);
                        });

                        const joinButton =
                            document.createElement("button");

                        joinButton.textContent = "🎥 Join Meeting";
                        joinButton.className = "btn";

                        joinButton.addEventListener("click", function () {
                            const roomName = session.room ||
                                ("PeerLearnRoom" + session.id);

                            window.location.href =
                                "meeting.html?room=" +
                                encodeURIComponent(roomName);
                        });

                        card.appendChild(joinButton);

                        // Only the session owner sees the delete button
                        if (session.ownerId === user.uid) {
                            const deleteButton =
                                document.createElement("button");

                            deleteButton.textContent = "🗑️ Delete Session";
                            deleteButton.className = "btn";
                            deleteButton.style.backgroundColor = "#dc3545";

                            deleteButton.addEventListener(
                                "click",
                                async function () {
                                    const confirmed = confirm(
                                        "Ma, are you sure you want to delete this session?"
                                    );

                                    if (!confirmed) return;

                                    try {
                                        await remove(
                                            ref(
                                                database,
                                                "sessions/" + session.id
                                            )
                                        );
                                    } catch (error) {
                                        console.error(error);
                                        alert(
                                            "Could not delete the session. Please try again."
                                        );
                                    }
                                }
                            );

                            card.appendChild(deleteButton);
                        }

                        sessionList.appendChild(card);
                    });
                },
                function (error) {
                    console.error(error);
                    sessionList.textContent =
                        "Unable to load sessions. Please check your connection.";
                }
            );
        }
    } catch (error) {
        console.error(error);

        const message = document.getElementById("message");

        if (message) {
            message.textContent =
                "Unable to connect to Firebase. Please try again.";
        }

        if (sessionList) {
            sessionList.textContent =
                "Unable to connect to Firebase. Please try again.";
        }
    }
}

startPeerLearn();
