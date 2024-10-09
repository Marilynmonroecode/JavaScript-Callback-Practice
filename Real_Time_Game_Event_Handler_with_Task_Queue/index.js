function executeGameEvents(events, callback) {
    const TIMEOUT_DURATION = 5000; // 5 seconds
    const FAILURE_RATE = 0.2; // 20% chance of failure

    // Define a function that processes each event
    function processEvent(index) {
        if (index >= events.length) {
            console.log("All events completed.");
            callback("All events completed."); // Call the callback when done
            return; // All events have been processed
        }

        // Get the current event
        const event = events[index];

        // Log the start of the event
        console.log(`Starting event: ${event.name}`);

        // Use a promise to handle the event completion
        const eventPromise = new Promise((resolve, reject) => {
            // Simulate a random failure
            const isFailure = Math.random() < FAILURE_RATE;

            // Simulate the asynchronous event with a timeout
            const eventTimeout = setTimeout(() => {
                if (isFailure) {
                    reject(new Error(`${event.name} failed!`));
                } else {
                    event.action();
                    resolve(`${event.name} completed successfully.`);
                }
            }, 2000); // Simulating a delay of 2 seconds for each event

            // Handle timeout
            const timeoutHandler = setTimeout(() => {
                clearTimeout(eventTimeout); // Clear the event timeout
                reject(new Error(`${event.name} timed out!`));
            }, TIMEOUT_DURATION);
        });

        // Handle the promise
        eventPromise
            .then((message) => {
                console.log(message);
                processEvent(index + 1); // Process the next event
            })
            .catch((error) => {
                console.error(error.message);
                processEvent(index + 1); // Move on to the next event even if this one fails
            });
    }

    // Start processing events from the first one
    processEvent(0);
}

// Mock event actions
const encounterEnemy = {
    name: 'Encounter Enemy',
    action: () => console.log("You encountered an enemy!"),
};

const defeatEnemy = {
    name: 'Defeat Enemy',
    action: () => console.log("You defeated the enemy!"),
};

const collectLoot = {
    name: 'Collect Loot',
    action: () => {
        const isFailure = Math.random() < 0.2; // 20% failure rate for collecting loot
        if (isFailure) {
            throw new Error("Loot collection failed due to random failure");
        } else {
            console.log("Loot collected successfully");
        }
    },
};

// Test cases
console.log("Test Case 1:");
executeGameEvents([encounterEnemy, defeatEnemy, collectLoot], function(result) {
    console.log(result); // Expected: "Loot collected successfully"
});

console.log("Test Case 2:");
executeGameEvents([encounterEnemy, defeatEnemy, collectLoot], function(result) {
    console.log(result); // Expected: "Loot collection failed due to random failure"
});

console.log("Test Case 3:");
executeGameEvents([encounterEnemy, defeatEnemy, collectLoot], function(result) {
    console.log(result); // Expected: "Timed-out event, moving to next"
});
