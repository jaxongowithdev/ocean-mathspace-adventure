import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Text,
  Sphere,
  Box,
  Cylinder,
  Plane,
} from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
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
  Zap,
  Brain,
  Star,
  Compass,
  Anchor,
} from "lucide-react";
import * as THREE from "three";

interface OceanGameSceneProps {
  onBackToMenu: () => void;
  difficulty: "shallow" | "deep" | "abyss";
}

// Floating Question Orb in 3D
const QuestionOrb = ({
  position,
  problem,
  isActive,
}: {
  position: [number, number, number];
  problem: string;
  isActive: boolean;
}) => {
  const orbRef = useRef<THREE.Group>(null);
  const innerOrbRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (orbRef.current) {
      orbRef.current.rotation.y += 0.01;
      orbRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
    if (innerOrbRef.current) {
      innerOrbRef.current.rotation.x += 0.02;
      innerOrbRef.current.rotation.z += 0.01;
    }
  });

  return (
    <group ref={orbRef} position={position}>
      {/* Outer glow sphere */}
      <Sphere args={[2, 32, 32]}>
        <meshPhongMaterial
          color={isActive ? "#00e5ff" : "#546e7a"}
          transparent
          opacity={0.3}
          emissive={isActive ? "#0097a7" : "#263238"}
        />
      </Sphere>

      {/* Inner core */}
      <Sphere ref={innerOrbRef} args={[1.2, 32, 32]}>
        <meshPhongMaterial
          color={isActive ? "#26c6da" : "#607d8b"}
          emissive={isActive ? "#004d5c" : "#102027"}
          shininess={100}
        />
      </Sphere>

      {/* Question text */}
      {isActive && (
        <Text
          position={[0, 0, 2.5]}
          fontSize={0.6}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={6}
        >
          {problem}
        </Text>
      )}

      {/* Rotating ring decoration */}
      {isActive && (
        <group>
          <Cylinder args={[2.5, 2.5, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]}>
            <meshPhongMaterial color="#00bcd4" transparent opacity={0.6} />
          </Cylinder>
        </group>
      )}
    </group>
  );
};

