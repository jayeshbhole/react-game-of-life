import { useState } from "react";
import useInterval from "./useInterval";
import produce from "immer";
import "./styles.scss";

const lineBetween = (setLifeGrid) => {
	setLifeGrid(() => {
		const grid = Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => 1));
		grid[13] = Array.from({ length: 30 }, () => 0);
		grid[14] = Array.from({ length: 30 }, () => 0);
		grid[15] = Array.from({ length: 30 }, () => 0);
		return grid;
	});
};
const fourQuarters = (setLifeGrid) => {
	setLifeGrid(() => {
		const grid = Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => 1));
		grid[13] = Array.from({ length: 30 }, () => 0);
		grid[14] = Array.from({ length: 30 }, () => 0);
		grid[15] = Array.from({ length: 30 }, () => 0);
		grid[16] = Array.from({ length: 30 }, () => 0);

		for (let i = 0; i < 30; i++) {
			grid[i][13] = 0;
		}
		for (let i = 0; i < 30; i++) {
			grid[i][14] = 0;
		}
		for (let i = 0; i < 30; i++) {
			grid[i][15] = 0;
		}
		for (let i = 0; i < 30; i++) {
			grid[i][16] = 0;
		}

		return grid;
	});
};
const random = (setLifeGrid) => {
	setLifeGrid(
		Array.from({ length: 30 }, () =>
			Array.from({ length: 30 }, () => Math.floor(Math.random() * 1.5))
		)
	);
};
const reset = (setLifeGrid, setRunning) => {
	setRunning(false);
	setLifeGrid(Array.from({ length: 30 }, () => Array.from({ length: 30 }, () => 0)));
};

function App() {
	const [running, setRunning] = useState(false);
	const [lifeGrid, setLifeGrid] = useState(
		Array.from({ length: 30 }, () =>
			Array.from({ length: 30 }, () => Math.floor(Math.random() * 1.5))
		)
	);

	useInterval(
		() => {
			setLifeGrid((grid) => {
				const newGrid = Array.from({ length: 30 }, () =>
					Array.from({ length: 30 }, () => 0)
				);
				const get = (x, y, r = grid[x]) => {
					return r ? r[y] || 0 : 0;
				};
				const countNeighbors = (x, y) => {
					return (
						get(x - 1, y - 1) +
						get(x - 1, y) +
						get(x - 1, y + 1) +
						get(x, y - 1) +
						get(x, y + 1) +
						get(x + 1, y - 1) +
						get(x + 1, y) +
						get(x + 1, y + 1)
					);
				};
				for (let x = 0; x < 30; x++) {
					for (let y = 0; y < 30; y++) {
						const neighbors = countNeighbors(x, y);
						if (get(x, y)) {
							if (neighbors < 2) {
								newGrid[x][y] = 0;
							} else if (neighbors < 4) {
								newGrid[x][y] = 1;
							} else {
								newGrid[x][y] = 0;
							}
						} else if (neighbors === 3) {
							newGrid[x][y] = 1;
						} else {
							newGrid[x][y] = 0;
						}
					}
				}
				return newGrid;
			});
		},
		running ? 100 : null
	);

	return (
		<div className="App">
			<h1>Game of Life</h1>

			<button onClick={() => setRunning(true)}>Start</button>
			<button onClick={() => setRunning(false)}>Stop</button>
			<button onClick={() => reset(setLifeGrid, setRunning)}>Reset</button>
			<button onClick={() => random(setLifeGrid)}>Random</button>
			<button onClick={() => lineBetween(setLifeGrid)}>Line B/w</button>
			<button onClick={() => fourQuarters(setLifeGrid)}>Four Quarters</button>

			<div className="grid">
				{lifeGrid.map((row, i) =>
					row.map((_, k) => (
						<div
							key={`${i}-${k}`}
							className={`cell ${!!lifeGrid[i][k]}`}
							onClick={() =>
								setLifeGrid(
									produce(lifeGrid, (gridCopy) => {
										gridCopy[i][k] = gridCopy[i][k] ^ 1;
									})
								)
							}
						/>
					))
				)}
			</div>
		</div>
	);
}

export default App;
