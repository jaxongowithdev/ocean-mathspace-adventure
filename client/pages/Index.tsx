import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Trophy,
  User,
  Settings,
  BarChart3,
  Gamepad2,
  Rocket,
  Waves,
  Brain,
  Star,
  Award,
  Zap,
  Timer,
  Target,
  TrendingUp,
  Calendar,
  ChevronRight,
  Sparkles,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";
import GameScene from "../components/GameScene";

const Index = () => {
  const [currentView, setCurrentView] = useState<"portal" | "space-game">(
    "portal",
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "beginner" | "explorer" | "astronaut"
  >("beginner");
  const [activeSection, setActiveSection] = useState("games");

  const playerProfile = {
    name: "Space Explorer",
    level: 15,
    totalScore: 24500,
    gamesPlayed: 89,
    accuracy: 94,
    streak: 12,
    rank: "Master",
    achievements: 23,
  };

  const gameCategories = [
    {
      id: "space",
      title: "Space Adventure",
      subtitle: "Mathematical Journey Through the Cosmos",
      description: "Explore the universe while solving mathematical challenges",
      icon: <Rocket className="w-8 h-8" />,
      gradient: "from-purple-600 to-blue-600",
      route: "/",
      difficulty: ["Beginner", "Explorer", "Astronaut"],
      players: "2.3k",
      rating: 4.8,
    },
    {
      id: "ocean",
      title: "Ocean Depths",
      subtitle: "Underwater Mathematical Expedition",
      description: "Dive deep into the ocean while mastering math skills",
      icon: <Waves className="w-8 h-8" />,
      gradient: "from-cyan-600 to-blue-800",
      route: "/ocean",
      difficulty: ["Shallow", "Deep", "Abyss"],
      players: "1.8k",
      rating: 4.9,
    },
    {
      id: "future",
      title: "Quantum Realm",
      subtitle: "Coming Soon",
      description: "Advanced mathematical concepts in quantum physics",
      icon: <Sparkles className="w-8 h-8" />,
      gradient: "from-pink-600 to-purple-600",
      route: "#",
      difficulty: ["Novice", "Expert", "Quantum"],
      players: "Soon",
      rating: "New",
      comingSoon: true,
    },
  ];

  const recentStats = [
    {
      label: "Today's Score",
      value: "1,250",
      icon: <Target className="w-4 h-4" />,
    },
    {
      label: "Problems Solved",
      value: "47",
      icon: <Brain className="w-4 h-4" />,
    },
    { label: "Current Streak", value: "12", icon: <Zap className="w-4 h-4" /> },
    {
      label: "Time Played",
      value: "2h 15m",
      icon: <Timer className="w-4 h-4" />,
    },
  ];

  const achievements = [
    {
      name: "First Steps",
      description: "Complete first 10 problems",
      unlocked: true,
    },
    {
      name: "Speed Runner",
      description: "Solve 20 problems in 5 minutes",
      unlocked: true,
    },
    {
      name: "Perfect Score",
      description: "Get 100% accuracy in a session",
      unlocked: false,
    },
    { name: "Master Explorer", description: "Reach level 20", unlocked: false },
  ];

  if (currentView === "space-game") {
    return (
      <GameScene
        onBackToMenu={() => setCurrentView("portal")}
        difficulty={selectedDifficulty}
      />
    );
  }

  return (
    <div className="modern-portal">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-element"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Sidebar Navigation */}
        <motion.div
          className="sidebar-nav w-80 p-6 flex flex-col"
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: "easeOutCubic" }}
        >
          {/* Profile Section */}
          <motion.div
            className="glass-card p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="w-8 h-8 text-background" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {playerProfile.name}
                </h2>
                <p className="text-sm text-gray-300">
                  Level {playerProfile.level} • {playerProfile.rank}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-primary fill-current" />
                  <span className="text-xs text-gray-400">
                    {playerProfile.totalScore.toLocaleString()} points
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Menu */}
          <motion.nav
            className="space-y-2 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {[
              {
                id: "games",
                label: "Games",
                icon: <Gamepad2 className="w-5 h-5" />,
              },
              {
                id: "stats",
                label: "Statistics",
                icon: <BarChart3 className="w-5 h-5" />,
              },
              {
                id: "achievements",
                label: "Achievements",
                icon: <Award className="w-5 h-5" />,
              },
              {
                id: "settings",
                label: "Settings",
                icon: <Settings className="w-5 h-5" />,
              },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-primary text-background"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </motion.nav>

          {/* Quick Stats */}
          <motion.div
            className="stats-card p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Today's Progress
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {recentStats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center text-primary mb-1">
                    {stat.icon}
                  </div>
                  <div className="text-lg font-bold text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content Area */}
        <div className="flex-1 p-8 overflow-auto">
          <AnimatePresence mode="wait">
            {activeSection === "games" && (
              <motion.div
                key="games"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                {/* Header */}
                <div>
                  <motion.h1
                    className="text-4xl font-bold text-white mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    Mathematical Adventures
                  </motion.h1>
                  <motion.p
                    className="text-gray-300 text-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    Choose your adventure and embark on a learning journey
                  </motion.p>
                </div>

                {/* Game Categories Grid */}
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {gameCategories.map((game, index) => (
                    <motion.div
                      key={game.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {game.comingSoon ? (
                        <div className="game-tile p-6 h-80 relative opacity-75 cursor-not-allowed">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-16 flex items-center justify-center">
                            <div className="text-center">
                              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-300 font-semibold">
                                Coming Soon
                              </p>
                            </div>
                          </div>
                          <GameCategoryContent game={game} />
                        </div>
                      ) : (
                        <Link
                          to={game.route}
                          className="block"
                          onClick={() => {
                            if (game.id === "space") {
                              setCurrentView("space-game");
                            }
                          }}
                        >
                          <div className="game-tile p-6 h-80 cursor-pointer">
                            <GameCategoryContent game={game} />
                          </div>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Featured Section */}
                <motion.div
                  className="glass-card p-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      Continue Your Journey
                    </h2>
                    <Button className="modern-button">
                      View All <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="stats-card p-6 text-center">
                      <TrendingUp className="w-8 h-8 text-accent mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Progress Tracking
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Monitor your learning journey with detailed analytics
                      </p>
                    </div>
                    <div className="stats-card p-6 text-center">
                      <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Global Leaderboard
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Compete with players from around the world
                      </p>
                    </div>
                    <div className="stats-card p-6 text-center">
                      <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-white mb-2">
                        Daily Challenges
                      </h3>
                      <p className="text-gray-400 text-sm">
                        New puzzles and rewards every day
                      </p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {activeSection === "achievements" && (
              <motion.div
                key="achievements"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h1 className="text-4xl font-bold text-white mb-8">
                  Achievements
                </h1>
                <div className="grid md:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.name}
                      className={`stats-card p-6 ${achievement.unlocked ? "border-primary/30" : "opacity-60"}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            achievement.unlocked
                              ? "bg-primary/20 text-primary"
                              : "bg-gray-600 text-gray-400"
                          }`}
                        >
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {achievement.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === "stats" && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h1 className="text-4xl font-bold text-white mb-8">
                  Statistics
                </h1>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="stats-card p-6 text-center">
                    <Trophy className="w-8 h-8 text-primary mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">
                      {playerProfile.totalScore.toLocaleString()}
                    </div>
                    <div className="text-gray-400 text-sm">Total Score</div>
                  </div>
                  <div className="stats-card p-6 text-center">
                    <Gamepad2 className="w-8 h-8 text-accent mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">
                      {playerProfile.gamesPlayed}
                    </div>
                    <div className="text-gray-400 text-sm">Games Played</div>
                  </div>
                  <div className="stats-card p-6 text-center">
                    <Target className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">
                      {playerProfile.accuracy}%
                    </div>
                    <div className="text-gray-400 text-sm">Accuracy</div>
                  </div>
                  <div className="stats-card p-6 text-center">
                    <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-white">
                      {playerProfile.streak}
                    </div>
                    <div className="text-gray-400 text-sm">Current Streak</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const GameCategoryContent = ({ game }: { game: any }) => (
  <>
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center`}
      >
        {game.icon}
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-400">{game.players} players</div>
        <div className="flex items-center">
          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
          <span className="text-xs text-gray-300">{game.rating}</span>
        </div>
      </div>
    </div>

    <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
    <p className="text-sm text-primary font-medium mb-3">{game.subtitle}</p>
    <p className="text-gray-400 text-sm mb-4 flex-grow">{game.description}</p>

    <div className="mt-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        {game.difficulty.map((level: string) => (
          <Badge key={level} variant="secondary" className="text-xs">
            {level}
          </Badge>
        ))}
      </div>

      {!game.comingSoon && (
        <Button className="modern-button w-full">
          <Play className="w-4 h-4 mr-2" />
          Start Adventure
        </Button>
      )}
    </div>
  </>
);

export default Index;
