const gameKeys = {};

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
            gameKeys[platform] = [];

        gameKeys[platform].push(name);
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

do {
    checkPage();
} while (nextPage());

console.log(gameKeys);

beep(100);
setTimeout(() => {
    beep(100);
}, 150)