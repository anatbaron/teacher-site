import React, { useState, useEffect } from 'react';
import { Button } from "./components/ui/button.tsx"
import { Input } from "./components/ui/input.tsx"
import { Card, CardHeader, CardContent } from "./components/ui/card.tsx"

const questions = [
  {
    question: "מהו החוק הראשון של ניוטון?",
    answers: ["חוק התנועה", "חוק ההתמדה", "חוק הכבידה", "חוק היחסות"],
    correctAnswer: 1
  },
  {
    question: "מי כתב את הספר '1984'?",
    answers: ["ג'ורג' אורוול", "אלדוס האקסלי", "ריי ברדבורי", "פיליפ ק' דיק"],
    correctAnswer: 0
  },
  {
    question: "מהי הנוסחה הכימית של מים?",
    answers: ["H2O", "CO2", "NaCl", "CH4"],
    correctAnswer: 0
  },
  {
    question: "מי היה הנשיא הראשון של ארצות הברית?",
    answers: ["תומאס ג'פרסון", "ג'ון אדמס", "ג'ורג' וושינגטון", "בנג'מין פרנקלין"],
    correctAnswer: 2
  },
  {
    question: "מהו המספר האטומי של פחמן?",
    answers: ["4", "6", "8", "12"],
    correctAnswer: 1
  },
  {
    question: "באיזו שנה הסתיימה מלחמת העולם השנייה?",
    answers: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2
  },
  {
    question: "מהו אורך הצלע של משולש שווה צלעות שהיקפו 18 ס\"מ?",
    answers: ["4 ס\"מ", "5 ס\"מ", "6 ס\"מ", "9 ס\"מ"],
    correctAnswer: 2
  },
  {
    question: "מי צייר את 'ליל כוכבים'?",
    answers: ["פבלו פיקאסו", "וינסנט ואן גוך", "קלוד מונה", "סלבדור דאלי"],
    correctAnswer: 1
  },
  {
    question: "מהו האיבר הגדול ביותר בגוף האדם?",
    answers: ["הכבד", "המוח", "הריאות", "העור"],
    correctAnswer: 3
  },
  {
    question: "איזה כוכב לכת הוא הקרוב ביותר לשמש?",
    answers: ["נוגה", "מאדים", "כוכב חמה", "צדק"],
    correctAnswer: 2
  },
  {
    question: "מי כתב את 'רומיאו ויוליה'?",
    answers: ["ויליאם שייקספיר", "צ'ארלס דיקנס", "ג'יין אוסטין", "מארק טוויין"],
    correctAnswer: 0
  },
  {
    question: "מהו היסוד הנפוץ ביותר ביקום?",
    answers: ["חמצן", "פחמן", "הליום", "מימן"],
    correctAnswer: 3
  },
  {
    question: "מהי בירת אוסטרליה?",
    answers: ["סידני", "מלבורן", "קנברה", "בריסביין"],
    correctAnswer: 2
  },
  {
    question: "מהו המרחק בין כדור הארץ לשמש?",
    answers: ["150 מיליון ק\"מ", "100 מיליון ק\"מ", "200 מיליון ק\"מ", "250 מיליון ק\"מ"],
    correctAnswer: 0
  },
  {
    question: "מי המציא את הטלפון?",
    answers: ["תומאס אדיסון", "אלכסנדר גרהם בל", "ניקולה טסלה", "גוליילמו מרקוני"],
    correctAnswer: 1
  },
  {
    question: "מהו החוק השני של התרמודינמיקה?",
    answers: ["חוק שימור האנרגיה", "חוק האנטרופיה", "חוק בויל", "חוק אוהם"],
    correctAnswer: 1
  },
  {
    question: "מי כתב את 'המניפסט הקומוניסטי'?",
    answers: ["קרל מרקס ופרידריך אנגלס", "ולדימיר לנין", "ליאון טרוצקי", "יוסף סטלין"],
    correctAnswer: 0
  },
  {
    question: "מהו הערך של π (פאי) עד שתי ספרות אחרי הנקודה?",
    answers: ["3.14", "3.15", "3.16", "3.17"],
    correctAnswer: 0
  },
  {
    question: "מי היה הקיסר הראשון של רומא?",
    answers: ["יוליוס קיסר", "אוגוסטוס", "נירון", "קלאודיוס"],
    correctAnswer: 1
  },
  {
    question: "מהו האיבר בגוף האדם האחראי על ייצור אינסולין?",
    answers: ["הכבד", "הלבלב", "הכליות", "הטחול"],
    correctAnswer: 1
  },
  {
    question: "מהו שמו של ההר הגבוה ביותר באפריקה?",
    answers: ["קילימנג'רו", "אלברוז", "מונט בלאן", "מקינלי"],
    correctAnswer: 0
  },
  {
    question: "מי כתב את 'מלחמה ושלום'?",
    answers: ["פיודור דוסטויבסקי", "לב טולסטוי", "אנטון צ'כוב", "איוון טורגנייב"],
    correctAnswer: 1
  },
  {
    question: "מהו החוק השלישי של קפלר?",
    answers: ["חוק המסלולים האליפטיים", "חוק השטחים השווים", "חוק התקופות", "חוק הכבידה"],
    correctAnswer: 2
  },
  {
    question: "מי היה הנשיא הראשון של מדינת ישראל?",
    answers: ["דוד בן-גוריון", "חיים ויצמן", "משה שרת", "יצחק בן-צבי"],
    correctAnswer: 1
  },
  {
    question: "מהו האלמנט הכימי בעל המספר האטומי 79?",
    answers: ["כסף", "פלטינה", "זהב", "כספית"],
    correctAnswer: 2
  },
  {
    question: "מי צייר את 'הנערה עם עגיל הפנינה'?",
    answers: ["רמברנדט", "יוהאנס ורמיר", "פיטר פאול רובנס", "יאן ואן אייק"],
    correctAnswer: 1
  },
  {
    question: "מהו אורך החיים הממוצע של כדוריות דם אדומות?",
    answers: ["60 יום", "90 יום", "120 יום", "150 יום"],
    correctAnswer: 2
  },
  {
    question: "מי היה הפילוסוף היווני שלימד את אלכסנדר הגדול?",
    answers: ["סוקרטס", "פלטון", "אריסטו", "דיוגנס"],
    correctAnswer: 2
  },
  {
    question: "מהו המרחק בין כדור הארץ לירח?",
    answers: ["284,400 ק\"מ", "384,400 ק\"מ", "484,400 ק\"מ", "584,400 ק\"מ"],
    correctAnswer: 1
  },
  {
    question: "מי כתב את 'המשפט'?",
    answers: ["פרנץ קפקא", "אלבר קאמי", "ז'אן-פול סארטר", "סמואל בקט"],
    correctAnswer: 0
  },
  {
    question: "מהו החוק הראשון של התרמודינמיקה?",
    answers: ["חוק שימור האנרגיה", "חוק האנטרופיה", "חוק בויל", "חוק אוהם"],
    correctAnswer: 0
  },
  {
    question: "מי גילה את פניצילין?",
    answers: ["לואי פסטר", "אלכסנדר פלמינג", "רוברט קוך", "ג'וזף ליסטר"],
    correctAnswer: 1
  },
  {
    question: "מהו הנהר הארוך ביותר באירופה?",
    answers: ["הדנובה", "הריין", "הוולגה", "הסיינה"],
    correctAnswer: 2
  },
  {
    question: "מי כתב את 'אנה קרנינה'?",
    answers: ["פיודור דוסטויבסקי", "לב טולסטוי", "אנטון צ'כוב", "איוון טורגנייב"],
    correctAnswer: 1
  },
  {
    question: "מהו המהירות המקסימלית התיאורטית ביקום?",
    answers: ["מהירות האור", "מהירות הקול", "מהירות האלקטרונים", "אין מגבלה"],
    correctAnswer: 0
  },
  {
    question: "מי היה מייסד האימפריה המונגולית?",
    answers: ["אטילה ההוני", "תמרלן", "ג'ינגיס חאן", "קובלאי חאן"],
    correctAnswer: 2
  },
  {
    question: "מהו שמו של הגן האחראי על ייצור המלנין בגוף האדם?",
    answers: ["גן ההמוגלובין", "גן המלנין", "גן הטירוזינאז", "גן הקולגן"],
    correctAnswer: 2
  },
  {
    question: "מי כתב את 'הדון הרגוע'?",
    answers: ["לב טולסטוי", "פיודור דוסטויבסקי", "מיכאיל שולוחוב", "בוריס פסטרנק"],
    correctAnswer: 2
  },
  {
    question: "מהו החוק השני של ניוטון?",
    answers: ["F = ma", "E = mc²", "PV = nRT", "F = kx"],
    correctAnswer: 0
  }
];


