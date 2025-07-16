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
  Star,
  MapPin,
  Compass,
  Gem,
  ArrowRight,
  TrendingUp,
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
      name: "Coral Reef",
      level: "Beginner",
      color: "from-emerald-400 via-teal-500 to-cyan-600",
      accent: "emerald",
      icon: <Fish className="w-12 h-12" />,
      description: "Explore vibrant coral reefs with basic math operations",
      problems: "Addition & Subtraction",
      depth: "5-15 meters",
      creatures: ["Clownfish", "Sea Turtle", "Coral"],
      reward: "50-100 pearls",
    },
    {
      id: "deep" as const,
      name: "Midnight Zone",
      level: "Intermediate",
      color: "from-blue-600 via-indigo-700 to-purple-800",
      accent: "blue",
      icon: <Compass className="w-12 h-12" />,
      description: "Navigate the mysterious depths with complex calculations",
      problems: "Multiplication & Division",
      depth: "200-1000 meters",
      creatures: ["Anglerfish", "Giant Squid", "Jellyfish"],
      reward: "100-200 pearls",
    },
    {
      id: "abyss" as const,
      name: "Abyssal Plains",
      level: "Expert",
      color: "from-purple-900 via-indigo-900 to-black",
      accent: "purple",
      icon: <Crown className="w-12 h-12" />,
      description: "Master the deepest ocean trenches with advanced math",
      problems: "Powers & Advanced Operations",
      depth: "4000+ meters",
      creatures: [
        "Deep Sea Dragon",
        "Bioluminescent Creatures",
        "Ancient Leviathan",
      ],
      reward: "200-500 pearls",
    },
  ];

  const quickStats = [
    {
      label: "Depth Record",
      value: "1,247m",
      icon: MapPin,
      color: "text-cyan-400",
    },
    {
      label: "Treasures Found",
      value: "89",
      icon: Gem,
      color: "text-emerald-400",
    },
    { label: "Sea Creatures", value: "34", icon: Fish, color: "text-blue-400" },
    {
      label: "Exploration Time",
      value: "12h",
      icon: Compass,
      color: "text-purple-400",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(120,200,255,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(100,255,200,0.1)_0%,transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(200,100,255,0.05)_0%,transparent_50%)]"></div>
      </div>

      {/* Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute opacity-20 ${
              i % 3 === 0
                ? "bg-cyan-400"
                : i % 3 === 1
                  ? "bg-emerald-400"
                  : "bg-purple-400"
            }`}
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              borderRadius: i % 2 === 0 ? "50%" : "20%",
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 40 - 20, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 20 + 15,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header Navigation */}
        <motion.header
          className="p-6"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-xl">
                  <Waves className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    AquaMath Explorer
                  </h1>
                  <p className="text-cyan-300">
                    Deep Sea Mathematical Adventures
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-black/20 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
                  <div className="flex items-center space-x-3">
                    <Shell className="w-5 h-5 text-cyan-400" />
                    <span className="text-white font-semibold">
                      {playerStats.pearlsCollected}
                    </span>
                    <span className="text-cyan-300 text-sm">Pearls</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="max-w-7xl mx-auto px-6 pb-8">
          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {quickStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:bg-black/30 transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Welcome Panel */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden h-full">
                <div className="relative p-8">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-cyan-400/20 to-transparent rounded-bl-full"></div>

                  <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                      <span className="text-emerald-400 font-semibold">
                        ONLINE • {Math.floor(Math.random() * 500 + 200)}{" "}
                        explorers diving
                      </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                      Dive Into
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                        {" "}
                        Mathematical
                      </span>
                      <br />
                      Ocean Depths
                    </h2>

                    <p className="text-xl text-gray-300 mb-8 max-w-2xl">
                      Embark on an underwater expedition where mathematics meets
                      marine exploration. Solve problems, discover hidden
                      treasures, and unlock the secrets of the deep.
                    </p>

                    <div className="flex flex-wrap gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-xl"
                          onClick={() => setCurrentView("game")}
                        >
                          <Play className="w-6 h-6 mr-3" />
                          Start Exploration
                        </Button>
                      </motion.div>

                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10 px-6 py-4 rounded-2xl"
                      >
                        <Anchor className="w-5 h-5 mr-2" />
                        View Progress
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Player Profile */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="bg-black/20 backdrop-blur-md rounded-3xl border border-white/10 p-6 h-full">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Star className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Deep Sea Explorer
                  </h3>
                  <div className="flex items-center justify-center space-x-2">
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
                      Level {playerStats.level}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                      Rank: Adventurer
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Experience</span>
                    <span className="text-white font-semibold">2,350 XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-2 rounded-full w-3/4"></div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="text-sm text-gray-400 mb-3">
                      Recent Achievements
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Trophy className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-gray-300">
                          First Deep Dive
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Gem className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-gray-300">
                          Treasure Hunter
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Ocean Zones */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">
                Choose Your Ocean Zone
              </h2>
              <p className="text-gray-300 text-lg">
                Each zone offers unique mathematical challenges and marine life
                encounters
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {difficulties.map((zone, index) => (
                <motion.div
                  key={zone.id}
                  className="group cursor-pointer"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => {
                    setSelectedDifficulty(zone.id);
                    setCurrentView("game");
                  }}
                >
                  <div
                    className={`relative bg-gradient-to-br ${zone.color} rounded-3xl overflow-hidden h-96 border border-white/20 group-hover:border-white/40 transition-all duration-500`}
                  >
                    {/* Zone Header */}
                    <div className="absolute top-0 left-0 right-0 p-6 bg-black/20 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="bg-white/20 rounded-full p-3">
                          {zone.icon}
                        </div>
                        <Badge className="bg-white/20 text-white border-white/30">
                          {zone.level}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">
                        {zone.name}
                      </h3>
                      <p className="text-white/80 text-sm">{zone.depth}</p>
                    </div>

                    {/* Zone Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-black/40 backdrop-blur-sm">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/80">Difficulty:</span>
                          <span className="text-white font-semibold">
                            {zone.problems}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-white/80">Reward:</span>
                          <span className="text-white font-semibold">
                            {zone.reward}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-white/90 text-sm mb-2">
                          {zone.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {zone.creatures.map((creature) => (
                            <Badge
                              key={creature}
                              className="bg-white/20 text-white text-xs border-white/30"
                            >
                              {creature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-xl group-hover:bg-white/40 transition-all">
                        <Play className="w-4 h-4 mr-2" />
                        Dive In
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10">
                      <div className="w-32 h-32 bg-white rounded-full"></div>
                    </div>

                    {selectedDifficulty === zone.id && (
                      <div className="absolute top-4 right-4">
                        <div className="w-4 h-4 bg-emerald-400 rounded-full animate-pulse shadow-lg"></div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OceanGame;
