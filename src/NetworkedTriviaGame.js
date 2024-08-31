import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "./components/ui/button.tsx";
import { Input } from "./components/ui/input.tsx";
import { Card, CardHeader, CardContent } from "./components/ui/card.tsx";
import { io } from 'socket.io-client';
import confetti from 'canvas-confetti';  // Import the default export
import { BsFillPlayFill, BsPersonPlus, BsPlusCircle, BsXCircle } from "react-icons/bs";

// Memoized Timer Component
const Timer = React.memo(({ timeLeft }) => {
  return <div className="text-2xl font-bold mb-2">זמן נותר: {timeLeft} שניות</div>;
});

// Memoized Question Component
const Question = React.memo(({ question, onAnswer, isCurrentPlayer, timeLeft }) => {
  return (
    <>
      <div className="text-lg mb-6">{question?.text}</div>
      {question?.answers.map((answer, index) => (
        <Button
          key={index}
          onClick={() => onAnswer(index)}
          disabled={!isCurrentPlayer || timeLeft === 0}
          className="block w-full mb-4 bg-gray-700 hover:bg-gray-600 text-center px-4 py-1 text-lg"
        >
          {answer}
        </Button>
      ))}
    </>
  );
});

// Memoized ScoreBoard Component
const ScoreBoard = React.memo(({ players }) => (
  <div className="flex-grow flex justify-center items-center">
    <Card className="w-96 bg-gray-800">
      <CardHeader className="text-xl font-bold">לוח ניקוד</CardHeader>
      <CardContent>
        {players.map((player, index) => (
          <div key={index} className="mb-4">
            <div className="text-lg">שחקן: {player.name}</div>
            <div className="text-3xl font-bold">{player.score}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
));

// Memoized GamePlay Component
const GamePlay = React.memo(({ 
  players, 
  question, 
  currentPlayer, 
  timeLeft, 
  answerQuestion, 
  socket 
}) => {
  const isCurrentPlayer = currentPlayer?.id === socket?.id;

  return (
    <div className="flex flex-row-reverse text-white min-h-screen gap-4">
      <ScoreBoard players={players} />
      <div className="flex-grow flex justify-center items-center">
        <Card className="w-[32rem] bg-gray-800">
          <CardHeader>
            <Timer timeLeft={timeLeft} />
            <div className="text-xl">תור: {currentPlayer?.name}</div>
          </CardHeader>
          <CardContent>
            <Question 
              question={question} 
              onAnswer={answerQuestion} 
              isCurrentPlayer={isCurrentPlayer}
              timeLeft={timeLeft} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

// Memoized Lobby Component
const Lobby = React.memo(({ 
  playerName, 
  setPlayerName, 
  createGame, 
  gameCode, 
  setGameCode, 
  joinGame 
}) => (
  <Card className="w-96 bg-gray-800">
    <CardHeader className="text-2xl font-bold">לובי משחק רשת טריוויה</CardHeader>
    <CardContent>
      <Input
        placeholder="שם שחקן"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="mb-4 bg-gray-700 text-white"
      />
      <Button onClick={createGame} className="w-full mb-4 bg-blue-600 hover:bg-blue-700"><BsPlusCircle className='ml-2'/> צור משחק חדש </Button>
      <Input
        placeholder="קוד משחק"
        value={gameCode}
        onChange={(e) => setGameCode(e.target.value)}
        className="mb-4 bg-gray-700 text-white"
      />
      <Button onClick={joinGame} className="w-full bg-green-600 hover:bg-green-700"><BsPersonPlus className='ml-2'/> הצטרף למשחק קיים</Button>
    </CardContent>
  </Card>
));

// Memoized WaitingRoom Component
const WaitingRoom = React.memo(({ 
  gameCode, 
  players, 
  startGame, 
  leaveGame, 
  socket 
}) => (
  <Card className="w-96 bg-gray-800">
    <CardHeader className="text-2xl font-bold">חדר המתנה</CardHeader>
    <CardContent>
      <div className="mb-4">קוד המשחק: {gameCode}</div>
      <div className="mb-4">שחקנים:</div>
      {players.map((player, index) => (
        <div key={index}>{player.name}</div>
      ))}
      {players[0]?.id === socket?.id && (
        <Button onClick={startGame} className="w-full mt-4 bg-blue-600 hover:bg-blue-700"><BsFillPlayFill className='ml-2 rotate-180'/> התחל משחק</Button>
      )}
      <Button onClick={leaveGame} className="w-full mt-4 bg-red-600 hover:bg-red-700"><BsXCircle className='ml-2'/>עזוב משחק</Button>
    </CardContent>
  </Card>
));

const NetworkedTriviaGame = () => {
    const [socket, setSocket] = useState(null);
    const [gameState, setGameState] = useState('setup'); // 'setup', 'waiting', 'playing', 'finished'
    const [players, setPlayers] = useState([]);
    const [currentPlayer, setCurrentPlayer] = useState(null);
    const [question, setQuestion] = useState(null);
    const [timeLeft, setTimeLeft] = useState(10);
    const [gameCode, setGameCode] = useState('');
    const [playerName, setPlayerName] = useState('');
  
    const timerRef = useRef(null);
  
    // Initialize Socket Connection
    useEffect(() => {
      const newSocket = io('https://trivia-reactjs-server.vercel.app', {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5, // Adjust as needed
        debug: true // Enable for debugging
      });
      setSocket(newSocket);
  
      // Socket Event Listeners
      newSocket.on('gameCode', (code) => {
        setGameCode(code);
        setGameState('waiting');
      });
  
      newSocket.on('gameState', setGameState);
  
      newSocket.on('playerList', setPlayers);
  
      newSocket.on('questionUpdate', ({ question: newQuestion, currentPlayer: newCurrentPlayer, timeLeft: newTimeLeft }) => {
        setQuestion(newQuestion);
        setCurrentPlayer(newCurrentPlayer);
        setTimeLeft(newTimeLeft);
      });
  
      newSocket.on('error', (error) => alert(error));
  
      return () => {
        newSocket.close();
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, []);
  
    // Timer Effect
    useEffect(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (gameState === 'playing' && timeLeft > 0) {
        timerRef.current = setInterval(() => {
          setTimeLeft((prevTime) => {
            if (prevTime > 0) {
              return prevTime - 1;
            } else {
              clearInterval(timerRef.current);
              return 0;
            }
          });
        }, 1000);
      }
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }, [gameState, question, timeLeft]);  // Include timeLeft in the dependency array
  
    // Memoized Callbacks to ensure stable references
    const createGame = useCallback(() => {
      if (socket && playerName.trim()) {
        socket.emit('createGame', playerName.trim());
      }
    }, [socket, playerName]);
  
    const joinGame = useCallback(() => {
      if (socket && playerName.trim() && gameCode.trim()) {
        socket.emit('joinGame', { gameCode: gameCode.trim(), playerName: playerName.trim() });
      }
    }, [socket, playerName, gameCode]);
  
    const startGame = useCallback(() => {
      if (socket) {
        socket.emit('startGame');
      }
    }, [socket]);
  
    const leaveGame = useCallback(() => {
      if (socket) {
        socket.emit('leaveGame');
        setGameState('setup');
        setGameCode('');
        setPlayers([]);
        setQuestion(null);
        setTimeLeft(10);
        setCurrentPlayer(null);
      }
    }, [socket]);
  
    const answerQuestion = useCallback((answerIndex) => {
      if (socket && timeLeft > 0 && currentPlayer?.id === socket?.id) {
        socket.emit('answer', answerIndex);
      }
    }, [socket, timeLeft, currentPlayer]);
  
    // Confetti function
    const shootConfetti = () => {
      const defaults = {
        spread: 360,
        ticks: 50,
        gravity: 0,
        decay: 0.94,
        startVelocity: 30,
        colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
      };
  
      const shoot = () => {
        confetti({
          ...defaults,
          particleCount: 40,
          scalar: 1.2,
          shapes: ['star']
        });
  
        confetti({
          ...defaults,
          particleCount: 10,
          scalar: 0.75,
          shapes: ['circle']
        });
      };
  
      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
    };
  
    // Determine which component to render based on gameState
    const renderContent = () => {
      switch (gameState) {
        case 'setup':
          return (
            <Lobby 
              playerName={playerName}
              setPlayerName={setPlayerName}
              createGame={createGame}
              gameCode={gameCode}
              setGameCode={setGameCode}
              joinGame={joinGame}
            />
          );
        case 'waiting':
          return (
            <WaitingRoom 
              gameCode={gameCode}
              players={players}
              startGame={startGame}
              leaveGame={leaveGame}
              socket={socket}
            />
          );
        case 'playing':
          return (
            <GamePlay 
              players={players}
              question={question}
              currentPlayer={currentPlayer}
              timeLeft={timeLeft}
              answerQuestion={answerQuestion}
              socket={socket}
            />
          );
        case 'finished':
          return (
            <Card className="w-96 bg-gray-800">
              <CardHeader className="text-2xl font-bold">המשחק הסתיים!</CardHeader>
              <CardContent>
                {(() => {
                  const maxScore = Math.max(...players.map(p => p.score));
                  const winners = players.filter(p => p.score === maxScore);
                  if (winners.length === 1) {
                    shootConfetti();  // Trigger confetti for the winner
                    return <div className="text-xl mb-4">המנצח: {winners[0].name}</div>;
                  } else {
                    return <div className="text-xl mb-4">תיקו בין: {winners.map(w => w.name).join(', ')}</div>;
                  }
                })()}
                <div className="text-lg mb-4">ניקוד סופי:</div>
                {players.map((player, index) => (
                  <div key={index} className="text-lg mb-2">
                    השחקן {player.name}: <span className='font-bold pr-2'>{player.score} נקודות.</span>
                  </div>
                ))}
                <Button onClick={leaveGame} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">משחק חדש</Button>
              </CardContent>
            </Card>
          );
        default:
          return null;
      }
    };
  
    return (
      <div className="flex justify-center items-center h-screen">
        {renderContent()}
      </div>
    );
  };
  
  export default NetworkedTriviaGame;