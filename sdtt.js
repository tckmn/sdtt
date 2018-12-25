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

var test = startTest("Words per minute, commonly abbreviated wpm (sometimes uppercased WPM), is a measure of words processed in a minute, often used as a measurement of the speed of typing, reading or Morse code sending and receiving.");

});
