import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Trophy,
  Waves,
  Fish,
  Crown,
  Zap,
  Shell,
  Anchor,
  Sparkles,
} from "lucide-react";
import OceanGameScene from "../components/OceanGameScene";

const OceanGame = () => {
  const [currentView, setCurrentView] = useState<"menu" | "game">("menu");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "shallow" | "deep" | "abyss"
  >("shallow");
  const [playerStats] = useState({
    level: 3,
    score: 850,
    streak: 5,
    pearlsCollected: 23,
  });

  const difficulties = [
    {
      id: "shallow" as const,
      name: "Shallow Waters",
      level: "Level 1-3",
      color: "bg-gradient-to-br from-cyan-400 to-cyan-600",
      icon: <Fish className="w-8 h-8" />,
      description:
        "Perfect for beginners learning addition and subtraction. Start your underwater journey in calm, clear waters.",
      depth: "0-10m depth",
    },
    {
      id: "deep" as const,
      name: "Deep Ocean",
      level: "Level 4-6",
      color: "bg-gradient-to-br from-blue-500 to-blue-700",
      icon: <Shell className="w-8 h-8" />,
      description:
        "Explore deeper waters with multiplication and division challenges. Discover hidden treasures of knowledge.",
      depth: "10-100m depth",
    },
    {
      id: "abyss" as const,
      name: "Ocean Abyss",
      level: "Level 7-10",
      color: "bg-gradient-to-br from-indigo-600 to-purple-700",
      icon: <Crown className="w-8 h-8" />,
      description:
        "Venture into the mysterious abyss with advanced mathematical operations. Only the bravest explorers dare to go this deep.",
      depth: "100m+ depth",
    },
  ];

  const achievements = [
    { name: "First Dive", description: "Complete 5 problems", earned: true },
    {
      name: "Pearl Hunter",
      description: "Collect 10 pearls in a row",
      earned: true,
    },
    { name: "Ocean Explorer", description: "Reach level 3", earned: true },
    {
      name: "Master Diver",
      description: "Get 100% on a level",
      earned: false,
    },
  ];

  if (currentView === "game") {
    return (
      <OceanGameScene
        onBackToMenu={() => setCurrentView("menu")}
        difficulty={selectedDifficulty}
      />
    );
  }

  return (
    <div className="min-h-screen ocean-container">
      {/* Floating Bubbles Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-cyan-200/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: -20,
            }}
            animate={{
              y: [-20, -window.innerHeight - 100],
              x: [0, (Math.random() - 0.5) * 200],
              scale: [0.5, 1.2, 0.3],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div
        className="relative z-10 p-4 sm:p-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <motion.div
            className="flex items-center space-x-2 sm:space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center bubble-glow">
              <Sparkles className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Ocean Math Adventure
              </h1>
              <p className="text-xs sm:text-sm text-cyan-300">
                Underwater Learning Quest
              </p>
            </div>
          </motion.div>

          <motion.div
            className="coral-display px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-2">
              <Shell className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              <span className="text-sm sm:text-base font-semibold text-cyan-100">
                {playerStats.pearlsCollected}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-6">
        {/* Hero Section - Full Width Horizontal Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <Card className="coral-display border-cyan-500/30 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 via-blue-600/10 to-indigo-600/10"></div>
            <div className="relative z-10 p-8 sm:p-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center lg:text-left">
                  <motion.div
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/30 mb-6"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Waves className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-300">
                      Depth Level {playerStats.level}
                    </span>
                  </motion.div>

                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cyan-100 mb-4">
                    Deep Sea Explorer
                  </h1>
                  <p className="text-lg sm:text-xl text-cyan-300 mb-6 max-w-2xl">
                    Embark on an underwater mathematical adventure. Solve
                    equations as you explore the mysterious depths of the ocean.
                  </p>

                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <div className="flex items-center space-x-2 text-cyan-300 bg-cyan-500/10 px-4 py-2 rounded-full">
                      <Shell className="w-5 h-5 text-cyan-400" />
                      <span className="font-semibold">
                        {playerStats.pearlsCollected} Pearls
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-cyan-300 bg-blue-500/10 px-4 py-2 rounded-full">
                      <Trophy className="w-5 h-5 text-blue-400" />
                      <span className="font-semibold">
                        {playerStats.score} Points
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-cyan-300 bg-purple-500/10 px-4 py-2 rounded-full">
                      <Zap className="w-5 h-5 text-purple-400" />
                      <span className="font-semibold">
                        {playerStats.streak} Streak
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <motion.div
                    className="w-64 h-64 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 flex items-center justify-center bubble-glow relative"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      rotate: {
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                      },
                      scale: { duration: 4, repeat: Infinity },
                    }}
                  >
                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-700/30 flex items-center justify-center relative">
                      <Sparkles className="w-20 h-20 text-cyan-300" />
                      {/* Floating elements around the main circle */}
                      <motion.div
                        className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400/30 rounded-full"
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute -bottom-2 -left-6 w-6 h-6 bg-blue-400/30 rounded-full"
                        animate={{ y: [5, -5, 5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Difficulty Selection - Vertical Cards in Stacked Layout */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-cyan-100 mb-4">
              Choose Your Diving Depth
            </h2>
            <p className="text-lg text-cyan-300 max-w-2xl mx-auto">
              Each depth offers unique mathematical challenges. Start shallow
              and work your way down to the mysterious abyss.
            </p>
          </div>

          <div className="space-y-6">
            {difficulties.map((difficulty, index) => (
              <motion.div
                key={difficulty.name}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="w-full"
              >
                <Card
                  className={`coral-display border-cyan-500/30 cursor-pointer transition-all duration-500 hover:border-cyan-400/50 overflow-hidden relative group ${
                    selectedDifficulty === difficulty.id
                      ? "border-cyan-400 ring-2 ring-cyan-400/50"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedDifficulty(difficulty.id);
                    setCurrentView("game");
                  }}
                >
                  <div className="flex flex-col lg:flex-row items-center p-8 gap-8">
                    {/* Left side - Icon and basic info */}
                    <div className="flex-shrink-0 text-center lg:text-left">
                      <div
                        className={`w-24 h-24 rounded-full ${difficulty.color} flex items-center justify-center text-white shadow-xl mb-4 mx-auto lg:mx-0`}
                      >
                        {difficulty.icon}
                      </div>
                      <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-sm px-3 py-1">
                        {difficulty.depth}
                      </Badge>
                    </div>

                    {/* Center - Main content */}
                    <div className="flex-1 text-center lg:text-left">
                      <h3 className="text-3xl font-bold text-cyan-100 mb-2">
                        {difficulty.name}
                      </h3>
                      <p className="text-cyan-400 font-semibold text-xl mb-4">
                        {difficulty.level}
                      </p>
                      <p className="text-cyan-300 text-lg leading-relaxed mb-6">
                        {difficulty.description}
                      </p>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-cyan-400 mb-2">
                          <span>Difficulty Level</span>
                          <span>{((index + 1) * 33).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-cyan-900/30 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${difficulty.color} transition-all duration-700 group-hover:scale-x-105`}
                            style={{ width: `${(index + 1) * 33}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Action button */}
                    <div className="flex-shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button className="wave-button py-4 px-8 text-lg font-semibold min-w-[200px]">
                          <Play className="w-6 h-6 mr-3" />
                          Start Diving
                        </Button>
                      </motion.div>

                      {selectedDifficulty === difficulty.id && (
                        <div className="flex items-center justify-center mt-3">
                          <div className="w-3 h-3 bg-cyan-400 rounded-full bubble-glow animate-pulse"></div>
                          <span className="text-cyan-300 text-sm ml-2">
                            Selected
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-cyan-400/5 to-transparent rounded-tl-full"></div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Achievements Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <Card className="coral-display border-cyan-500/30 p-8">
            <h2 className="text-2xl font-bold text-cyan-100 mb-6 text-center">
              Ocean Achievements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.name}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    achievement.earned
                      ? "bg-cyan-500/10 border-cyan-400/30"
                      : "bg-slate-500/10 border-slate-500/20 opacity-60"
                  }`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        achievement.earned
                          ? "bg-cyan-400/20 text-cyan-400"
                          : "bg-gray-600 text-gray-400"
                      }`}
                    >
                      <Trophy className="w-5 h-5" />
                    </div>
                    <div>
                      <h3
                        className={`font-semibold ${
                          achievement.earned ? "text-cyan-300" : "text-gray-400"
                        }`}
                      >
                        {achievement.name}
                      </h3>
                      <p className="text-sm text-cyan-400/70">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default OceanGame;
