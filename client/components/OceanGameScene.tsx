import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Sphere, Box, Cylinder } from "@react-three/drei";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  RotateCcw,
  Shell,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Waves,
} from "lucide-react";
import * as THREE from "three";

interface OceanGameSceneProps {
  onBackToMenu: () => void;
  difficulty: "shallow" | "deep" | "abyss";
}

// 3D Floating Pearl with Math Problem
const MathPearl = ({
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
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
    }
  });

  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[1.2, 32, 32]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.15 : 1}
      >
        <meshPhongMaterial
          color={isActive ? "#00bcd4" : "#546e7a"}
          transparent
          opacity={isActive ? 0.9 : 0.6}
          emissive={isActive ? "#006064" : "#263238"}
          shininess={100}
        />
      </Sphere>

      {/* Coral decoration around pearl */}
      <Cylinder
        args={[0.1, 0.3, 0.8]}
        position={[1.5, -0.5, 0]}
        rotation={[0, 0, Math.PI / 6]}
      >
        <meshPhongMaterial color="#ff6b6b" emissive="#d63031" />
      </Cylinder>
      <Cylinder
        args={[0.08, 0.25, 0.6]}
        position={[-1.2, -0.3, 0.5]}
        rotation={[0, 0, -Math.PI / 4]}
      >
        <meshPhongMaterial color="#ff9ff3" emissive="#fd79a8" />
      </Cylinder>

      {isActive && (
        <Text
          position={[0, 0, 1.3]}
          fontSize={0.4}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {problem}
        </Text>
      )}
    </group>
  );
};

