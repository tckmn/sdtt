/* sdtt: slightly decent typing test
 * Copyright (C) 2017  KeyboardFire <andy@keyboardfire.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

window.addEventListener('load', function() {

var promptText = document.getElementById('promptText'),
    input = document.getElementById('input'),
    results = document.getElementById('results'),
    elapsed = document.getElementById('elapsed'),
    errorCount = document.getElementById('errorCount'),
    wpmOutput = document.getElementById('wpmOutput');

function levenshtein(s, t) {
    var m = s.length; n = t.length;

    // initialize DP matrix
    var dp = [];
    for (var i = 0; i <= m; ++i) {
        var row = [];
        for (var j = 0; j <= n; ++j) {
            row.push(i == 0 ? j : (j == 0 ? i : 0));
        }
        dp.push(row);
    }

    // walk through it
    for (var j = 1; j <= n; ++j) {
        for (var i = 1; i <= m; ++i) {
            dp[i][j] = Math.min(
                dp[i-1][j] + 1,                // delete
                dp[i][j-1] + 1,                // insert
                dp[i-1][j-1] + (s[i] != t[j])  // sub
            );
        }
    }

    return dp[m][n];
}

function startTest(text) {
    var test = {};

    test.text = text;
    promptText.textContent = text;

    input.value = '';
    input.addEventListener('keydown', test.keydown = function(e) {
        if (!test.startTime) test.startTime = new Date();
        if ((e.which || e.keyCode) == 13) {  // return
            stopTest(test);
            e.preventDefault();
            return false;
        }
    });

    results.style.display = 'none';

    return test;
}

function stopTest(test) {
    test.endTime = new Date();
    var elapsedTime = (test.endTime - test.startTime) / 1000;

    input.removeEventListener('keydown', test.keydown);

    results.style.display = 'block';
    elapsed.textContent = elapsedTime;
    errorCount.textContent = levenshtein(test.text, input.value);
    wpmOutput.textContent = (test.text.length / 5) / (elapsedTime / 60);
}

var test = startTest("What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little \"clever\" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.");

});
