<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    let players = [];
    let isLoading = true;
    let showPopup = false;
    let showNewPlayerPopup = false;
    let newPlayerName = '';
    let showDeleteConfirmation = false;
    let winner = '';
    let loser = '';
    let playerToDelete = '';
    let playerToDeleteId = '';
    let deletePassword = '';
	let newPlayerCompany = '';
	let newPlayerCompanyColor = '';
    const apiUrl = 'https://eu-central-1-shared-euc1-02.cdn.hygraph.com/content/cm0wg7mge00s407w1ccdvtrrt/master';
    const basicToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MjU5ODE2OTgsImF1ZCI6WyJodHRwczovL2FwaS1ldS1jZW50cmFsLTEtc2hhcmVkLWV1YzEtMDIuaHlncmFwaC5jb20vdjIvY20wd2c3bWdlMDBzNDA3dzFjY2R2dHJydC9tYXN0ZXIiLCJtYW5hZ2VtZW50LW5leHQuZ3JhcGhjbXMuY29tIl0sImlzcyI6Imh0dHBzOi8vbWFuYWdlbWVudC1ldS1jZW50cmFsLTEtc2hhcmVkLWV1YzEtMDIuaHlncmFwaC5jb20vIiwic3ViIjoiZDdiZmRkOTYtYTk3Yy00NWNkLThhZjYtNDdkYWVmN2VkMGQ4IiwianRpIjoiY20wd2t4dTJjMG95azA3dXlkNmViYTlpeiJ9.Fk1rz6rFlI7gDFZD-KaE5uve5g1S4s1knB-jPTDZfqlPg2qyQ4qnvVoKLqA6Zp_hXwXPwtZJtmnQoNUEldhkDu7M2mds-w7Cc5M6jGjBWmkd3b3QqU9QpQ8YTYamElC9pD16Iy97yGMcCkEPrOc4OpiKaoxC7fsXr15VFiFkP9f_PL7wDsZQpGXNcQVc1kgUdH5YaUbveiO1we9KXbwu18a3ZItE7yYeTI2K2pJkN5WaxydM6pQXE7YWcbOK86UV0WBqKCiXd7F79bgUi8N1-Ebump742wQMWqoCv5kQEmhxF7ebOD6bphubwgmAfS8UxmdH_vHZYUdyyrJbmA060QnvtMl8X2UExHmz78Tr-vZyGcX8_5SsvxPJkatKWW-1vWPNFXxkPQMeD-mGOy5zoNPzUNC_e_dgknN20qm3TYuq6haAX77ZYLirdfQ76jvKzn-knmK108EW22qncHPjO9uDWPvXlMRYoUxbA3WMa_tfyRIUEoGwjRPeN12S6ZnSK5PIhgYxg55xkm0X4wcuETtiYtEQDT0d_E3dkG1DfwFN983918h557aEc9hsUFodX28EZwe0yPwrKxxTUbPZHgrSo2m8BuT97_uI5VwgWenurxBv3ajRnOmwm6E5Tej7BP4mdHFRLs3HI20LXWLozoGZDZQH2RO7V5Gh5J8n8ww'; // Replace with your actual API key

    // Toast notification
    let toasts = [];
    const showToast = (message, type = 'info') => {
        const id = Date.now();
        toasts = [...toasts, { id, message, type }];
        setTimeout(() => {
            toasts = toasts.filter(t => t.id !== id);
        }, 3000);
    };

    onMount(async () => {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${basicToken}`
                },
                body: JSON.stringify({
                    query: `
                    {
                        players {
                            id
                            name
                            score
                            gamesPlayed
							companyColor {
							rgba {
								a
								b
								g
								r
							}
							}
							company
                        }
                    }
                    `
                })
            });

            const data = await response.json();
            console.log('API response:', data);

            if (data.data && Array.isArray(data.data.players)) {
                players = data.data.players;
                console.log('Players:', players);
            } else {
                console.error('Unexpected data structure:', data);
                players = [];
            }
        } catch (error) {
            console.error('Error fetching players:', error);
            players = [];
        } finally {
            isLoading = false;
        }
    });

    const addNewPlayer = async () => {
        if (newPlayerName) {
			console.log(newPlayerCompany);
            try {
                // Create the player
                const createResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${basicToken}`
                    },
                    body: JSON.stringify({
                        query: `
                        mutation AddPlayer($name: String!, $company: String!, $companyColor: Hex!) {
                            createPlayer(data: { 
                                name: $name, 
                                score: 0, 
                                gamesPlayed: 0,
                                company: $company,
                                companyColor: { hex: $companyColor }
                            }) {
                                id
                                name
                                score
                                gamesPlayed
                                company
                                companyColor {
                                    hex
                                }
                            }
                        }
                        `,
                        variables: { 
                            name: newPlayerName,
                            company: newPlayerCompany,
                            companyColor: newPlayerCompanyColor
                        }
                    })
                });

                const createData = await createResponse.json();
                if (createData.data && createData.data.createPlayer) {
                    const newPlayer = createData.data.createPlayer;
                } else {
                    console.error('Failed to create player:', createData.errors);
                    throw new Error('Failed to create player');
                }

                // Publish the player
                const publishResponse = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${basicToken}`
                    },
                    body: JSON.stringify({
                        query: `
                        mutation PublishPlayer($id: ID!) {
                            publishPlayer(where: {id: $id}) {
                                id
                            }
                        }
                        `,
                        variables: { id: createData.data.createPlayer.id }
                    })
                });
                const publishData = await publishResponse.json();

                if (publishData.data.publishPlayer) {
                    // Refresh the players list
                    newPlayerName = '';
                    newPlayerCompany = '';
                    newPlayerCompanyColor = '#000000';
                    showNewPlayerPopup = false;
                    showToast(`New player ${newPlayerName} added successfully`, 'success');
                    await refreshPlayers();
                } else {
                    console.error('Failed to publish player');
                    showToast('Failed to add new player', 'error');
                }
            } catch (error) {
                console.error('Error adding new player:', error);
                showToast('Error adding new player', 'error');
            }
        }
    };

    const refreshPlayers = async () => {        // Reload the page
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    };

    const deletePlayer = async () => {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${basicToken}`
                },
                body: JSON.stringify({
                    query: `
                    mutation DeletePlayer($id: ID!) {
                        deletePlayer(where: { id: $id }) {
                            id
                        }
                    }
                    `,
                    variables: { id: playerToDeleteId }
                })
            });

            const data = await response.json();
            if (data.data.deletePlayer) {
                players = players.filter(p => p.id !== playerToDeleteId);
                showDeleteConfirmation = false;
                showToast(`Player ${playerToDelete.name} deleted successfully`, 'success');
            }
        } catch (error) {
            console.error('Error deleting player:', error);
            showToast('Error deleting player', 'error');
        }
    };

    const showDeleteConfirmationPopup = (player) => {
        playerToDelete = player;
        playerToDeleteId = player.id;
        console.log(`Preparing to delete player: ${player.name} with id: ${player.id}`);
        showDeleteConfirmation = true;
    };

    // You'll need to implement updateScore function
    const updateScore = async () => {
        try {
            // Fetch current scores for winner and loser
            const playersQuery = `
                query GetPlayers($winner: String!, $loser: String!) {
                    winner: players(where: {name: $winner}) {
                        id
                        score
                        gamesPlayed
                    }
                    loser: players(where: {name: $loser}) {
                        id
                        score
                        gamesPlayed
                    }
                }
            `;

            const playersResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${basicToken}`
                },
                body: JSON.stringify({
                    query: playersQuery,
                    variables: { winner, loser }
                })
            });

            const playersData = await playersResponse.json();
            if (!playersData.data || !playersData.data.winner || !playersData.data.loser) {
                console.error('Failed to fetch player data:', playersData);
                throw new Error('Failed to fetch player data');
            }
            const winnerData = playersData.data.winner[0];
            const loserData = playersData.data.loser[0];

            if (!winnerData || !loserData) {
                console.error('Winner or loser not found:', { winner, loser });
                throw new Error('Winner or loser not found');
            }

            // Calculate new scores
            let pointsForWinner = 2.00;
            if (winnerData.score !== 0.00 || loserData.score !== 0.00) {
                const scoreDifference = winnerData.score - loserData.score;
				console.log(winnerData.score);
				console.log(loserData.score);
                const extraPoints = Math.min(3.00, Math.max(0.00, -scoreDifference / 50.00));
				console.log(extraPoints);
                pointsForWinner += extraPoints;
            }

            const newWinnerScore = Number((winnerData.score + pointsForWinner).toFixed(2));
            const newLoserScore = Number(loserData.score.toFixed(2)); // Loser's score remains unchanged

            // Update scores in Hygraph
            const updateMutation = `
                mutation UpdateScores($winnerId: ID!, $loserId: ID!, $winnerScore: Float!, $loserScore: Float!, $winnerGames: Float!, $loserGames: Float!) {
                    updateWinner: updatePlayer(where: {id: $winnerId}, data: {score: $winnerScore, gamesPlayed: $winnerGames}) {
                        id
                        score
                        gamesPlayed
                    }
                    updateLoser: updatePlayer(where: {id: $loserId}, data: {score: $loserScore, gamesPlayed: $loserGames}) {
                        id
                        score
                        gamesPlayed
                    }
                    publishWinner: publishPlayer(where: {id: $winnerId}, to: PUBLISHED) {
                        id
                    }
                    publishLoser: publishPlayer(where: {id: $loserId}, to: PUBLISHED) {
                        id
                    }
                }
            `;

            const updateResponse = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${basicToken}`
                },
                body: JSON.stringify({
                    query: updateMutation,
                    variables: {
                        winnerId: winnerData.id,
                        loserId: loserData.id,
                        winnerScore: newWinnerScore,
                        loserScore: newLoserScore,
                        winnerGames: Number((winnerData.gamesPlayed + 1.00).toFixed(2)),
                        loserGames: Number((loserData.gamesPlayed + 1.00).toFixed(2))
                    }
                })
            });

            const updateData = await updateResponse.json();
            if (updateData.data && updateData.data.updateWinner && updateData.data.updateLoser &&
                updateData.data.publishWinner && updateData.data.publishLoser) {
                console.log(`Scores updated and published - Winner: ${winner}, Loser: ${loser}`);
                // Update local players array
                players = players.map(p => {
                    if (p.id === winnerData.id) {
                        return { ...p, score: newWinnerScore, gamesPlayed: Number((winnerData.gamesPlayed + 1.00).toFixed(2)) };
                    } else if (p.id === loserData.id) {
                        return { ...p, score: newLoserScore, gamesPlayed: Number((loserData.gamesPlayed + 1.00).toFixed(2)) };
                    }
                    return p;
                });
            } else {
                console.error('Failed to update or publish scores:', updateData);
                throw new Error('Failed to update or publish scores');
            }
        } catch (error) {
            console.error('Error updating scores:', error);
            // You might want to show an error message to the user here
        }
        showPopup = false;
    };

    $: sortedPlayers = isLoading ? [] : [...players].sort((a, b) => {
        const aScore = Number(a.score) / (Number(a.gamesPlayed) || 1) || 0;
        const bScore = Number(b.score) / (Number(b.gamesPlayed) || 1) || 0;
        return bScore - aScore;
    });

    $: {
        if (!isLoading) {
            console.log('Sorted Players:', sortedPlayers);
        }
    }
