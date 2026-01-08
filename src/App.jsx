import React, { useState, useEffect } from 'react';
import { Trophy, Share2, Zap, TrendingUp, Calendar, Award } from 'lucide-react';

export default function TriviaChallenge() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState({
    totalPlayed: 0,
    highScore: 0,
    streak: 0,
    lastPlayed: null
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showInterstitial, setShowInterstitial] = useState(false);

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('triviaStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
    
    const savedLeaderboard = localStorage.getItem('triviaLeaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }

    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // Fetch questions from Open Trivia Database
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=10&type=multiple');
      const data = await response.json();
      
      // Shuffle answers
      const processedQuestions = data.results.map(q => {
        const answers = [...q.incorrect_answers, q.correct_answer]
          .sort(() => Math.random() - 0.5)
          .map(a => decodeHTML(a));
        
        return {
          question: decodeHTML(q.question),
          answers,
          correctAnswer: decodeHTML(q.correct_answer),
          category: q.category
        };
      });
      
      setQuestions(processedQuestions);
      setGameState('playing');
      setCurrentQuestion(0);
      setScore(0);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } catch (error) {
      alert('Failed to load questions. Please try again!');
    }
    setLoading(false);
  };

  const decodeHTML = (html) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  const handleAnswer = (answer) => {
    if (showAnswer) return;
    
    setSelectedAnswer(answer);
    setShowAnswer(true);
    
    if (answer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question after delay
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        // Show interstitial ad every 3 questions
        if ((currentQuestion + 1) % 3 === 0) {
          setShowInterstitial(true);
          setTimeout(() => {
            setShowInterstitial(false);
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setShowAnswer(false);
          }, 2000);
        } else {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setShowAnswer(false);
        }
      } else {
        // Game over - show final interstitial
        setShowInterstitial(true);
        setTimeout(() => {
          setShowInterstitial(false);
          finishGame();
        }, 2000);
      }
    }, 1500);
  };

  const finishGame = () => {
    const newStats = { ...stats };
    newStats.totalPlayed += 1;
    
    if (score > newStats.highScore) {
      newStats.highScore = score;
    }

    // Calculate streak
    const today = new Date().toDateString();
    if (newStats.lastPlayed === today) {
      // Already played today
    } else {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (newStats.lastPlayed === yesterday) {
        newStats.streak += 1;
      } else {
        newStats.streak = 1;
      }
    }
    newStats.lastPlayed = today;

    setStats(newStats);
    localStorage.setItem('triviaStats', JSON.stringify(newStats));

    // Update leaderboard
    if (playerName) {
      const newLeaderboard = [...leaderboard];
      const existingIndex = newLeaderboard.findIndex(entry => entry.name === playerName);
      
      if (existingIndex >= 0) {
        if (score > newLeaderboard[existingIndex].score) {
          newLeaderboard[existingIndex].score = score;
        }
      } else {
        newLeaderboard.push({ name: playerName, score });
      }
      
      newLeaderboard.sort((a, b) => b.score - a.score);
      const topTen = newLeaderboard.slice(0, 10);
      
      setLeaderboard(topTen);
      localStorage.setItem('triviaLeaderboard', JSON.stringify(topTen));
    }

    setGameState('results');
  };

  const shareResults = () => {
    const text = `🎯 I scored ${score}/10 on Daily Trivia Challenge!\n🔥 Current streak: ${stats.streak} days\n\nCan you beat my score?`;
    
    if (navigator.share) {
      navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  const savePlayerName = () => {
    if (playerName.trim()) {
      localStorage.setItem('playerName', playerName.trim());
    }
  };

  // Interstitial Ad Component
  const InterstitialAd = () => (
    <div className="interstitial-ad">
      <div className="ad-content">
        <div className="ad-label">ADVERTISEMENT</div>
        <div className="ad-placeholder">
          {/* Replace this div with your actual ad code */}
          <div className="ad-demo">
            <p>🎯 AD SPACE</p>
            <p style={{ fontSize: '14px', opacity: 0.7 }}>Insert your Google AdSense code here</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="trivia-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Space+Mono:wght@700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Outfit', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .trivia-app {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        /* Animated background particles */
        .trivia-app::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255,255,255,0.05) 0%, transparent 50%);
          animation: floatParticles 20s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes floatParticles {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }

        /* Banner Ad Slot */
        .banner-ad {
          width: 100%;
          background: rgba(0,0,0,0.3);
          padding: 8px;
          text-align: center;
          backdrop-filter: blur(10px);
          border-bottom: 2px solid rgba(255,255,255,0.1);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .ad-label {
          font-size: 10px;
          color: rgba(255,255,255,0.5);
          margin-bottom: 4px;
          font-weight: 600;
          letter-spacing: 1px;
        }

        .ad-placeholder {
          background: rgba(255,255,255,0.1);
          border-radius: 8px;
          padding: 12px;
          min-height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px dashed rgba(255,255,255,0.3);
        }

        .ad-demo {
          text-align: center;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
        }

        /* Interstitial Ad */
        .interstitial-ad {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .interstitial-ad .ad-content {
          background: rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 32px;
          max-width: 90%;
          width: 400px;
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255,255,255,0.2);
        }

        .interstitial-ad .ad-placeholder {
          min-height: 300px;
          background: rgba(255,255,255,0.05);
          font-size: 18px;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Main Container */
        .container {
          flex: 1;
          max-width: 800px;
          margin: 0 auto;
          padding: 32px 20px;
          width: 100%;
          position: relative;
          z-index: 1;
        }

        /* Header */
        .header {
          text-align: center;
          margin-bottom: 48px;
          animation: slideDown 0.6s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo {
          font-family: 'Space Mono', monospace;
          font-size: 48px;
          font-weight: 700;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 4px 20px rgba(255,215,0,0.3);
          margin-bottom: 8px;
          letter-spacing: -1px;
        }

        .tagline {
          color: rgba(255,255,255,0.8);
          font-size: 16px;
          font-weight: 400;
        }

        /* Stats Bar */
        .stats-bar {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
          animation: fadeIn 0.8s ease 0.2s both;
        }

        .stat-card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.2);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.2);
          box-shadow: 0 8px 30px rgba(0,0,0,0.3);
        }

        .stat-icon {
          color: #FFD700;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 800;
          color: white;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
        }

        /* Menu Screen */
        .menu-screen {
          animation: fadeIn 0.6s ease;
        }

        .name-input-section {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .name-input-section h3 {
          color: white;
          margin-bottom: 12px;
          font-size: 18px;
        }

        .name-input-section input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 16px;
          font-family: 'Outfit', sans-serif;
          transition: all 0.3s ease;
        }

        .name-input-section input::placeholder {
          color: rgba(255,255,255,0.5);
        }

        .name-input-section input:focus {
          outline: none;
          border-color: #FFD700;
          background: rgba(255,255,255,0.15);
        }

        .play-button {
          width: 100%;
          padding: 20px;
          background: linear-gradient(135deg, #FFD700, #FFA500);
          border: none;
          border-radius: 16px;
          font-size: 24px;
          font-weight: 800;
          color: #1a1a2e;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Space Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
          box-shadow: 0 8px 30px rgba(255,215,0,0.4);
          position: relative;
          overflow: hidden;
        }

        .play-button::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .play-button:hover::before {
          width: 300px;
          height: 300px;
        }

        .play-button:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 40px rgba(255,215,0,0.6);
        }

        .play-button:active {
          transform: scale(0.98);
        }

        .button-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }

        /* Leaderboard */
        .leaderboard {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 24px;
          margin-top: 24px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .leaderboard h3 {
          color: white;
          margin-bottom: 16px;
          font-size: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .leaderboard-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .leaderboard-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .leaderboard-item:hover {
          background: rgba(255,255,255,0.15);
        }

        .leaderboard-rank {
          font-weight: 800;
          font-size: 20px;
          color: #FFD700;
          min-width: 30px;
          font-family: 'Space Mono', monospace;
        }

        .leaderboard-name {
          flex: 1;
          color: white;
          font-weight: 600;
        }

        .leaderboard-score {
          font-weight: 800;
          color: #FFD700;
          font-size: 18px;
          font-family: 'Space Mono', monospace;
        }

        /* Question Screen */
        .question-screen {
          animation: fadeIn 0.4s ease;
        }

        .progress-bar {
          background: rgba(255,255,255,0.2);
          border-radius: 12px;
          height: 8px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #FFD700, #FFA500);
          transition: width 0.5s ease;
          box-shadow: 0 0 20px rgba(255,215,0,0.6);
        }

        .question-card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 32px;
          margin-bottom: 24px;
          border: 2px solid rgba(255,255,255,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }

        .question-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .question-number {
          font-size: 14px;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
        }

        .category-tag {
          background: rgba(255,215,0,0.3);
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 12px;
          color: #FFD700;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .question-text {
          font-size: 24px;
          font-weight: 700;
          color: white;
          line-height: 1.4;
          margin-bottom: 8px;
        }

        .score-display {
          text-align: right;
          color: #FFD700;
          font-weight: 800;
          font-size: 18px;
          font-family: 'Space Mono', monospace;
        }

        .answers-grid {
          display: grid;
          gap: 16px;
        }

        .answer-button {
          padding: 20px;
          background: rgba(255,255,255,0.1);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 16px;
          color: white;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          position: relative;
          overflow: hidden;
        }

        .answer-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }

        .answer-button:hover::before {
          left: 100%;
        }

        .answer-button:hover {
          background: rgba(255,255,255,0.2);
          border-color: #FFD700;
          transform: translateX(8px);
        }

        .answer-button.selected {
          border-color: #FFD700;
          background: rgba(255,215,0,0.2);
        }

        .answer-button.correct {
          border-color: #4CAF50;
          background: rgba(76,175,80,0.3);
          animation: correctPulse 0.6s ease;
        }

        .answer-button.incorrect {
          border-color: #f44336;
          background: rgba(244,67,54,0.3);
          animation: shake 0.5s ease;
        }

        @keyframes correctPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        .answer-button:disabled {
          cursor: not-allowed;
        }

        /* Results Screen */
        .results-screen {
          text-align: center;
          animation: fadeIn 0.6s ease;
        }

        .results-card {
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 48px 32px;
          border: 2px solid rgba(255,255,255,0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          margin-bottom: 24px;
        }

        .trophy-icon {
          color: #FFD700;
          margin-bottom: 24px;
          animation: bounce 1s ease infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        .final-score {
          font-size: 72px;
          font-weight: 800;
          color: white;
          margin-bottom: 8px;
          font-family: 'Space Mono', monospace;
          text-shadow: 0 4px 20px rgba(255,215,0,0.4);
        }

        .results-message {
          font-size: 24px;
          color: rgba(255,255,255,0.9);
          font-weight: 600;
          margin-bottom: 32px;
        }

        .action-buttons {
          display: grid;
          gap: 12px;
        }

        .secondary-button {
          padding: 16px;
          background: rgba(255,255,255,0.2);
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 12px;
          color: white;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .secondary-button:hover {
          background: rgba(255,255,255,0.3);
          border-color: #FFD700;
          transform: translateY(-2px);
        }

        /* Loading State */
        .loading {
          text-align: center;
          color: white;
          font-size: 20px;
          font-weight: 600;
          padding: 60px 20px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top-color: #FFD700;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 600px) {
          .logo {
            font-size: 36px;
          }

          .question-text {
            font-size: 20px;
          }

          .final-score {
            font-size: 56px;
          }

          .stats-bar {
            grid-template-columns: 1fr 1fr;
          }

          .container {
            padding: 20px 16px;
          }
        }
      `}</style>

      {/* Banner Ad */}
      <div className="banner-ad">
        <div className="ad-label">ADVERTISEMENT</div>
        <div className="ad-placeholder">
          {/* Replace this div with your Google AdSense code */}
          <div className="ad-demo">
            <p>728x90 Banner Ad Space</p>
          </div>
        </div>
      </div>

      {/* Interstitial Ad */}
      {showInterstitial && <InterstitialAd />}

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="logo">TRIVIA</div>
          <div className="tagline">Test Your Knowledge Daily</div>
        </div>

        {/* Stats Bar */}
        {gameState !== 'playing' && (
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-icon"><Trophy size={24} /></div>
              <div className="stat-value">{stats.highScore}</div>
              <div className="stat-label">High Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><Zap size={24} /></div>
              <div className="stat-value">{stats.streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon"><TrendingUp size={24} /></div>
              <div className="stat-value">{stats.totalPlayed}</div>
              <div className="stat-label">Games Played</div>
            </div>
          </div>
        )}

        {/* Menu Screen */}
        {gameState === 'menu' && (
          <div className="menu-screen">
            <div className="name-input-section">
              <h3>Enter Your Name</h3>
              <input
                type="text"
                placeholder="Your name for leaderboard..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                onBlur={savePlayerName}
                maxLength={20}
              />
            </div>

            <button className="play-button" onClick={fetchQuestions} disabled={loading}>
              <div className="button-content">
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: 24, height: 24, border: '3px solid rgba(0,0,0,0.3)', borderTopColor: '#1a1a2e' }} />
                    Loading...
                  </>
                ) : (
                  <>
                    <Zap size={28} />
                    Start Challenge
                  </>
                )}
              </div>
            </button>

            {/* Leaderboard */}
            {leaderboard.length > 0 && (
              <div className="leaderboard">
                <h3><Award size={24} /> Top Players</h3>
                <div className="leaderboard-list">
                  {leaderboard.map((entry, index) => (
                    <div key={index} className="leaderboard-item">
                      <div className="leaderboard-rank">#{index + 1}</div>
                      <div className="leaderboard-name">{entry.name}</div>
                      <div className="leaderboard-score">{entry.score}/10</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Question Screen */}
        {gameState === 'playing' && questions.length > 0 && (
          <div className="question-screen">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>

            <div className="question-card">
              <div className="question-meta">
                <span className="question-number">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="category-tag">
                  {questions[currentQuestion].category}
                </span>
              </div>
              
              <div className="question-text">
                {questions[currentQuestion].question}
              </div>
              
              <div className="score-display">
                Score: {score}/{questions.length}
              </div>
            </div>

            <div className="answers-grid">
              {questions[currentQuestion].answers.map((answer, index) => {
                const isSelected = selectedAnswer === answer;
                const isCorrect = answer === questions[currentQuestion].correctAnswer;
                const showCorrect = showAnswer && isCorrect;
                const showIncorrect = showAnswer && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    className={`answer-button ${isSelected ? 'selected' : ''} ${showCorrect ? 'correct' : ''} ${showIncorrect ? 'incorrect' : ''}`}
                    onClick={() => handleAnswer(answer)}
                    disabled={showAnswer}
                  >
                    {answer}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Results Screen */}
        {gameState === 'results' && (
          <div className="results-screen">
            <div className="results-card">
              <div className="trophy-icon">
                <Trophy size={80} />
              </div>
              
              <div className="final-score">{score}/10</div>
              
              <div className="results-message">
                {score >= 9 ? '🎉 Incredible!' : 
                 score >= 7 ? '🔥 Well Done!' : 
                 score >= 5 ? '👍 Good Job!' : 
                 '💪 Keep Practicing!'}
              </div>

              <div className="action-buttons">
                <button className="play-button" onClick={fetchQuestions}>
                  <div className="button-content">
                    <Zap size={24} />
                    Play Again
                  </div>
                </button>
                
                <button className="secondary-button" onClick={shareResults}>
                  <Share2 size={20} />
                  Share Results
                </button>
                
                <button className="secondary-button" onClick={() => setGameState('menu')}>
                  <Calendar size={20} />
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