// Underwater Environment
const UnderwaterScene = () => {
  return (
    <>
      {/* Ocean floor */}
      <Plane
        args={[50, 50]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -5, 0]}
      >
        <meshPhongMaterial color="#1a3a4a" />
      </Plane>

      {/* Coral formations */}
      {[...Array(8)].map((_, i) => (
        <group
          key={i}
          position={[
            Math.random() * 30 - 15,
            -4 + Math.random() * 2,
            Math.random() * 30 - 15,
          ]}
        >
          <Cylinder
            args={[0.1, 0.3, Math.random() * 2 + 1]}
            position={[0, Math.random() + 0.5, 0]}
          >
            <meshPhongMaterial
              color={i % 2 === 0 ? "#ff6b6b" : "#ff9ff3"}
              emissive={i % 2 === 0 ? "#d63031" : "#fd79a8"}
            />
          </Cylinder>
        </group>
      ))}

      {/* Swimming fish */}
      {[...Array(6)].map((_, i) => (
        <group
          key={`fish-${i}`}
          position={[
            Math.random() * 20 - 10,
            Math.random() * 4 - 1,
            Math.random() * 20 - 10,
          ]}
        >
          <Box args={[0.5, 0.2, 0.8]}>
            <meshPhongMaterial color="#4fc3f7" emissive="#0277bd" />
          </Box>
          <Box args={[0.3, 0.1, 0.3]} position={[-0.3, 0, 0]}>
            <meshPhongMaterial color="#29b6f6" emissive="#0288d1" />
          </Box>
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
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
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
      { problem: "5 + 8 = ?", answer: 13, options: [13, 11, 15, 10] },
      { problem: "16 - 7 = ?", answer: 9, options: [9, 8, 10, 23] },
      { problem: "12 + 9 = ?", answer: 21, options: [21, 20, 22, 3] },
      { problem: "25 - 8 = ?", answer: 17, options: [17, 15, 19, 33] },
      { problem: "14 + 6 = ?", answer: 20, options: [20, 18, 22, 8] },
      { problem: "30 - 12 = ?", answer: 18, options: [18, 16, 20, 42] },
      { problem: "7 + 15 = ?", answer: 22, options: [22, 21, 23, 8] },
      { problem: "28 - 9 = ?", answer: 19, options: [19, 18, 20, 37] },
    ],
    deep: [
      { problem: "9 × 7 = ?", answer: 63, options: [63, 56, 72, 54] },
      { problem: "84 ÷ 12 = ?", answer: 7, options: [7, 6, 8, 12] },
      { problem: "8 × 9 = ?", answer: 72, options: [72, 63, 81, 64] },
      { problem: "96 ÷ 8 = ?", answer: 12, options: [12, 11, 13, 8] },
      { problem: "7 × 11 = ?", answer: 77, options: [77, 70, 84, 66] },
      { problem: "132 ÷ 11 = ?", answer: 12, options: [12, 11, 13, 10] },
      { problem: "6 × 13 = ?", answer: 78, options: [78, 72, 84, 65] },
      { problem: "144 ÷ 12 = ?", answer: 12, options: [12, 11, 13, 14] },
    ],
    abyss: [
      { problem: "17² = ?", answer: 289, options: [289, 279, 299, 269] },
      { problem: "√324 = ?", answer: 18, options: [18, 17, 19, 16] },
      { problem: "13³ = ?", answer: 2197, options: [2197, 2187, 2207, 2177] },
      { problem: "∛729 = ?", answer: 9, options: [9, 8, 10, 7] },
      { problem: "19² = ?", answer: 361, options: [361, 351, 371, 341] },
      { problem: "√441 = ?", answer: 21, options: [21, 20, 22, 19] },
      { problem: "11³ = ?", answer: 1331, options: [1331, 1321, 1341, 1311] },
      { problem: "∛512 = ?", answer: 8, options: [8, 7, 9, 6] },
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
    setSelectedAnswer(selectedAnswer);

    if (isCorrect) {
      setScore(score + 100);
      setFeedback({
        show: true,
        correct: true,
        message: "Perfect! You found the treasure! +100 pearls",
      });
    } else {
      setFeedback({
        show: true,
        correct: false,
        message: `Not quite right. The answer is ${problems[currentProblem].answer}`,
      });
    }

    setTimeout(() => {
      setFeedback({ show: false, correct: false, message: "" });
      setSelectedAnswer(null);
      const newProblemsCompleted = problemsCompleted + 1;
      setProblemsCompleted(newProblemsCompleted);

      if (newProblemsCompleted >= 10) {
        setGameState("ended");
      } else {
        const nextProblem = Math.floor(Math.random() * problems.length);
        setCurrentProblem(nextProblem);
      }
    }, 2500);
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(60);
    const newProblem = Math.floor(Math.random() * problems.length);
    setCurrentProblem(newProblem);
    setProblemsCompleted(0);
    setSelectedAnswer(null);
    setGameState("playing");
    setFeedback({ show: false, correct: false, message: "" });
    if (problems[newProblem]) {
      setShuffledOptions(shuffleArray(problems[newProblem].options));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 relative overflow-hidden">
      {/* Dynamic water effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-blue-500/10"></div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-cyan-300/60 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: -10,
            }}
            animate={{
              y: [-10, -window.innerHeight - 50],
              x: [0, (Math.random() - 0.5) * 100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Top HUD Bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 p-3 sm:p-4"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-3 sm:p-4">
            {/* Mobile Layout */}
            <div className="block sm:hidden space-y-3">
              {/* Top row - Surface button and Reset */}
              <div className="flex items-center justify-between">
                <Button
                  onClick={onBackToMenu}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-400/30 rounded-xl text-sm px-3 py-2"
                >
                  <ArrowLeft className="w-3 h-3 mr-1" />
                  Surface
                </Button>

                <Button
                  onClick={resetGame}
                  className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border-gray-400/30 rounded-xl p-2"
                >
                  <RotateCcw className="w-3 h-3" />
                </Button>
              </div>

              {/* Middle row - Question info */}
              <div className="flex items-center justify-center space-x-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs px-2 py-1">
                  Q{problemsCompleted + 1}/10
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 capitalize text-xs px-2 py-1">
                  {difficulty}
                </Badge>
              </div>

              {/* Bottom row - Stats */}
              <div className="flex items-center justify-center space-x-3">
                <div className="bg-blue-500/20 rounded-lg px-3 py-1 border border-blue-400/30">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-blue-300" />
                    <span className="text-blue-100 font-semibold text-sm">
                      {score}
                    </span>
                  </div>
                </div>

                <div className="bg-orange-500/20 rounded-lg px-3 py-1 border border-orange-400/30">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-orange-300" />
                    <span className="text-orange-100 font-semibold text-sm">
                      {timeLeft}s
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={onBackToMenu}
                  className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border-cyan-400/30 rounded-xl"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Surface
                </Button>

                <div className="flex items-center space-x-3">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                    Question {problemsCompleted + 1}/10
                  </Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 capitalize">
                    {difficulty} Zone
                  </Badge>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-blue-500/20 rounded-xl px-4 py-2 border border-blue-400/30">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-300" />
                    <span className="text-blue-100 font-semibold">{score}</span>
                  </div>
                </div>

                <div className="bg-orange-500/20 rounded-xl px-4 py-2 border border-orange-400/30">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-orange-300" />
                    <span className="text-orange-100 font-semibold">
                      {timeLeft}s
                    </span>
                  </div>
                </div>

                <Button
                  onClick={resetGame}
                  className="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 border-gray-400/30 rounded-xl p-3"
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3D Scene Container */}
      <div className="absolute inset-0 pt-24 pb-64">
        <Canvas camera={{ position: [0, 2, 12], fov: 60 }}>
          <ambientLight intensity={0.4} color="#4dd0e1" />
          <pointLight position={[15, 15, 15]} intensity={0.8} color="#00acc1" />
          <pointLight
            position={[-15, 5, -15]}
            intensity={0.6}
            color="#26c6da"
          />
          <directionalLight
            position={[0, 10, 5]}
            intensity={0.5}
            color="#80deea"
          />

          <UnderwaterScene />

          <QuestionOrb
            position={[0, 2, 0]}
            problem={problems[currentProblem]?.problem || ""}
            isActive={gameState === "playing" && !feedback.show}
          />

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            maxDistance={20}
            minDistance={8}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Bottom Answer Panel */}
      <AnimatePresence>
        {gameState === "playing" && !feedback.show && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-20 p-6"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 p-8">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Compass className="w-6 h-6 text-cyan-300" />
                    <h3 className="text-2xl font-bold text-white">
                      Navigate to the Answer
                    </h3>
                    <Compass className="w-6 h-6 text-cyan-300" />
                  </div>
                  <p className="text-cyan-200 text-lg">
                    {problems[currentProblem]?.problem}
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {shuffledOptions.map((option, index) => (
                    <motion.div
                      key={`${currentProblem}-${index}`}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className="w-full h-20 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 hover:from-cyan-400/30 hover:to-blue-500/30 border border-cyan-400/30 rounded-2xl text-xl font-bold text-white transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                        onClick={() =>
                          handleAnswer(
                            option,
                            option === problems[currentProblem].answer,
                          )
                        }
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold">
                              {String.fromCharCode(65 + index)}
                            </span>
                          </div>
                          <span>{option}</span>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center space-x-6">
                    <div className="flex items-center space-x-2 text-cyan-300">
                      <Brain className="w-5 h-5" />
                      <span>Think carefully...</span>
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-300">
                      <Star className="w-5 h-5" />
                      <span>+100 pearls for correct answer</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedback.show && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 50 }}
              className="bg-black/80 backdrop-blur-xl rounded-3xl border border-white/20 p-8 max-w-md mx-4 text-center"
            >
              <div className="mb-6">
                {feedback.correct ? (
                  <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
                ) : (
                  <XCircle className="w-16 h-16 text-red-400 mx-auto" />
                )}
              </div>

              <h3
                className={`text-3xl font-bold mb-4 ${
                  feedback.correct ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {feedback.correct ? "Treasure Found!" : "Keep Exploring!"}
              </h3>

              <p className="text-white text-lg mb-6">{feedback.message}</p>

              {selectedAnswer && (
                <div className="bg-white/10 rounded-2xl p-4 mb-4">
                  <p className="text-cyan-300">
                    Your answer:{" "}
                    <span className="font-bold text-white">
                      {selectedAnswer}
                    </span>
                  </p>
                  {!feedback.correct && (
                    <p className="text-emerald-300 mt-2">
                      Correct answer:{" "}
                      <span className="font-bold text-white">
                        {problems[currentProblem].answer}
                      </span>
                    </p>
                  )}
                </div>
              )}

              <div className="text-sm text-gray-300">
                Next question in a moment...
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameState === "ended" && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 backdrop-blur-xl rounded-3xl border border-white/20 p-10 max-w-lg mx-4 text-center"
            >
              <Waves className="w-20 h-20 text-cyan-400 mx-auto mb-6" />

              <h2 className="text-4xl font-bold text-white mb-4">
                Expedition Complete!
              </h2>

              <div className="space-y-4 mb-8">
                <div className="bg-cyan-500/20 rounded-2xl p-4">
                  <p className="text-lg text-cyan-300">Pearls Collected</p>
                  <p className="text-3xl font-bold text-cyan-100">{score}</p>
                </div>

                <div className="bg-emerald-500/20 rounded-2xl p-4">
                  <p className="text-lg text-emerald-300">Problems Solved</p>
                  <p className="text-3xl font-bold text-emerald-100">
                    {problemsCompleted}/10
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={resetGame}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl py-3"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Dive Again
                </Button>

                <Button
                  onClick={onBackToMenu}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 rounded-2xl py-3"
                >
                  <Anchor className="w-5 h-5 mr-2" />
                  Return to Surface
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OceanGameScene;
