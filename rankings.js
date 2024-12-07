document.addEventListener('DOMContentLoaded', () => {
    const rankingsTableBody = document.getElementById('rankings-table').querySelector('tbody');

    function loadRankings() {
        const scores = JSON.parse(localStorage.getItem('scores')) || {};
        const rankings = [];

        for (const user in scores) {
            scores[user].forEach(score => {
                rankings.push({ username: user, time: score.time, moves: score.moves });
            });
        }

        // Sort rankings by time (ascending) and then by moves (ascending)
        rankings.sort((a, b) => {
            if (a.time === b.time) {
                return a.moves - b.moves;
            }
            return a.time - b.time;
        });

        // Display the rankings in the table
        rankings.forEach(rank => {
            const row = document.createElement('tr');
            const usernameCell = document.createElement('td');
            const timeCell = document.createElement('td');
            const movesCell = document.createElement('td');

            usernameCell.textContent = rank.username;
            timeCell.textContent = rank.time;
            movesCell.textContent = rank.moves;

            row.appendChild(usernameCell);
            row.appendChild(timeCell);
            row.appendChild(movesCell);
            rankingsTableBody.appendChild(row);
        });
    }

    loadRankings();
});
