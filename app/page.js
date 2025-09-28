"use client";

import { useEffect, useState } from "react";

const WORDS = [
  "REACT","JAVASCRIPT","NEXT","TYPESCRIPT","HTML","CSS","NODE","API",
  "COMPONENTE","ESTADO","PROPS","FUNCAO","OBJETO","ARRAY","STRING",
  "BOOLEAN","VARIAVEL","CONSTANTE","IMPORT","EXPORT","DEBUG","GITHUB",
  "FRONTEND","BACKEND","SERVIDOR","BANCO","DADOS","TECNOLOGIA",
  "INOVACAO","DEPLOY","ROTINA","ROTEADOR"
];

const MAX_ERRORS = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Home() {
  const [word, setWord] = useState("");
  const [guessed, setGuessed] = useState([]);
  const [errors, setErrors] = useState(0);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("playing");

  function newGame() {
    const w = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(w);
    setGuessed([]);
    setErrors(0);
    setInput("");
    setStatus("playing");
  }

  useEffect(() => {
    newGame();
  }, []);

  function handleGuess(letter) {
    if (status !== "playing" || guessed.includes(letter)) return;
    
    letter = letter.toUpperCase();

    if (!/^[A-Z]$/.test(letter)) return;

    const newGuessed = [...guessed, letter];
    setGuessed(newGuessed);

    if (!word.includes(letter)) {
      const newErrors = errors + 1;
      setErrors(newErrors);
      if (newErrors >= MAX_ERRORS) {
        setStatus("lost");
      }
    } else {
      const uniqueWordLetters = [...new Set(word.split(""))];
      const allFound = uniqueWordLetters.every((l) => newGuessed.includes(l));
      if (allFound) setStatus("won");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!input) return;
    handleGuess(input[0]);
    setInput("");
  }

  const display = word
    .split("")
    .map((l) => (guessed.includes(l) ? l : "_"))
    .join(" ");

  const correct = guessed.filter((l) => word.includes(l));
  const wrong = guessed.filter((l) => !word.includes(l));
  const remaining = MAX_ERRORS - errors;

  return (
    <main className="container">
      <h1>Jogo da Forca</h1>

      <section className="top">
        <div className="hangman" aria-hidden>
          <svg viewBox="0 0 150 200" width="150" height="200" role="img" aria-label="Forca">
            <line x1="10" y1="190" x2="130" y2="190" stroke="#333" strokeWidth="4" />
            <line x1="30" y1="190" x2="30" y2="10" stroke="#333" strokeWidth="4" />
            <line x1="30" y1="10" x2="100" y2="10" stroke="#333" strokeWidth="4" />
            <line x1="100" y1="10" x2="100" y2="30" stroke="#333" strokeWidth="4" />
            
            {errors >= 1 && <circle cx="100" cy="45" r="12" stroke="#222" strokeWidth="3" fill="none" />}
            {errors >= 2 && <line x1="100" y1="57" x2="100" y2="100" stroke="#222" strokeWidth="3" />}
            {errors >= 3 && <line x1="100" y1="65" x2="80" y2="85" stroke="#222" strokeWidth="3" />}
            {errors >= 4 && <line x1="100" y1="65" x2="120" y2="85" stroke="#222" strokeWidth="3" />}
            {errors >= 5 && <line x1="100" y1="100" x2="80" y2="130" stroke="#222" strokeWidth="3" />}
            {errors >= 6 && <line x1="100" y1="100" x2="120" y2="130" stroke="#222" strokeWidth="3" />}
          </svg>
        </div>

        <div className="gameInfo">
          <div className="word" aria-live="polite">{display}</div>
          <p>Tentativas restantes: <strong>{remaining}</strong></p>

          <div className="attempts">
            <div>Letras corretas: <span className="correct">{correct.join(", ") || "-"}</span></div>
            <div>Letras erradas: <span className="wrong">{wrong.join(", ") || "-"}</span></div>
          </div>
        </div>
      </section>

      <section className="keyboard">
        {ALPHABET.map((l) => {
          const used = guessed.includes(l);
          const isCorrect = word.includes(l);
          return (
            <button
              key={l}
              onClick={() => handleGuess(l)}
              disabled={used || status !== "playing"}
              className={`key ${used ? (isCorrect ? "keyCorrect" : "keyWrong") : ""}`}
              aria-pressed={used}
              aria-label={`Letra ${l}${used ? " usada" : ""}`}
            >
              {l}
            </button>
          );
        })}
      </section>

      <form className="form" onSubmit={handleSubmit} aria-label="Enviar letra">
        <label>
          Digite uma letra:
          <input
            type="text"
            maxLength={1}
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            pattern="[A-Za-z]"
            disabled={status !== "playing"}
            className="textInput"
          />
        </label>
        <button type="submit" disabled={status !== "playing"}>Enviar</button>
      </form>

      <div className="result" aria-live="polite">
        {status === "won" && (
          <div className="bannerWin">
            <h2>Parabéns — você venceu! 🎉</h2>
            <p>A palavra era: <strong>{word}</strong></p>
            <button onClick={newGame}>Reiniciar</button>
          </div>
        )}
        {status === "lost" && (
          <div className="bannerLose">
            <h2>Você perdeu 😢</h2>
            <p>A palavra era: <strong>{word}</strong></p>
            <button onClick={newGame}>Reiniciar</button>
          </div>
        )}
      </div>
    </main>
  );
}
