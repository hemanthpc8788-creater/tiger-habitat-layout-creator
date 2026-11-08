const zones = [
    "Sleeping Area",
    "Food Storage",
    "Medical Room",
    "Research Lab",
    "Control Room",
    "Exercise Area",
    "Airlock"
];

let selectedZone = null;
let layout = Array(9).fill(null);

const zoneList = document.getElementById("zoneList");
const floorPlan = document.getElementById("floorPlan");

function displayZones() {
    zoneList.innerHTML = "";

    zones.forEach(zone => {
        const div = document.createElement("div");

        div.className = "zone";
        div.textContent = zone;

        div.onclick = () => {
            selectedZone = zone;

            document.querySelectorAll(".zone")
                .forEach(item => item.classList.remove("selected"));

            div.classList.add("selected");
        };

        zoneList.appendChild(div);
    });
}

function displayFloor() {
    floorPlan.innerHTML = "";

    layout.forEach((zone, index) => {
        const tile = document.createElement("div");

        tile.className = "tile";

        if (zone) {
            tile.classList.add("filled");
            tile.textContent = zone;
        } else {
            tile.textContent = "Empty Position";
        }

        tile.onclick = () => {
            if (!selectedZone) {
                alert("Please select a functional zone first!");
                return;
            }

            if (layout[index]) {
                alert("This position is already occupied!");
                return;
            }

            layout[index] = selectedZone;
            selectedZone = null;

            displayZones();
            displayFloor();
        };

        floorPlan.appendChild(tile);
    });
}

function resetLayout() {
    layout = Array(9).fill(null);
    selectedZone = null;

    displayZones();
    displayFloor();

    document.getElementById("result").textContent =
        "Layout has been reset.";

    document.getElementById("suggestions").textContent = "";
}

function runChecks() {
    validateLayout();
}

function validateLayout() {
    const crew = Number(document.getElementById("crew").value);
    const duration = Number(document.getElementById("duration").value);

    const result = document.getElementById("result");
    const suggestions = document.getElementById("suggestions");

    if (!Number.isInteger(crew) || crew < 1 ||
        !Number.isInteger(duration) || duration < 1) {

        result.textContent =
            "Please enter valid positive whole numbers.";
        suggestions.textContent = "";
        return;
    }

    const placed = layout.filter(Boolean);
    const missing = zones.filter(zone => !placed.includes(zone));

    result.innerHTML =
        "Crew Size: " + crew +
        "<br>Mission Duration: " + duration + " days" +
        "<br>Zones Placed: " + placed.length +
        "<br>Empty Positions: " + (9 - placed.length);

    if (missing.length === 0) {
        suggestions.textContent =
            "All seven functional zones have been placed.";
    } else {
        suggestions.textContent =
            "Suggestions: Place the missing zones: " +
            missing.join(", ");
    }
}

function saveLayout() {
    const data = {
        crew: document.getElementById("crew").value,
        duration: document.getElementById("duration").value,
        shape: document.getElementById("shape").value,
        layout: layout
    };

    localStorage.setItem("tigerHabitat", JSON.stringify(data));

    alert("Habitat layout saved successfully!");
}

function exportJSON() {
    const data = {
        crew: document.getElementById("crew").value,
        duration: document.getElementById("duration").value,
        shape: document.getElementById("shape").value,
        layout: layout
    };

    const file = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    const link = document.createElement("a");
    link.href = URL.createObjectURL(file);
    link.download = "tiger-habitat-layout.json";
    link.click();

    URL.revokeObjectURL(link.href);
}

displayZones();
displayFloor();