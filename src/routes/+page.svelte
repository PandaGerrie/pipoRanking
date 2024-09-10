<script>
	import { onMount } from 'svelte';

	let players = [];
	let showPopup = false;
	let showNewPlayerPopup = false;
	let newPlayerName = '';
    let showDeleteConfirmation = false;
	let winner = '';
	let loser = '';
    let playerToDelete = '';
    let playerToDeleteId = '';
    let deletePassword = '';

	onMount(async () => {
		const response = await fetch('/api/players');
		players = await response.json();
	});

    const addNewPlayer = async () => {
        if (newPlayerName) {
            try {
                const response = await fetch('/api/players', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: newPlayerName }),  
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const newPlayer = await response.json();
                players = [...players, newPlayer];
                newPlayerName = '';
                showNewPlayerPopup = false;
            } catch (error) {
                console.error("Error adding new player:", error);
                // Handle error (e.g., show an error message to the user)
            }
        }
    };

    const deletePlayer = async () => {
        try {
            const response = await fetch(`/api/players/${playerToDeleteId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Network response was not ok: ${response.status} ${errorData.error || ''}`);
            }
            players = players.filter(p => p.id !== playerToDeleteId);
            showDeleteConfirmation = false;
        } catch (error) {
            console.error("Error deleting player:", error);
            alert(`Failed to delete player: ${error.message}`);
        }
    };

    const showDeleteConfirmationPopup = (player) => {
        playerToDeleteName = player.name;
        playerToDeleteId = player.id;
        console.log(`Preparing to delete player: ${playerToDeleteName} with id: ${playerToDeleteId}`);
        showDeleteConfirmation = true;
    };
</script>

<section>
	<div class="container">
        <h1>Office Ping Pong Ranking</h1>
		<table>
			<thead>
				<tr>
					<th>Rank</th>
					<th>Name</th>
					<th>Points</th>
					<th>Games Played</th>
					<th>Ranking Score</th>
					<th><i class="fas fa-trash-alt"></i></th>
				</tr>
			</thead>
			<tbody>
				{#each players.sort((a, b) => (Math.ceil(b.points / b.numberOfGames) || 0) - (Math.ceil(a.points / a.numberOfGames) || 0)) as player, index}
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
						<td>{player.points}</td>
						<td>{player.numberOfGames}</td>
						<td>{Math.ceil(player.points / player.numberOfGames) || 0}</td>
						<td>
							<button on:click={() => {
								playerToDelete = player;
								playerToDeleteId = player.id;
								showDeleteConfirmation = true;
							}}>x</button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
		<div class="button-container">
			<button on:click={() => showNewPlayerPopup = true}>Voeg nieuwe speler toe</button>
			<button on:click={() => showPopup = true}>Voeg nieuwe score toe</button>
		</div>
	</div>
</section>

{#if showNewPlayerPopup}
	<div class="popup-overlay">
		<div class="popup">
			<h2>Naam nieuwe speler</h2>
			<input id="new-player-name" placeholder="Speler Naam" type="text" bind:value={newPlayerName}>
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
			<button class="delete-button" on:click={() => deletePlayer(playerToDelete.id)} disabled={deletePassword !== 'admin'}>Verwijder</button>
			<button class="cancel-button" on:click={() => showDeleteConfirmation = false}>Annuleer</button>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		font-family: Arial, Helvetica, sans-serif;
        background-color: #f0f0f0;
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
		color: #8a2be2;
	}

	.popup select, .popup button {
		width: 100%;
		padding: 10px;
		margin: 10px 0;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
	}

	.popup button {
		background-color: #8a2be2;
		color: white;
		border: none;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.popup button:hover {
		background-color: #7a1dd1;
	}

	.container {
		max-width: 1440px;
		margin: auto;
		padding: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	table {
		width: 60%;
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
		background-color: #8a2be2;
		color: white;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}
	td {
		background-color: white;
		border-bottom: 1px solid #e0e0e0;
	}
	tr:last-child td {
		border-bottom: none;
	}
	tr:nth-child(even) td {
		background-color: #f8f5ff;
	}
	tr:hover td {
		background-color: #f0e6ff;
		transition: background-color 0.3s ease;
	}
	.button-container {
		margin-top: 30px;
		width: 60%;
		display: flex;
		justify-content: space-between;
	}
	.button-container button {
		width: 48%;
		padding: 10px;
		background-color: #ffffff;
		color: #8a2be2;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}
	.button-container button:hover {
		background-color: #7a1dd1;
		color: #fff; 
	}  
	.delete-button:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.popup button.cancel-button {
		background: none;
		border: none;
		color: #8a2be2;
		text-decoration: underline;
		cursor: pointer;
		padding: 0;
		font: inherit;
		transition: color 0.3s ease;
	}
	.popup button.cancel-button:hover {
		color: #7a1dd1;
	}
	#new-player-name {
		width: 100%;
		padding: 8px;
		font-size: 16px;
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		box-sizing: border-box;
		margin-bottom: 15px;
		transition: border-color 0.3s ease;
	}
	#new-player-name:focus {
		outline: none;
		border-color: #8a2be2;
	}
    #new-player-name::placeholder {
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
		border: 1px solid #d0d0d0;
		border-radius: 4px;
		box-sizing: border-box;
		margin-bottom: 15px;
		transition: border-color 0.3s ease;
	}
	.popup select:focus {
		outline: none;
		border-color: #8a2be2;
	}
	.popup .select-container {
		margin-bottom: 20px;
	}
</style>
