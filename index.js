const __steamId = null; // Enter your steam ID here

const gameKeys = {};
let isSteamServiceAvailable = true;
let steamGames = null;

const beep = (function() {
    var ctxClass = window.audioContext || window.AudioContext || window.AudioContext || window.webkitAudioContext
    var ctx = new ctxClass();
    return function(duration, finishedCallback) {
        duration = +duration;
        if (typeof finishedCallback != "function") {
            finishedCallback = function() {};
        }

        var osc = ctx.createOscillator();
        osc.connect(ctx.destination);
        if (osc.noteOn) osc.noteOn(0);
        if (osc.start) osc.start();

        setTimeout(function() {
            if (osc.noteOff) osc.noteOff(0);
            if (osc.stop) osc.stop();
            finishedCallback();
        }, duration);
    };
})();

function checkPage() {
    const rows = document.querySelectorAll('.unredeemed-keys-table>tbody>tr');
    for (const row of rows) {
        const platform = row.querySelector('.platform>i').getAttribute('title');
        const name = row.querySelector('.game-name>h4').getAttribute('title');

        if (gameKeys[platform] == undefined)
            gameKeys[platform] = {};

        if (gameKeys[platform][name] == undefined)
            gameKeys[platform][name] = { count: 0, owned: false, wishlistedBy: [] };

        gameKeys[platform][name].count++;

        if (steamGames && !!steamGames.find(f => f.name === name)) {
            gameKeys[platform][name].owned = true;
        }
    }
}

function nextPage() {
    const nextButton = document.querySelector('.jump-to-page>i.hb.hb-chevron-right');
    if (nextButton) {
        nextButton.click();
        return true;
    } else {
        return false;
    }
}

async function getOwnedSteamGames(steamId) {
    const response = await fetch(`https://localhost:5001/api/games/owned/${steamId}`);
    jsonResponse = await response.json();
    const ownedGames = jsonResponse.data.ownedGames;
    return ownedGames;
}



// Start logic
if (isSteamServiceAvailable && __steamId) {
    steamGames = await getOwnedSteamGames(__steamId);
}

do {
    checkPage();
} while (nextPage());

console.log(gameKeys);

beep(100);
setTimeout(() => {
    beep(100);
}, 150)