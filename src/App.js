//  CSS
import './App.css';

// React
import { useCallback, useEffect, useState } from 'react';

// data
import { wordsList } from './data/words';

// components
import StartScreen from './components/StartScreen';
import Game from './components/Game';
import GameOver from './components/GameOver';

const stages = [
	{ id: 1, name: "start" },
	{ id: 2, name: "game" },
	{ id: 3, name: "end" },
];

function App() {
	const [gameStage, setGameStage] = useState(stages[0].name);
	const [words] = useState(wordsList);

	const [pickedWord, setPickedWord] = useState("");
	const [pickedCategory, setPickedCategory] = useState("");
	const [letters, setLetters] = useState([]);

	const [guessedLetters, setGuessedLetters] = useState([]);
	const [wrongLetters, setWrongLetters] = useState([]);
	const [guesses, setGuesses] = useState(3);
	const [score, setScore] = useState(0);

	const pickWordAndCategory = useCallback(() => {
		const categories =  Object.keys(words);
		const category = categories[Math.floor(Math.random() * Object.keys(categories).length)];

		// escolha de uma palavra aleatoriamente
		const word = words[category][Math.floor(Math.random() * words[category].length)];
  
	  	// console.log(category, word);

		return { category, word };
	}, [words]);

	// start palavra secreta
	const startGame = useCallback(() => {
		// Limpa todas as letras
		clearLettersStates();

		// escolha de categoria e palavra
		const { word, category } = pickWordAndCategory();

		let wordLetters = word.split("");
		wordLetters = wordLetters.map((l) => l.toLowerCase());

		setPickedCategory(category);
		setPickedWord(word);
		setLetters(wordLetters);

		setGameStage(stages[1].name);
	}, [pickWordAndCategory]);

	// processo do input da letra
	const verifyLetter = (letter) => {
		const normalizedLetter = letter.toLowerCase();

		// verifica se a letra ja foi utilizada
		if (guessedLetters.includes(normalizedLetter) || wrongLetters.includes(normalizedLetter)) {
			return;
		}

		if (letters.includes(normalizedLetter)) {
			setGuessedLetters((actualGuessedLetters) => [
				...actualGuessedLetters,
				letter,
			]);
		} else {
			setWrongLetters((actualWrongLetters) => [
				...actualWrongLetters,
				normalizedLetter,
			]);
			setGuesses((actualGuesses) => actualGuesses - 1);
		}
	};

	// resetar o jogo
	const retry = () => {
		setScore(0);
		setGuesses(3);
		setGameStage(stages[0].name);
	};

	// zera o estado das letras
	const clearLettersStates = () => {
		setGuessedLetters([]);
		setWrongLetters([]);
	};

	// verifica se acabaram o número de tentativas
	useEffect(() => {
		if (guesses === 0) {
			// game over e reseta tudo
			clearLettersStates();
			setGameStage(stages[2].name);
		}
	}, [guesses]);

	// verifica se venceu o jogo
	useEffect(() => {
		const uniqueLetters = [...new Set(letters)];
	
		// console.log(uniqueLetters);
		// console.log(guessedLetters);
	
		// condição de vitoria
		if (guessedLetters.length === uniqueLetters.length && gameStage === stages[1].name) {
			// adiciona score
			setScore((actualScore) => (actualScore += 100));
		
			// reseta o jogo com nova palavra
			startGame();
		}
	}, [guessedLetters, letters, startGame, gameStage]);

	return (
		<div className="App">
			{ gameStage === "start" && <StartScreen startGame={startGame} /> }
			{ gameStage === "game" && 
				<Game 
					verifyLetter={verifyLetter}
					pickedWord={pickedWord}
					pickedCategory={pickedCategory}
					letters={letters}
					guessedLetters={guessedLetters}
					wrongLetters={wrongLetters}
					guesses={guesses}
					score={score} 
				/> 
			}
			{ gameStage === "end" && <GameOver retry={retry} score={score} /> }
		</div>
	);
}

export default App;