const TriviaGame = () => {
  const [players, setPlayers] = useState([
    { name: '', score: 0, newPoints: 0 },
    { name: '', score: 0, newPoints: 0 },
    { name: '', score: 0, newPoints: 0 },
    { name: '', score: 0, newPoints: 0 }
  ]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [gamePhase, setGamePhase] = useState('setup');

  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayers(players.map(player => ({ ...player, newPoints: 0 })));
    }, 2000);
    return () => clearTimeout(timer);
  }, [players]);

  const handleAnswer = (answerIndex) => {
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setPlayers(prevPlayers => {
        const newPlayers = [...prevPlayers];
        const updatedScore = newPlayers[currentPlayer].score + 1;
        newPlayers[currentPlayer] = {
          ...newPlayers[currentPlayer],
          score: updatedScore,
          newPoints: updatedScore - prevPlayers[currentPlayer].score // This will always be 1 for a correct answer
        };
        return newPlayers;
      });
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setCurrentPlayer((currentPlayer + 1) % 4);
    } else {
      setGamePhase('finished');
    }
  };

  const startGame = () => {
    if (players.every(player => player.name)) {
      setGamePhase('playing');
    } else {
      alert('נא להזין שמות לכל השחקנים');
    }
  };

  const resetGame = () => {
    setPlayers(players.map(player => ({ ...player, score: 0, newPoints: 0 })));
    setCurrentPlayer(0);
    setCurrentQuestion(0);
    setGamePhase('setup');
  };

  const ScoreBoard = () => (
    <div className="flex-grow flex justify-center items-center">
      <Card className="w-96 bg-gray-800">
        <CardHeader className="text-xl font-bold">לוח ניקוד</CardHeader>
        <CardContent>
          {players.map((player, index) => (
            <div key={index} className="mb-4">
              <div className="text-lg">שחקן: {player.name}</div>
              <div className="text-3xl font-bold flex items-center justify-center">
                {player.score}
                {player.newPoints > 0 && (
                  <span className="relative" style={{direction:"ltr"}}>
                    <span className="absolute bottom-1 right-2  ml-2 text-sm bg-green-500 text-black px-2 py-1 rounded-full animate-pulse text-left scorePulse">
                    +{player.newPoints}
                    </span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  if (gamePhase === 'setup') {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        <Card className="w-96 bg-gray-800">
          <CardHeader className="text-2xl font-bold">ברוכים הבאים למשחק הטריוויה!</CardHeader>
          <CardContent>
            {players.map((player, index) => (
              <Input
                key={index}
                placeholder={`שם שחקן ${index + 1}`}
                value={player.name}
                onChange={(e) => {
                  const newPlayers = [...players];
                  newPlayers[index].name = e.target.value;
                  setPlayers(newPlayers);
                }}
                className="mb-4 bg-gray-700 text-white"
              />
            ))}
            <Button onClick={startGame} className="w-full bg-blue-600 hover:bg-blue-700">התחל משחק</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gamePhase === 'playing') {
    const currentQ = questions[currentQuestion];
    return (
      <div className="flex flex-row-reverse text-white min-h-screen gap-4">
        <ScoreBoard />
        <div className="flex-grow flex justify-center items-center">
          <Card className="w-[32rem] bg-gray-800">
            <CardHeader>
              <div className="text-2xl font-bold mb-2">שאלה {currentQuestion + 1} / {questions.length}</div>
              <div className="text-xl">תור: {players[currentPlayer].name}</div>
            </CardHeader>
            <CardContent>
              <div className="text-lg mb-6">{currentQ.question}</div>
              {currentQ.answers.map((answer, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className="block w-full mb-4 bg-gray-700 hover:bg-gray-600 text-center px-4 py-1 text-lg"
                >
                  {answer}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gamePhase === 'finished') {
    const maxScore = Math.max(...players.map(p => p.score));
    const winners = players.filter(p => p.score === maxScore);
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        <Card className="w-96 bg-gray-800">
          <CardHeader className="text-2xl font-bold">המשחק הסתיים!</CardHeader>
          <CardContent>
            {winners.length === 1 ? (
              <div className="text-xl mb-4">המנצח: שחקן {winners[0].name}</div>
            ) : (
              <div className="text-xl mb-4">
                תיקו בין: {winners.map(w => w.name).join(', ')}
              </div>
            )}
            <div className="text-lg mb-4">ניקוד סופי:</div>
            {players.map((player, index) => (
              <div key={index} className="text-lg mb-2">השחקן {player.name}: <span className='font-bold pr-2'>{player.score} נקודות.</span></div>
            ))}
            <Button onClick={resetGame} className="w-full mt-6 bg-blue-600 hover:bg-blue-700">משחק חדש</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
};

export default TriviaGame;