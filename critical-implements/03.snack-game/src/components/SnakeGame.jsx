import { useEffect, useRef, useState } from 'react';
import { drawAnimeBackground, drawAnimeSnake, drawAnimeFood, drawParticles } from '../utils/animeRenderer';
import './SnakeGame.css';

const GRID_SIZE = 20;
const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 600;
const CELL_SIZE = CANVAS_WIDTH / GRID_SIZE;

const DIFFICULTY_LEVELS = {
  easy: { speed: 150, label: '简单' },
  normal: { speed: 100, label: '普通' },
  hard: { speed: 70, label: '困难' },
  expert: { speed: 40, label: '专家' }
};

const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};

function SnakeGame() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState('normal');
  const [isPlaying, setIsPlaying] = useState(false);
  const [particles, setParticles] = useState([]);
  const directionRef = useRef(direction);
  const gameLoopRef = useRef(null);

  // 生成随机食物位置
  const generateFood = (currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  // 创建吃豆粒子效果
  const createEatParticles = (x, y) => {
    const newParticles = [];
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const speed = 2 + Math.random() * 3;
      newParticles.push({
        x: (x + 0.5) * CELL_SIZE,
        y: (y + 0.5) * CELL_SIZE,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 3 + Math.random() * 3,
        color: `hsl(${Math.random() * 60 + 300}, 100%, 70%)`
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  };

  // 更新粒子
  useEffect(() => {
    if (particles.length === 0) return;

    const particleInterval = setInterval(() => {
      setParticles(prev => {
        return prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2, // 重力效果
            life: p.life - 0.02
          }))
          .filter(p => p.life > 0);
      });
    }, 16);

    return () => clearInterval(particleInterval);
  }, [particles.length]);

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isPlaying) {
        if (e.code === 'Space') {
          startGame();
        }
        return;
      }

      if (DIRECTIONS[e.key]) {
        e.preventDefault();
        const newDir = DIRECTIONS[e.key];
        // 防止反向移动
        if (directionRef.current.x + newDir.x !== 0 ||
            directionRef.current.y + newDir.y !== 0) {
          directionRef.current = newDir;
          setDirection(newDir);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  // 游戏循环
  useEffect(() => {
    if (!isPlaying || gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };

        // 检查碰撞
        if (
          newHead.x < 0 || newHead.x >= GRID_SIZE ||
          newHead.y < 0 || newHead.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
        ) {
          setGameOver(true);
          setIsPlaying(false);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // 检查是否吃到食物
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(prev => prev + 10);
          setFood(generateFood(newSnake));
          createEatParticles(food.x, food.y);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, DIFFICULTY_LEVELS[difficulty].speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameOver, difficulty, food]);

  // 渲染游戏画面
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // 清空画布
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绘制背景
    drawAnimeBackground(ctx, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 绘制蛇
    drawAnimeSnake(ctx, snake, CELL_SIZE);

    // 绘制食物
    drawAnimeFood(ctx, food, CELL_SIZE);

    // 绘制粒子效果
    drawParticles(ctx, particles);

  }, [snake, food, particles]);

  const startGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection({ x: 1, y: 0 });
    directionRef.current = { x: 1, y: 0 };
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    setParticles([]);
  };

  const pauseGame = () => {
    setIsPlaying(false);
  };

  const resumeGame = () => {
    if (!gameOver) {
      setIsPlaying(true);
    }
  };

  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    if (isPlaying) {
      setIsPlaying(false);
      setGameOver(false);
    }
  };

  return (
    <div className="snake-game">
      <div className="game-header">
        <h1 className="game-title">二次元贪吃蛇</h1>
        <div className="score-display">得分: {score}</div>
      </div>

      <div className="game-container">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="game-canvas"
        />

        {!isPlaying && !gameOver && (
          <div className="game-overlay">
            <div className="overlay-content">
              <h2>按空格键开始游戏</h2>
              <p>使用方向键控制蛇的移动</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="game-overlay game-over">
            <div className="overlay-content">
              <h2>游戏结束!</h2>
              <p className="final-score">最终得分: {score}</p>
              <button className="restart-button" onClick={startGame}>
                重新开始
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="game-controls">
        <div className="difficulty-selector">
          <label>难度选择:</label>
          <div className="difficulty-buttons">
            {Object.entries(DIFFICULTY_LEVELS).map(([key, { label }]) => (
              <button
                key={key}
                className={`difficulty-btn ${difficulty === key ? 'active' : ''}`}
                onClick={() => changeDifficulty(key)}
                disabled={isPlaying}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="control-buttons">
          {!isPlaying && !gameOver ? (
            <button className="control-btn start-btn" onClick={startGame}>
              开始游戏
            </button>
          ) : isPlaying ? (
            <button className="control-btn pause-btn" onClick={pauseGame}>
              暂停
            </button>
          ) : !gameOver ? (
            <button className="control-btn resume-btn" onClick={resumeGame}>
              继续
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default SnakeGame;