// Animated Submarine (Player)
const Submarine = ({ position }: { position: [number, number, number] }) => {
  const subRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (subRef.current) {
      subRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
      subRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
    }
  });

  return (
    <group ref={subRef} position={position}>
      {/* Main body */}
      <Cylinder args={[0.3, 0.4, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <meshPhongMaterial color="#4fc3f7" emissive="#0277bd" />
      </Cylinder>
      {/* Nose cone */}
      <Cylinder
        args={[0.1, 0.3, 0.5]}
        position={[0.75, 0, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <meshPhongMaterial color="#29b6f6" emissive="#0288d1" />
      </Cylinder>
      {/* Propeller */}
      <Box args={[0.1, 0.8, 0.05]} position={[-0.8, 0, 0]}>
        <meshPhongMaterial color="#ffb74d" emissive="#ff8f00" />
      </Box>
      {/* Periscope */}
      <Cylinder args={[0.02, 0.02, 0.4]} position={[0.2, 0.5, 0]}>
        <meshPhongMaterial color="#757575" emissive="#424242" />
      </Cylinder>
      {/* Windows */}
      <Sphere args={[0.15]} position={[0.3, 0.1, 0.25]}>
        <meshPhongMaterial color="#81d4fa" transparent opacity={0.7} />
      </Sphere>
      <Sphere args={[0.15]} position={[0.3, 0.1, -0.25]}>
        <meshPhongMaterial color="#81d4fa" transparent opacity={0.7} />
      </Sphere>
    </group>
  );
};

// Floating Sea Plants
const SeaPlants = () => {
  return (
    <>
      {[...Array(6)].map((_, i) => (
        <group
          key={i}
          position={[Math.random() * 20 - 10, -3, Math.random() * 20 - 10]}
        >
          <Cylinder
            args={[0.05, 0.02, Math.random() * 2 + 1]}
            position={[0, Math.random() + 0.5, 0]}
          >
            <meshPhongMaterial color="#4caf50" emissive="#1b5e20" />
          </Cylinder>
        </group>
      ))}
    </>
  );
};

const OceanGameScene = ({ onBackToMenu, difficulty }: OceanGameSceneProps) => {
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
    shallow: [
      { problem: "3 + 4 = ?", answer: 7, options: [7, 6, 8, 5] },
      { problem: "10 - 6 = ?", answer: 4, options: [4, 3, 5, 16] },
      { problem: "8 + 3 = ?", answer: 11, options: [11, 10, 12, 5] },
      { problem: "12 - 5 = ?", answer: 7, options: [7, 6, 8, 17] },
      { problem: "6 + 7 = ?", answer: 13, options: [13, 12, 14, 1] },
      { problem: "15 - 9 = ?", answer: 6, options: [6, 5, 7, 24] },
      { problem: "4 + 9 = ?", answer: 13, options: [13, 12, 14, 5] },
      { problem: "14 - 8 = ?", answer: 6, options: [6, 5, 7, 22] },
    ],
    deep: [
      { problem: "7 × 8 = ?", answer: 56, options: [56, 54, 48, 64] },
      { problem: "54 ÷ 6 = ?", answer: 9, options: [9, 8, 10, 6] },
      { problem: "8 × 9 = ?", answer: 72, options: [72, 63, 81, 64] },
      { problem: "64 ÷ 8 = ?", answer: 8, options: [8, 7, 9, 6] },
      { problem: "6 × 7 = ?", answer: 42, options: [42, 36, 48, 35] },
      { problem: "45 ÷ 5 = ?", answer: 9, options: [9, 8, 10, 5] },
      { problem: "9 × 7 = ?", answer: 63, options: [63, 56, 72, 54] },
      { problem: "56 ÷ 7 = ?", answer: 8, options: [8, 7, 9, 6] },
    ],
    abyss: [
      { problem: "12² = ?", answer: 144, options: [144, 124, 164, 134] },
      { problem: "√169 = ?", answer: 13, options: [13, 12, 14, 11] },
      { problem: "8³ = ?", answer: 512, options: [512, 256, 768, 612] },
      { problem: "∛64 = ?", answer: 4, options: [4, 3, 5, 8] },
      { problem: "15² = ?", answer: 225, options: [225, 205, 245, 215] },
      { problem: "√196 = ?", answer: 14, options: [14, 13, 15, 12] },
      { problem: "6³ = ?", answer: 216, options: [216, 186, 246, 196] },
      { problem: "∛125 = ?", answer: 5, options: [5, 4, 6, 3] },
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
        message: "Excellent! +100 pearls",
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
    <div className="min-h-screen ocean-container relative">
      {/* Floating Bubbles Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-cyan-200/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: -20,
            }}
            animate={{
              y: [-20, -window.innerHeight - 100],
              x: [0, (Math.random() - 0.5) * 150],
              scale: [0.3, 1, 0.2],
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Game HUD */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="wave-button text-xs sm:text-sm"
                  onClick={onBackToMenu}
                >
                  <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Surface
                </Button>
              </motion.div>

              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="px-2 py-1 text-xs sm:text-sm bg-cyan-600/30 text-cyan-200 border-cyan-500/50"
                >
                  Problems: {problemsCompleted} / 10
                </Badge>
                <Badge
                  variant={
                    difficulty === "shallow"
                      ? "secondary"
                      : difficulty === "deep"
                        ? "default"
                        : "destructive"
                  }
                  className="px-2 py-1 text-xs sm:text-sm capitalize bg-blue-600/30 text-blue-200 border-blue-500/50"
                >
                  {difficulty}
                </Badge>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <Card className="coral-display px-2 py-1 sm:px-4 sm:py-2 border-cyan-500/30">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                  <span className="text-xs sm:text-base font-semibold text-cyan-200">
                    {score}
                  </span>
                </div>
              </Card>

              <Card className="coral-display px-2 py-1 sm:px-4 sm:py-2 border-cyan-500/30">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
                  <span className="text-xs sm:text-base font-semibold text-cyan-200">
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
                  className="wave-button w-8 h-8 sm:w-auto sm:h-auto p-2 sm:px-3 sm:py-2"
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
          <ambientLight intensity={0.4} color="#4dd0e1" />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#00acc1" />
          <pointLight
            position={[-10, -10, -10]}
            intensity={0.5}
            color="#26c6da"
          />
          <pointLight position={[0, -5, 0]} intensity={0.3} color="#80deea" />

          <SeaPlants />

          <Submarine position={[0, -2, 2]} />

          <MathPearl
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
            <Card className="coral-display p-4 sm:p-6 border-cyan-500/30">
              <div className="text-center mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-cyan-200 mb-2">
                  {problems[currentProblem]?.problem}
                </h2>
                <h3 className="text-base sm:text-lg font-semibold text-cyan-300">
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
                      className="w-full wave-button text-sm sm:text-lg py-4 sm:py-6 px-2 sm:px-4"
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
          <Card className="coral-display p-8 border-cyan-500/50 text-center max-w-md">
            <div className="flex flex-col items-center space-y-4">
              {feedback.correct ? (
                <CheckCircle className="w-16 h-16 text-cyan-400" />
              ) : (
                <XCircle className="w-16 h-16 text-red-400" />
              )}
              <h3
                className={`text-2xl font-bold ${
                  feedback.correct ? "text-cyan-300" : "text-red-400"
                }`}
              >
                {feedback.correct ? "Correct!" : "Incorrect"}
              </h3>
              <p className="text-cyan-300">{feedback.message}</p>
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
          <Card className="coral-display p-8 border-cyan-500/50 text-center max-w-md">
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <Waves className="w-16 h-16 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-cyan-200">
                Dive Complete!
              </h2>
              <div className="space-y-2">
                <p className="text-lg text-cyan-300">Pearls Collected:</p>
                <p className="text-4xl font-bold text-cyan-400">{score}</p>
                <p className="text-cyan-400">
                  Problems solved: {problemsCompleted} / 10
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="wave-button" onClick={resetGame}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Dive Again
                </Button>
                <Button
                  variant="outline"
                  className="wave-button"
                  onClick={onBackToMenu}
                >
                  Back to Surface
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default OceanGameScene;
