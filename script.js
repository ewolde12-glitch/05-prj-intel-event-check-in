// Maximum number of attendees
const maxAttendees = 50;
const storageKey = "summitCheckInProgress";

// Attendance counters
let totalAttendees = 0;
let attendees = [];

const teamCounts = {
  water: 0,
  zero: 0,
  power: 0
};

// Get elements from the HTML
const form = document.getElementById("checkInForm");
const attendeeName = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");

const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");
const attendeeList = document.getElementById("attendeeList");
const emptyAttendeeList = document.getElementById("emptyAttendeeList");

// Listen for form submission
form.addEventListener("submit", function (event) {
  // Prevent the page from refreshing
  event.preventDefault();

  // Capture the user's input
  const name = attendeeName.value.trim();
  const team = teamSelect.value;

  // Make sure the form is complete
  if (name === "" || team === "") {
    greeting.textContent = "Please enter your name and select a team.";
    greeting.className = "";
    greeting.style.display = "block";
    return;
  }

  // Check if the event is already full
  if (totalAttendees >= maxAttendees) {
    greeting.textContent =
      "Sorry, the summit has reached the maximum capacity of 50 attendees.";
    greeting.className = "";
    greeting.style.display = "block";
    return;
  }

  // Increase total attendance
  totalAttendees++;

  // Increase the selected team's count
  teamCounts[team]++;

  // Create a team name for the welcome message
  let teamName;

  if (team === "water") {
    teamName = "Team Water Wise";
  } else if (team === "zero") {
    teamName = "Team Net Zero";
  } else if (team === "power") {
    teamName = "Team Renewables";
  }

  attendees.push({ name: name, team: teamName });

  // Update the page and save the current progress
  updateAttendance();
  updateTeamCounts();
  updateAttendeeList();
  saveProgress();

  if (totalAttendees === maxAttendees) {
    celebrate();
  }

  // Calculate progress percentage
  const progress = (totalAttendees / maxAttendees) * 100;

  // Display welcome message
  greeting.textContent =
    `Welcome, ${name}! 🌱 You are checked in with ${teamName}. ` +
    `We now have ${totalAttendees} attendee${totalAttendees === 1 ? "" : "s"} ` +
    `(${Math.round(progress)}% of capacity).`;

  greeting.className = "success-message";
  greeting.style.display = "block";

  // Clear the form
  attendeeName.value = "";
  teamSelect.value = "";
});

// Update total attendance and progress bar
function updateAttendance() {
  attendeeCount.textContent = totalAttendees;

  // Calculate percentage
  const progress = (totalAttendees / maxAttendees) * 100;

  // Update progress bar width
  progressBar.style.width = `${progress}%`;

  // Add accessibility information
  progressBar.setAttribute("aria-valuenow", progress);
}

// Update individual team counts
function updateTeamCounts() {
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;
}

// Save attendance counts and attendee names in the browser
function saveProgress() {
  const progress = {
    totalAttendees: totalAttendees,
    teamCounts: teamCounts,
    attendees: attendees
  };

  localStorage.setItem(storageKey, JSON.stringify(progress));
}

// Restore saved progress when the page loads
function loadProgress() {
  const savedProgress = localStorage.getItem(storageKey);

  if (savedProgress === null) {
    return;
  }

  try {
    const progress = JSON.parse(savedProgress);

    if (
      !Array.isArray(progress.attendees) ||
      !progress.teamCounts ||
      !Number.isInteger(progress.totalAttendees) ||
      progress.totalAttendees < 0 ||
      progress.totalAttendees > maxAttendees ||
      !Number.isInteger(progress.teamCounts.water) ||
      !Number.isInteger(progress.teamCounts.zero) ||
      !Number.isInteger(progress.teamCounts.power)
    ) {
      localStorage.removeItem(storageKey);
      return;
    }

    totalAttendees = progress.totalAttendees;
    teamCounts.water = progress.teamCounts.water;
    teamCounts.zero = progress.teamCounts.zero;
    teamCounts.power = progress.teamCounts.power;
    attendees = progress.attendees;
  } catch (error) {
    localStorage.removeItem(storageKey);
  }
}

// Display attendee names and teams beneath the team counters
function updateAttendeeList() {
  attendeeList.textContent = "";

  for (let index = 0; index < attendees.length; index++) {
    const attendee = attendees[index];
    const listItem = document.createElement("li");
    const name = document.createElement("span");
    const team = document.createElement("span");

    name.className = "attendee-name";
    name.textContent = attendee.name;
    team.className = "attendee-team";
    team.textContent = attendee.team;

    listItem.appendChild(name);
    listItem.appendChild(team);
    attendeeList.appendChild(listItem);
  }

  emptyAttendeeList.style.display = attendees.length === 0 ? "block" : "none";
}

loadProgress();
updateAttendance();
updateTeamCounts();
updateAttendeeList();

//celebrate feature function : sendds an alet when the bar is full/when there is 50 attendees
function celebrate() {
  if (totalAttendees >= maxAttendees) {
    alert("🎉 Congratulations! The summit is now at full capacity with 50 attendees! 🎉");
  }
}
