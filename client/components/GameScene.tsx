import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text, Sphere, Box } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  RotateCcw,
  Zap,
  Target,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import * as THREE from "three";

interface GameSceneProps {
  onBackToMenu: () => void;
  difficulty: "beginner" | "explorer" | "astronaut";
}

// 3D Floating Asteroid with Math Problem
const MathAsteroid = ({
  position,
  problem,
  answer,
  options,
  onAnswer,
  isActive,
}: {
  position: [number, number, number];
  problem: string;
  answer: number;
  options: number[];
  onAnswer: (selectedAnswer: number, isCorrect: boolean) => void;
  isActive: boolean;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[1.5, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        <meshPhongMaterial
          color={isActive ? "#8b5cf6" : "#374151"}
          transparent
          opacity={isActive ? 0.9 : 0.6}
          emissive={isActive ? "#4c1d95" : "#000000"}
        />
      </Sphere>

      {isActive && (
        <Text
          position={[0, 0, 1.6]}
          fontSize={0.5}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
        >
          {problem}
        </Text>
      )}
    </group>
  );
};

// Animated Space Ship (Player)
const SpaceShip = ({ position }: { position: [number, number, number] }) => {
  const shipRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (shipRef.current) {
      shipRef.current.rotation.z = Math.sin(state.clock.elapsedTime) * 0.1;
      shipRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <group ref={shipRef} position={position}>
      <Box args={[0.5, 0.2, 1]} position={[0, 0, 0]}>
        <meshPhongMaterial color="#06b6d4" emissive="#0891b2" />
      </Box>
      <Box args={[1.2, 0.1, 0.3]} position={[0, 0, -0.2]}>
        <meshPhongMaterial color="#0891b2" emissive="#0369a1" />
      </Box>
      <Box args={[0.1, 0.1, 0.3]} position={[0.3, 0.1, -0.5]}>
        <meshPhongMaterial color="#dc2626" emissive="#b91c1c" />
      </Box>
      <Box args={[0.1, 0.1, 0.3]} position={[-0.3, 0.1, -0.5]}>
        <meshPhongMaterial color="#dc2626" emissive="#b91c1c" />
      </Box>
    </group>
  );
};

const GameScene = ({ onBackToMenu, difficulty }: GameSceneProps) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [problemsCompleted, setProblemsCompleted] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<number[]>([]);
  const [gameState, setGameState] = useState<"playing" | "paused" | "ended">(
    "playing",
  );
  const [feedback, setFeedback] = useState<{
    show: boolean;
    correct: boolean;
    message: string;
  }>({ show: false, correct: false, message: "" });

  // Function to shuffle array
  const shuffleArray = (array: number[]) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Math problems data based on difficulty
  const problemSets = {
    beginner: [
      { problem: "5 + 3 = ?", answer: 8, options: [8, 7, 9, 6] },
      { problem: "12 - 4 = ?", answer: 8, options: [8, 6, 10, 16] },
      { problem: "7 + 6 = ?", answer: 13, options: [13, 12, 14, 11] },
      { problem: "15 - 8 = ?", answer: 7, options: [7, 6, 8, 23] },
      { problem: "9 + 4 = ?", answer: 13, options: [13, 12, 14, 5] },
      { problem: "20 - 7 = ?", answer: 13, options: [13, 12, 14, 27] },
      { problem: "6 + 8 = ?", answer: 14, options: [14, 13, 15, 2] },
      { problem: "18 - 9 = ?", answer: 9, options: [9, 8, 10, 27] },
    ],
    explorer: [
      { problem: "8 × 7 = ?", answer: 56, options: [56, 54, 48, 52] },
      { problem: "63 ÷ 9 = ?", answer: 7, options: [7, 6, 8, 9] },
      { problem: "9 × 6 = ?", answer: 54, options: [54, 52, 56, 48] },
      { problem: "72 ÷ 8 = ?", answer: 9, options: [9, 8, 10, 12] },
      { problem: "7 × 9 = ?", answer: 63, options: [63, 54, 72, 56] },
      { problem: "48 ÷ 6 = ?", answer: 8, options: [8, 7, 9, 6] },
      { problem: "6 × 8 = ?", answer: 48, options: [48, 42, 54, 56] },
      { problem: "81 ÷ 9 = ?", answer: 9, options: [9, 8, 10, 7] },
    ],
    astronaut: [
      { problem: "25² = ?", answer: 625, options: [625, 525, 725, 675] },
      { problem: "√144 = ?", answer: 12, options: [12, 11, 13, 14] },
      { problem: "15² - 13² = ?", answer: 56, options: [56, 52, 60, 48] },
      { problem: "∛125 = ?", answer: 5, options: [5, 4, 6, 3] },
      { problem: "8³ = ?", answer: 512, options: [512, 256, 768, 612] },
      { problem: "√225 = ?", answer: 15, options: [15, 14, 16, 13] },
      { problem: "12² + 5² = ?", answer: 169, options: [169, 144, 194, 149] },
      { problem: "∛216 = ?", answer: 6, options: [6, 5, 7, 8] },
    ],
  };

  const problems = problemSets[difficulty];

  // Initialize shuffled options on mount
  useEffect(() => {
    if (problems[0]) {
      const shuffled = shuffleArray(problems[0].options);
      setShuffledOptions(shuffled);
    }
  }, []);

  // Shuffle options when problem changes
  useEffect(() => {
    if (problems[currentProblem]) {
      const shuffled = shuffleArray(problems[currentProblem].options);
      setShuffledOptions(shuffled);
    }
  }, [currentProblem]);

  // Timer effect
  useEffect(() => {
    if (gameState === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setGameState("ended");
    }
  }, [timeLeft, gameState]);

  const handleAnswer = (selectedAnswer: number, isCorrect: boolean) => {
    console.log(
      "Answer selected:",
      selectedAnswer,
      "Correct answer:",
      problems[currentProblem].answer,
      "Is correct:",
      isCorrect,
    );

    if (isCorrect) {
      setScore(score + 100);
      setFeedback({
        show: true,
        correct: true,
        message: "Excellent! +100 points",
      });
    } else {
      setFeedback({
        show: true,
        correct: false,
        message: `Incorrect. The correct answer is ${problems[currentProblem].answer}`,
      });
    }

    setTimeout(() => {
      setFeedback({ show: false, correct: false, message: "" });
      const newProblemsCompleted = problemsCompleted + 1;
      setProblemsCompleted(newProblemsCompleted);

      if (newProblemsCompleted >= 10) {
        setGameState("ended");
      } else {
        // Select a random problem for next round
        const nextProblem = Math.floor(Math.random() * problems.length);
        setCurrentProblem(nextProblem);
      }
    }, 2000);
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(60);
    const newProblem = Math.floor(Math.random() * problems.length);
    setCurrentProblem(newProblem);
    setProblemsCompleted(0);
    setGameState("playing");
    setFeedback({ show: false, correct: false, message: "" });
    // Initialize shuffled options for first problem
    if (problems[newProblem]) {
      setShuffledOptions(shuffleArray(problems[newProblem].options));
    }
  };

  return (
    <div className="min-h-screen game-container relative">
      {/* Game HUD */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 game-hud">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="space-button text-xs sm:text-sm"
                  onClick={onBackToMenu}
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Menu
                </Button>
              </motion.div>

              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="px-2 py-1 text-xs sm:text-sm"
                >
                  Problems: {problemsCompleted} / 10
                </Badge>
                <Badge
                  variant={
                    difficulty === "beginner"
                      ? "secondary"
                      : difficulty === "explorer"
                        ? "default"
                        : "destructive"
                  }
                  className="px-2 py-1 text-xs sm:text-sm capitalize"
                >
                  {difficulty}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Card className="score-display px-2 py-1 sm:px-4 sm:py-2">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
                  <span className="text-xs sm:text-base font-semibold">
                    {score}
                  </span>
                </div>
              </Card>

              <Card className="score-display px-2 py-1 sm:px-4 sm:py-2">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                  <span className="text-xs sm:text-base font-semibold">
                    {timeLeft}s
                  </span>
                </div>
              </Card>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="space-button w-8 h-8 sm:w-auto sm:h-auto p-2 sm:px-3 sm:py-2"
                  onClick={resetGame}
                >
                  <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Scene */}
      <div className="h-screen">
        <Canvas camera={{ position: [0, 0, 8], fov: 75 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#8b5cf6"
          />

          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />

          <SpaceShip position={[0, -2, 2]} />

          <MathAsteroid
            position={[0, 1, 0]}
            problem={problems[currentProblem]?.problem || ""}
            answer={problems[currentProblem]?.answer || 0}
            options={problems[currentProblem]?.options || []}
            onAnswer={handleAnswer}
            isActive={gameState === "playing"}
          />

          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* Answer Options */}
      {gameState === "playing" && (
        <motion.div
          className="absolute bottom-4 sm:bottom-6 left-0 right-0 z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <Card className="score-display p-4 sm:p-6 border-border/50">
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">
                  {problems[currentProblem]?.problem}
                </h2>
                <h3 className="text-base sm:text-lg font-semibold">
                  Choose the correct answer:
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
                {shuffledOptions.map((option, index) => (
                  <motion.div
                    key={`${currentProblem}-${index}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      className="w-full space-button text-sm sm:text-lg py-4 sm:py-6 px-2 sm:px-4"
                      onClick={() =>
                        handleAnswer(
                          option,
                          option === problems[currentProblem].answer,
                        )
                      }
                    >
                      {option}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Feedback */}
      {feedback.show && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <Card className="score-display p-8 border-border/50 text-center max-w-md">
            <div className="flex flex-col items-center space-y-4">
              {feedback.correct ? (
                <CheckCircle className="w-16 h-16 text-secondary" />
              ) : (
                <XCircle className="w-16 h-16 text-destructive" />
              )}
              <h3
                className={`text-2xl font-bold ${
                  feedback.correct ? "text-secondary" : "text-destructive"
                }`}
              >
                {feedback.correct ? "Correct!" : "Incorrect"}
              </h3>
              <p className="text-muted-foreground">{feedback.message}</p>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Game Over */}
      {gameState === "ended" && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="score-display p-8 border-border/50 text-center max-w-md">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <Zap className="w-16 h-16 text-accent" />
              </div>
              <h2 className="text-3xl font-bold">Mission Complete!</h2>
              <div className="space-y-2">
                <p className="text-lg">Final Score:</p>
                <p className="text-4xl font-bold text-secondary">{score}</p>
                <p className="text-muted-foreground">
                  Problems solved: {problemsCompleted} / 10
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="space-button" onClick={resetGame}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Play Again
                </Button>
                <Button
                  variant="outline"
                  className="space-button"
                  onClick={onBackToMenu}
                >
                  Back to Menu
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default GameScene;