</script>

<section>
    <div class="container">
		<img src="/195523.png" alt="Ping Pong Illustration" style="display: block; margin: 0 auto; max-width: 40px;">
		<h1 style="text-align: center; margin-bottom: 30px; font-size: 24px; font-weight: 600; margin-top: 5px;"> Office Ping Pong Ranking </h1>
        {#if isLoading}
            <p style="text-align: center;">Loading players...</p>
        {:else}
            <table>
                <!-- Table header -->
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Name</th>
                        <th>Score</th>
                        <th>Games Played</th>
                        <th>Ranking Score</th>
                        <th>Company</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {#each sortedPlayers as player, index}
                        <tr>
                            <td>
                                {#if index === 0}
                                    🥇
                                {:else if index === 1}
                                    🥈
                                {:else if index === 2}
                                    🥉
                                {:else}
                                    {index + 1}
                                {/if}
                            </td>
                            <td>{player.name}</td>
                            <td>{player.score}</td>
                            <td>{player.gamesPlayed}</td>
                            <td>{((Number(player.score) / (Number(player.gamesPlayed) || 1)) || 0).toFixed(1)}</td>
                            <td>
                                <div style="
                                    background-color: rgba({player.companyColor?.rgba?.r ?? 0}, {player.companyColor?.rgba?.g ?? 0}, {player.companyColor?.rgba?.b ?? 0}, 0.15);
                                    color: rgb({player.companyColor?.rgba?.r ?? 0}, {player.companyColor?.rgba?.g ?? 0}, {player.companyColor?.rgba?.b ?? 0});
                                    padding: 4px 8px;
                                    border-radius: 300px;
                                    display: inline-block;
									font-size: 12px; 
									width: 80%;
									text-align: center;
									margin: 0 auto;
                                ">
                                    {player.company ?? ''}
                                </div>
                            </td>
                            <td>
                                <button on:click={() => showDeleteConfirmationPopup(player)}>x</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {/if}
		<div class="button-container">
			<button on:click={() => showNewPlayerPopup = true}>Nieuwe Speler Toevoegen</button>
			<button on:click={() => showPopup = true}>Nieuwe Uitslag Toevoegen</button>
		</div>
	</div>
</section>



{#if showNewPlayerPopup}
    <div class="popup-overlay">
        <div class="popup">
            <h2>Add New Player</h2>
            <input id="new-player-name" placeholder="Player Name" type="text" bind:value={newPlayerName}>
            <input id="new-player-company" placeholder="Company" type="text" bind:value={newPlayerCompany}>
			<div class="color-input-container">
				<label for="company-color">Company Color:</label>
				<div class="color-selection">
					{#each [
						{ value: "#FFD700" },  // Yellow variant (dark pastel)
						{ value: "#FFA07A" },  // Orange variant (dark pastel)
						{ value: "#98FB98" },  // Green variant 1 (dark pastel)
						{ value: "#3CB371" },  // Green variant 2 (dark pastel)
						{ value: "#40E0D0" },  // Turquoise variant (dark pastel)
						{ value: "#6495ED" },  // Blue variant 1 (dark pastel)
						{ value: "#4682B4" },  // Blue variant 2 (dark pastel)
						{ value: "#DDA0DD" },  // Purple variant 1 (dark pastel)
						{ value: "#9370DB" },  // Purple variant 2 (dark pastel)
						{ value: "#CD5C5C" },  // Red variant 1 (dark pastel)
						{ value: "#DC143C" },  // Red variant 2 (dark pastel)
						{ value: "#000000" }   // Black
					] as color}
						<button
							class="color-circle"
							style="background-color: {color.value}; border: 4px solid {newPlayerCompanyColor === color.value ? '#444' : '#F0F0F0'};"
							on:click={() => newPlayerCompanyColor = color.value}
							aria-label="Select color {color.value}"
						>
						</button>
					{/each}
				</div>
			</div>
            <button on:click={addNewPlayer} disabled={!newPlayerName}>Voeg speler toe</button>
            <button class="cancel-button" on:click={() => showNewPlayerPopup = false}>Sluiten</button>
        </div>
    </div>
{/if}

{#if showPopup}
    <div class="popup-overlay">
        <div class="popup">
            <h2>Uitslag laatste spel</h2>
            <label for="winner-select">Winner</label>
            <select id="winner-select" bind:value={winner}>
                <option value="">Selecteer winnaar</option>
                {#each players as player}
                    <option value={player.name}>{player.name}</option>
                {/each}
            </select>
            <label for="loser-select">Loser</label>
            <select id="loser-select" bind:value={loser}>
                <option value="">Selecteer verliezer</option>
                {#each players as player}
                    <option value={player.name}>{player.name}</option>
                {/each}
            </select>
            <button on:click={updateScore} disabled={!winner || !loser}>Voeg score toe</button>
            <button class="cancel-button" on:click={() => showPopup = false}>Sluiten</button>
        </div>
    </div>
{/if}

{#if showDeleteConfirmation}
    <div class="popup-overlay">
        <div class="popup">
            <h2>Bevestig verwijdering</h2>
            <p>Weet je zeker dat je de speler {playerToDelete.name} wilt verwijderen?</p>
            <label for="delete-password">Wachtwoord:</label>
            <input type="password" id="delete-password" bind:value={deletePassword}>
            <button class="delete-button" on:click={deletePlayer} disabled={deletePassword !== 'admin'}>Verwijder</button>
            <button class="cancel-button" on:click={() => showDeleteConfirmation = false}>Annuleer</button>
        </div>
    </div>
{/if}

<div class="toast-container">
    {#each toasts as toast (toast.id)}
        <div transition:fade="{{ duration: 300 }}" class="toast" class:error={toast.type === 'error'} class:success={toast.type === 'success'}>
            {toast.message}
        </div>
    {/each}
</div>

<style>
    :global(body) {
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f0f5ff;
    }
    .popup-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .popup {
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 90%;
        z-index: 1001;
    }

    .popup h2 {
        margin-top: 0;
        color: #9370DB;
    }

    .popup select, .popup button {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #e0e0ff;
        border-radius: 4px;
    }

    .popup button {
        background-color: #9370DB;
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .popup button:hover {
        background-color: #8A6BBE;
    }

    .container {
        max-width: 1440px;
        margin: auto;
        padding: 20px;
    }
    table {
        width: 80%;
        margin: 0 auto;
        border-collapse: separate;
        border-spacing: 0;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    th, td {
        padding: 12px 15px;
        text-align: left;
    }
    th {
        background-color: #9370DB;
        color: white;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    td {
        background-color: white;
        border-bottom: 1px solid #e0e0ff;
    }
    tr:last-child td {
        border-bottom: none;
    }
    tr:nth-child(even) td {
        background-color: #f5f0ff;
    }
    tr:hover td {
        background-color: #e6e0ff;
        transition: background-color 0.3s ease;
    }
    .button-container {
        margin: 30px auto; 
        width: 80%;
        display: flex;
        justify-content: space-between;
    }
    .button-container button {
        width: 48%;
        padding: 10px;
        background-color: #ffffff;
        color: #9370DB;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    .button-container button:hover {
        background-color: #8A6BBE;
        color: #fff; 
    }  
    .delete-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .popup button.cancel-button {
        background: none;
        border: none;
        color: #9370DB;
        text-decoration: underline;
        cursor: pointer;
        padding: 0;
        font: inherit;
        transition: color 0.3s ease;
    }
    .popup button.cancel-button:hover {
        color: #8A6BBE;
    }
    #new-player-name, #new-player-company {
        width: 100%;
        padding: 8px;
        font-size: 16px;
        border: 1px solid #d0d0ff;
        border-radius: 4px;
        box-sizing: border-box;
        margin-bottom: 15px;
        transition: border-color 0.3s ease;
    }
    #new-player-name:focus, #new-player-company:focus {
        outline: none;
        border-color: #9370DB;
    }
    #new-player-name::placeholder, #new-player-company::placeholder {
        opacity: .3;
    }
    .popup h2, .popup p {
        text-align: center;
        margin-bottom: 20px;
    }
    .popup label {
        display: inline-block;
        width: 80px;
        margin-right: 10px;
        text-align: right;
    }
    .popup select {
        width: calc(100% - 105px);
        padding: 8px;
        font-size: 16px;
        border: 1px solid #d0d0ff;
        border-radius: 4px;
        box-sizing: border-box;
        margin-bottom: 15px;
        transition: border-color 0.3s ease;
    }
    .popup select:focus {
        outline: none;
        border-color: #9370DB;
    }

	.color-input-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 15px;
    }
    .color-input-container label {
        margin-bottom: 20px;
		margin-top: 20px;
        text-align: center;
		width: 100% !important;
    }
    .color-selection {
        display: grid;
        grid-template-columns: repeat(8, 1fr);
        gap: 10px;
        width: 100%;
    }
    .color-circle {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.2s ease;
    }
    .color-circle:hover {
        transform: scale(1.1);
    }

    .toast-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
    }
    .toast {
        background-color: #333;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        margin-top: 10px;
    }
    .toast.error {
        background-color: #a05a56;
    }
    .toast.success {
        background-color: #704a80;
    }

    @media (max-width: 768px) {
        .popup {
            margin: 0 10px;
        }
        table {
            font-size: 14px;
            width: 100%;
            overflow-x: auto;
            display: block;
        }
        .button-container {
            flex-direction: column;
            width: 100%;
        }
        .button-container button {
            width: 100%;
            margin-bottom: 10px;
        }
    }
</style>
