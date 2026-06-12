import React, { useState, useEffect } from "react";
import SnailWater from "./components/SnailWater";
import BeetleFinance from "./components/BeetleFinance";
import FireflyTimer from "./components/FireflyTimer";
import CaterpillarJournal from "./components/CaterpillarJournal";
import BugAnalytics from "./components/BugAnalytics";
import ForestEnvironment from "./components/ForestEnvironment";
import CanopyPage from "./components/CanopyPage";
import AmbientBeetle from "./components/AmbientBeetle";
import WellnessBackdrop from "./components/WellnessBackdrop";
import FocusBackdrop from "./components/FocusBackdrop";
import CocoonBackdrop from "./components/CocoonBackdrop";
import "./App.css";

// Seed initial database
const getInitialState = (key, fallback) => {
  const raw = localStorage.getItem(key);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }
  return fallback;
};

// Date helpers
const getTodayStr = () => {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzoffset).toISOString().slice(0, 10);
};

const getOffsetDateStr = (days) => {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  return new Date(Date.now() - tzoffset + days * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
};

const defaultTransactions = [
  {
    id: "1",
    desc: "Soil Nutrients",
    amount: 845,
    type: "essential",
    date: getOffsetDateStr(-4),
  },
  {
    id: "2",
    desc: "Moss Carpet Rug",
    amount: 1500,
    type: "joyful",
    date: getOffsetDateStr(-3),
  },
  {
    id: "3",
    desc: "Bioluminescent Gems",
    amount: 358,
    type: "impulsive",
    date: getOffsetDateStr(-2),
  },
  {
    id: "4",
    desc: "Weekly Fern Spores",
    amount: 450,
    type: "joyful",
    date: getOffsetDateStr(-1),
  },
  {
    id: "5",
    desc: "Sweet Nectar Brew",
    amount: 75,
    type: "impulsive",
    date: getTodayStr(),
  },
];

const defaultExercise = [
  {
    id: "1",
    type: "Yoga",
    duration: 45,
    intensity: "low",
    notes: "Leaf stretches, focused on posture",
    date: getOffsetDateStr(-4),
  },
  {
    id: "2",
    type: "Cardio",
    duration: 30,
    intensity: "high",
    notes: "Run across log paths",
    date: getOffsetDateStr(-2),
  },
  {
    id: "3",
    type: "Strength",
    duration: 50,
    intensity: "medium",
    notes: "Pebble lifting",
    date: getTodayStr(),
  },
];

const defaultSleep = [
  { date: getOffsetDateStr(-4), hours: 7.5, quality: 4 },
  { date: getOffsetDateStr(-3), hours: 6.0, quality: 2 },
  { date: getOffsetDateStr(-2), hours: 8.0, quality: 5 },
  { date: getOffsetDateStr(-1), hours: 6.5, quality: 3 },
  { date: getTodayStr(), hours: 7.2, quality: 4 },
];

const defaultWater = {};
defaultWater[getOffsetDateStr(-2)] = 8;
defaultWater[getOffsetDateStr(-1)] = 6;
defaultWater[getTodayStr()] = 4;

const defaultMood = {};
defaultMood[getOffsetDateStr(-4)] = "calm";
defaultMood[getOffsetDateStr(-3)] = "tired";
defaultMood[getOffsetDateStr(-2)] = "excited";
defaultMood[getOffsetDateStr(-1)] = "stressed";
defaultMood[getTodayStr()] = "calm";

const defaultTodos = [
  {
    id: "1",
    title: "Collect dew drops on fern leaves",
    completed: true,
    date: getTodayStr(),
  },
  {
    id: "2",
    title: "Write in reflection cocoon",
    completed: false,
    date: getTodayStr(),
  },
  {
    id: "3",
    title: "Stretch legs post crawl",
    completed: false,
    date: getTodayStr(),
  },
];

const defaultJournals = [
  {
    id: "1",
    date: getOffsetDateStr(-3),
    prompt: "What triggered negative feelings today, and why?",
    body: "Felt very sluggish crawling around. Slept poorly, which drained my cognitive energy. Need to anchor my presence.",
    mood: "tired",
  },
  {
    id: "2",
    date: getTodayStr(),
    prompt: "What are you grateful for in this exact moment?",
    body: "Grateful for crisp fresh moss, sweet rain, and the slow pathways in my second brain.",
    mood: "calm",
  },
];

const defaultAwareness = {};
defaultAwareness[getOffsetDateStr(-4)] = 7;
defaultAwareness[getOffsetDateStr(-3)] = 3;
defaultAwareness[getOffsetDateStr(-2)] = 8;
defaultAwareness[getOffsetDateStr(-1)] = 4;
defaultAwareness[getTodayStr()] = 6;

export default function App() {
  const [view, setView] = useState("dashboard");

  // Database States
  const [transactions, setTransactions] = useState(() =>
    getInitialState("zm_transactions", defaultTransactions),
  );
  const [exercise, setExercise] = useState(() =>
    getInitialState("zm_exercise", defaultExercise),
  );
  const [sleep, setSleep] = useState(() =>
    getInitialState("zm_sleep", defaultSleep),
  );
  const [water, setWater] = useState(() =>
    getInitialState("zm_water", defaultWater),
  );
  const [mood, setMood] = useState(() =>
    getInitialState("zm_mood", defaultMood),
  );
  const [todos, setTodos] = useState(() =>
    getInitialState("zm_todos", defaultTodos),
  );
  const [journals, setJournals] = useState(() =>
    getInitialState("zm_journals", defaultJournals),
  );
  const [awareness, setAwareness] = useState(() =>
    getInitialState("zm_awareness", defaultAwareness),
  );
  const [budget, setBudget] = useState(() =>
    getInitialState("zm_budget", 25000),
  );
  const [isBinFull, setIsBinFull] = useState(() =>
    getInitialState("zm_is_bin_full", false),
  );

  // Todo filter
  const [todoFilter, setTodoFilter] = useState("all");
  const [newTodoTitle, setNewTodoTitle] = useState("");

  // Sleep Logging Forms
  const [sleepHours, setSleepHours] = useState("");
  const [sleepQuality, setSleepQuality] = useState("4");

  // Exercise logging forms
  const [exeType, setExeType] = useState("Cardio");
  const [exeDur, setExeDur] = useState("");
  const [exeIntensity, setExeIntensity] = useState("medium");
  const [exeNotes, setExeNotes] = useState("");

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("zm_transactions", JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem("zm_exercise", JSON.stringify(exercise));
  }, [exercise]);
  useEffect(() => {
    localStorage.setItem("zm_sleep", JSON.stringify(sleep));
  }, [sleep]);
  useEffect(() => {
    localStorage.setItem("zm_water", JSON.stringify(water));
  }, [water]);
  useEffect(() => {
    localStorage.setItem("zm_mood", JSON.stringify(mood));
  }, [mood]);
  useEffect(() => {
    localStorage.setItem("zm_todos", JSON.stringify(todos));
  }, [todos]);
  useEffect(() => {
    localStorage.setItem("zm_journals", JSON.stringify(journals));
  }, [journals]);
  useEffect(() => {
    localStorage.setItem("zm_awareness", JSON.stringify(awareness));
  }, [awareness]);
  useEffect(() => {
    localStorage.setItem("zm_budget", budget.toString());
  }, [budget]);
  useEffect(() => {
    localStorage.setItem("zm_is_bin_full", JSON.stringify(isBinFull));
  }, [isBinFull]);

  const today = getTodayStr();

  // 1. Transaction Handlers
  const handleAddTransaction = (newT) => {
    setTransactions((prev) => [
      { id: Math.random().toString(36).substring(2, 9), ...newT },
      ...prev,
    ]);
  };

  const handleDeleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // 2. Hydration Handlers
  const handleWaterChange = (amount) => {
    setWater((prev) => {
      const current = prev[today] || 0;
      const nextVal = Math.max(0, current + amount);
      return { ...prev, [today]: nextVal };
    });
  };

  // 3. Sleep Handlers
  const handleSleepSubmit = (e) => {
    e.preventDefault();
    if (!sleepHours) return;
    setSleep((prev) => {
      const filtered = prev.filter((sl) => sl.date !== today);
      return [
        ...filtered,
        {
          date: today,
          hours: parseFloat(sleepHours),
          quality: parseInt(sleepQuality),
        },
      ];
    });
    setSleepHours("");
  };

  // 4. Exercise Handlers
  const handleExerciseSubmit = (e) => {
    e.preventDefault();
    if (!exeDur) return;
    setExercise((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: exeType,
        duration: parseInt(exeDur),
        intensity: exeIntensity,
        notes: exeNotes,
        date: today,
      },
      ...prev,
    ]);
    setExeDur("");
    setExeNotes("");
  };

  const handleDeleteExercise = (id) => {
    if (window.confirm("Remove this exercise record?")) {
      setExercise((prev) => prev.filter((ex) => ex.id !== id));
    }
  };

  // 5. Journal Handlers
  const handleAddJournal = (newJ) => {
    setJournals((prev) => [
      { id: Math.random().toString(36).substring(2, 9), ...newJ },
      ...prev,
    ]);
  };

  const handleDeleteJournal = (id) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
  };

  // 6. Focus Complete Handler (Pomodoro complete)
  const handleFocusComplete = () => {
    setTodos((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        title: "Focus session completed",
        completed: true,
        date: today,
      },
      ...prev,
    ]);
  };

  // 7. Todo Handlers
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    setTodos((prev) => [
      {
        id: Math.random().toString(36).substring(2, 9),
        title: newTodoTitle.trim(),
        completed: false,
        date: today,
      },
      ...prev,
    ]);
    setNewTodoTitle("");
  };

  const handleToggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const [sweepingIds, setSweepingIds] = useState([]);

  const handleCleanPrunedLeaves = () => {
    const completedTasks = todos.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    const idsToSweep = completedTasks.map((t) => t.id);
    setSweepingIds(idsToSweep);

    // Wait for the CSS sweep animation to finish, then remove from state
    setTimeout(() => {
      setTodos((prev) => prev.filter((t) => !t.completed));
      setSweepingIds([]);
      setIsBinFull(true);
    }, 450);
  };

  // 8. Daily Presence Slider
  const handlePresenceChange = (val) => {
    setAwareness((prev) => ({ ...prev, [today]: val }));
  };

  // Dashboard Stats Calculations
  const currentMonthPrefix = today.slice(0, 7);
  const thisMonthSpend = transactions
    .filter((t) => t.date.startsWith(currentMonthPrefix))
    .reduce((acc, t) => acc + t.amount, 0);

  const todayExerciseDur = exercise
    .filter((ex) => ex.date === today)
    .reduce((acc, ex) => acc + ex.duration, 0);

  const todayTodos = todos.filter((t) => t.date === today);
  const completedTodayCount = todayTodos.filter((t) => t.completed).length;

  const calculateDailyScore = () => {
    let score = 0;
    const presenceRating = awareness[today] || 5;
    score += (presenceRating / 10) * 4;
    if (journals.some((j) => j.date === today)) score += 2;
    const sleepLogged = sleep.some((sl) => sl.date === today);
    const waterLogged = water[today] && water[today] > 0;
    const exerciseLogged = exercise.some((ex) => ex.date === today);
    if (sleepLogged || waterLogged || exerciseLogged) score += 2;
    if (todayTodos.length > 0) {
      score += (completedTodayCount / todayTodos.length) * 2;
    } else {
      score += 1;
    }
    return parseFloat(score.toFixed(1));
  };

  const dailyScore = calculateDailyScore();

  // Create stream of today's activities
  const getStreamList = () => {
    const stream = [];

    transactions
      .filter((t) => t.date === today)
      .forEach((t) => {
        stream.push({
          id: t.id,
          sort: 3,
          icon: (
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          ),
          title: t.desc,
          meta: `₹${t.amount.toFixed(2)} spent`,
          tag:
            t.type === "essential"
              ? "Roots"
              : t.type === "joyful"
                ? "Nectar"
                : "Pebbles",
          tagClass: `tag-${t.type}`,
        });
      });

    exercise
      .filter((ex) => ex.date === today)
      .forEach((ex) => {
        stream.push({
          id: ex.id,
          sort: 4,
          icon: (
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          ),
          title: `${ex.type} workout`,
          meta: `${ex.duration}m · ${ex.intensity}`,
          tag: "Wellness",
          tagClass: "tag-essential",
        });
      });

    sleep
      .filter((sl) => sl.date === today)
      .forEach((sl) => {
        stream.push({
          id: "sl",
          sort: 1,
          icon: (
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ),
          title: "Rest logged",
          meta: `${sl.hours}h · quality ${sl.quality}/5`,
          tag: "Sleep",
          tagClass: "tag-joyful",
        });
      });

    journals
      .filter((j) => j.date === today)
      .forEach((j) => {
        stream.push({
          id: j.id,
          sort: 2,
          icon: (
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          ),
          title: "Reflection archived",
          meta: j.body.substring(0, 50) + "...",
          tag: "Presence",
          tagClass: "tag-joyful",
        });
      });

    if (water[today] > 0) {
      stream.push({
        id: "wt",
        sort: 0,
        icon: (
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
        ),
        title: "Hydration",
        meta: `${water[today]} cups consumed`,
        tag: "Water",
        tagClass: "tag-joyful",
      });
    }

    return stream.sort((a, b) => b.sort - a.sort);
  };

  const streamList = getStreamList();

  // Generate primary insight
  const getPrimaryInsight = () => {
    let impulsiveCount = 0;
    let impulsiveOnLowMood = 0;
    transactions.forEach((t) => {
      if (t.type === "impulsive") {
        impulsiveCount++;
        const m = mood[t.date];
        if (m === "stressed" || m === "down" || m === "tired")
          impulsiveOnLowMood++;
      }
    });

    if (impulsiveCount > 0) {
      const pct = Math.round((impulsiveOnLowMood / impulsiveCount) * 100);
      if (pct >= 50) {
        return {
          title: "Emotional Capital Leaks",
          text: `${pct}% of your impulsive purchases occurred on low-mood days. Consider pausing during fatigue states.`,
        };
      }
    }
    return {
      title: "Signals Collecting",
      text: "Your forest creatures are collecting daily signals. Log more data to sync correlations across your life metrics.",
    };
  };

  const primaryInsight = getPrimaryInsight();

  // Filtered Todos
  let filteredTodos = [...todos];
  if (todoFilter === "active")
    filteredTodos = filteredTodos.filter((t) => !t.completed);
  else if (todoFilter === "completed")
    filteredTodos = filteredTodos.filter((t) => t.completed);

  return (
    <div className="app-container">
      <ForestEnvironment />

      <aside className="sidebar">
        <div
          className="brand"
          onClick={() => setView("dashboard")}
          style={{ cursor: "pointer", position: "relative" }}
        >
          <div className="brand-logo">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82" />
              <path d="M17 8c3-1 6 0 6 0s-1 3-2 5c-1.5 3-4.5 5-8 6" />
            </svg>
          </div>
          <span className="brand-name">ZenMind</span>
          <AmbientBeetle
            type="jewel"
            style={{
              position: "absolute",
              right: "12px",
              top: "-6px",
              width: "38px",
              height: "38px",
            }}
          />
        </div>

        <nav className="nav-list">
          <button
            type="button"
            className={`nav-link ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <rect x="3" y="3" width="7" height="9" rx="1" />
              <rect x="14" y="3" width="7" height="5" rx="1" />
              <rect x="14" y="12" width="7" height="9" rx="1" />
              <rect x="3" y="16" width="7" height="5" rx="1" />
            </svg>
            <span>Canopy Home</span>
          </button>
          <button
            type="button"
            className={`nav-link ${view === "finance" ? "active" : ""}`}
            onClick={() => setView("finance")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v12M15 9.5c-.8-1-2.2-1.5-3.5-1.2-2 .5-2.5 3.2-.5 4.2 1.5.8 3 1.5 3 3.2 0 1.5-1.5 2.5-3 2.3-1.2-.2-2.2-.9-2.5-1.5" />
            </svg>
            <span>Acorn Vault</span>
          </button>
          <button
            type="button"
            className={`nav-link ${view === "wellness" ? "active" : ""}`}
            onClick={() => setView("wellness")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <span>Foliage Hub</span>
          </button>
          <button
            type="button"
            className={`nav-link ${view === "tasks" ? "active" : ""}`}
            onClick={() => setView("tasks")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Focus Stalk</span>
          </button>
          <button
            type="button"
            className={`nav-link ${view === "journal" ? "active" : ""}`}
            onClick={() => setView("journal")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            <span>Cocoon Log</span>
          </button>
          <button
            type="button"
            className={`nav-link ${view === "analytics" ? "active" : ""}`}
            onClick={() => setView("analytics")}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span>Awareness</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="theme-toggle-btn">
            <span>Living Rainforest v2.0</span>
          </div>
          <div className="user-profile">
            <div className="user-avatar">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89-.82" />
                <path d="M17 8c3-1 6 0 6 0s-1 3-2 5" />
              </svg>
            </div>
            <div className="user-info">
              <span className="user-name">Forest Explorer</span>
              <span className="user-title">Natural Presence</span>
            </div>
          </div>
        </div>
      </aside>

      <main
        className={`main-viewport ${view === "dashboard" ? "main-cottage-soft" : ""} ${view === "finance" ? "main-coin-vault" : ""} ${view === "wellness" ? "main-wellness-hub" : ""}`}
      >
        {view === "dashboard" && (
          <CanopyPage
            thisMonthSpend={thisMonthSpend}
            waterToday={water[today] || 0}
            todayExerciseDur={todayExerciseDur}
            dailyScore={dailyScore}
            awareness={awareness}
            today={today}
            onPresenceChange={handlePresenceChange}
            primaryInsight={primaryInsight}
            streamList={streamList}
          />
        )}

        {view === "finance" && (
          <BeetleFinance
            transactions={transactions}
            budget={budget}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onUpdateBudget={setBudget}
          />
        )}

        {view === "wellness" && (
          <div className="view-section wellness-view">
            <WellnessBackdrop />
            <div className="view-header">
              <h2>Wellness & Foliage Hub</h2>
              <p>
                Keep your biological framework fully charged. Water, sleep, and
                motion coordinates.
              </p>
            </div>

            <div
              className="wellness-content"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <SnailWater
                waterCount={water[today] || 0}
                onWaterChange={handleWaterChange}
              />

              <div className="pebble-panel-2 compact-wellness-combined">
                {/* Canopy Rest Column */}
                <div className="combined-section rest-section">
                  <h3
                    className="panel-title"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>Canopy Rest</span>
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="var(--text-dim)"
                      strokeWidth="2"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  </h3>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Log hours under branches to restore canopy power.
                  </p>
                  <form
                    onSubmit={handleSleepSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.85rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Rest hours</label>
                        <input
                          type="number"
                          className="input-field"
                          step="0.5"
                          min="0"
                          max="24"
                          value={sleepHours}
                          onChange={(e) => setSleepHours(e.target.value)}
                          placeholder="e.g. 7.5"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Sleep Quality</label>
                        <select
                          className="input-field"
                          value={sleepQuality}
                          onChange={(e) => setSleepQuality(e.target.value)}
                        >
                          <option value="5">Deep & Restful (5/5)</option>
                          <option value="4">Good (4/5)</option>
                          <option value="3">Average (3/5)</option>
                          <option value="2">Restless (2/5)</option>
                          <option value="1">Interrupted (1/5)</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-secondary btn-sm"
                      style={{ padding: "0.45rem 1rem", fontSize: "0.8rem", color: "var(--deep-forest)" }}
                    >
                      Log Rest
                    </button>
                  </form>
                </div>

                {/* Divider line for desktop */}
                <div className="combined-separator"></div>

                {/* Emotional Climate Column */}
                <div className="combined-section mood-section">
                  <h3
                    className="panel-title"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>Emotional Climate</span>
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="var(--text-dim)"
                      strokeWidth="2"
                    >
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  </h3>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.85rem",
                    }}
                  >
                    Mark your mental weather pattern for today&apos;s forest
                    log.
                  </p>
                  <div
                    className="mood-picker"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      gap: "0.4rem",
                    }}
                  >
                    {[
                      {
                        key: "excited",
                        label: "Excited",
                        svg: (
                          <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="#e9b872"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ),
                      },
                      {
                        key: "calm",
                        label: "Calm",
                        svg: (
                          <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="#8fae8c"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 9.8a7 7 0 0 1-9 8.2z" />
                            <path d="M19 2L9.8 11.2" />
                          </svg>
                        ),
                      },
                      {
                        key: "tired",
                        label: "Tired",
                        svg: (
                          <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="#8fa4be"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                          </svg>
                        ),
                      },
                      {
                        key: "stressed",
                        label: "Stressed",
                        svg: (
                          <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="#a09c98"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M17.5 19A3.5 3.5 0 0 0 21 15.5c0-2.79-3-3.5-3-3.5A7.5 7.5 0 0 0 4 11.5S4 12.5 5 14c-1.5 1-2.5 2.5-2.5 4.5A3.5 3.5 0 0 0 6 22h11.5z" />
                          </svg>
                        ),
                      },
                      {
                        key: "down",
                        label: "Down",
                        svg: (
                          <svg
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            fill="none"
                            stroke="#b89078"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                          </svg>
                        ),
                      },
                    ].map((m) => (
                      <button
                        key={m.key}
                        type="button"
                        className={`mood-btn ${mood[today] === m.key ? "selected" : ""}`}
                        onClick={() =>
                          setMood((prev) => ({ ...prev, [today]: m.key }))
                        }
                      >
                        {m.svg}
                        <span>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pebble-panel-wide">
              <h3 className="panel-title">Movement Logs</h3>
              <div
                className="finance-grid"
                style={{ gridTemplateColumns: "1fr 1.5fr" }}
              >
                <form
                  onSubmit={handleExerciseSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.85rem",
                  }}
                >
                  <div className="form-group">
                    <label>Movement Type</label>
                    <select
                      className="input-field"
                      value={exeType}
                      onChange={(e) => setExeType(e.target.value)}
                    >
                      <option value="Cardio">Cardio (Run, Cycle, Walk)</option>
                      <option value="Strength">
                        Strength (Lift, Resistance)
                      </option>
                      <option value="Yoga">Yoga / Stretching</option>
                      <option value="Other">Other Active Play</option>
                    </select>
                  </div>
                  <div className="form-row-2">
                    <div className="form-group">
                      <label>Duration (mins)</label>
                      <input
                        type="number"
                        className="input-field"
                        min="1"
                        value={exeDur}
                        onChange={(e) => setExeDur(e.target.value)}
                        placeholder="30"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Intensity</label>
                      <select
                        className="input-field"
                        value={exeIntensity}
                        onChange={(e) => setExeIntensity(e.target.value)}
                      >
                        <option value="high">Vigorous (High)</option>
                        <option value="medium">Moderate (Medium)</option>
                        <option value="low">Light (Low)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Notes</label>
                    <input
                      type="text"
                      className="input-field"
                      value={exeNotes}
                      onChange={(e) => setExeNotes(e.target.value)}
                      placeholder="e.g. Breezy morning trail run"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Log Exercise
                  </button>
                </form>

                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Movement</th>
                        <th>Duration</th>
                        <th>Intensity</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.length === 0 ? (
                        <tr>
                          <td
                            colSpan="5"
                            style={{
                              textAlign: "center",
                              color: "var(--text-dim)",
                              padding: "1.5rem",
                            }}
                          >
                            No workouts logged yet.
                          </td>
                        </tr>
                      ) : (
                        exercise.map((ex) => (
                          <tr key={ex.id}>
                            <td>
                              <strong>{ex.type}</strong>
                            </td>
                            <td>{ex.duration}m</td>
                            <td>
                              <span className="tag tag-essential">
                                {ex.intensity}
                              </span>
                            </td>
                            <td>{ex.date.slice(5)}</td>
                            <td>
                              <button
                                type="button"
                                className="todo-delete"
                                onClick={() => handleDeleteExercise(ex.id)}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  width="16"
                                  height="16"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === "tasks" && (
          <div className="view-section tasks-view">
            <FocusBackdrop />
            <div className="view-header">
              <h2>Focus Stalk & Timer</h2>
              <p>
                Sync checklists with your focus sessions. Micro tasks build
                garden arches.
              </p>
            </div>

            <div className="tasks-grid">
              <div
                className="glass panel pebble-panel-1"
                style={{ position: "relative" }}
              >
                <h3 className="panel-title">Arbor Task Board</h3>
                <form
                  onSubmit={handleAddTodo}
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  <input
                    type="text"
                    className="input-field"
                    value={newTodoTitle}
                    onChange={(e) => setNewTodoTitle(e.target.value)}
                    placeholder="Grow a new objective..."
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Plant
                  </button>
                </form>

                <div
                  className="task-filters"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <button
                      type="button"
                      className={`filter-btn ${todoFilter === "all" ? "active" : ""}`}
                      onClick={() => setTodoFilter("all")}
                    >
                      All Tasks
                    </button>
                    <button
                      type="button"
                      className={`filter-btn ${todoFilter === "active" ? "active" : ""}`}
                      onClick={() => setTodoFilter("active")}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      className={`filter-btn ${todoFilter === "completed" ? "active" : ""}`}
                      onClick={() => setTodoFilter("completed")}
                    >
                      Pruned
                    </button>
                  </div>
                  {(todoFilter === "completed" || todoFilter === "all") && (
                    <button
                      type="button"
                      onClick={handleCleanPrunedLeaves}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: "0.75rem", padding: "0.3rem 0.6rem", color: "var(--deep-forest)" }}
                      title="Clean all yellow done tasks into the compost bin"
                    >
                      Sweep Pruned Leaves
                    </button>
                  )}
                </div>

                <div
                  className="todo-list"
                  style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    paddingRight: "0.25rem",
                    paddingBottom: "80px",
                  }}
                >
                  {filteredTodos.length === 0 ? (
                    <div
                      className="todo-item"
                      style={{
                        borderStyle: "dashed",
                        justifyContent: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--text-dim)",
                          fontSize: "0.88rem",
                        }}
                      >
                        No targets found matching filter.
                      </span>
                    </div>
                  ) : (
                    filteredTodos.map((todo) => {
                      const isSweeping = sweepingIds.includes(todo.id);
                      return (
                        <div
                          key={todo.id}
                          className={`todo-item ${todo.completed ? "completed" : ""} ${isSweeping ? "sweeping" : ""}`}
                        >
                          <div className="todo-left">
                            <div
                              className="todo-leaf-wrapper"
                              onClick={() => handleToggleTodo(todo.id)}
                            >
                              {todo.completed ? (
                                /* Yellow / Dull folded leaf for done tasks */
                                <svg
                                  viewBox="0 0 24 24"
                                  width="24"
                                  height="24"
                                  fill="#d4a843"
                                  stroke="#b8860b"
                                  strokeWidth="1"
                                >
                                  <path
                                    d="M12 2 C16 4, 20 8, 20 14 C20 19, 16 22, 12 22 C8 22, 4 19, 4 14 C4 8, 8 4, 12 2 Z"
                                    opacity="0.8"
                                  />
                                  <path
                                    d="M12 4 L12 20 M12 12 L16 8 M12 16 L17 12 M12 12 L8 8 M12 16 L7 12"
                                    stroke="#b8860b"
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              ) : (
                                /* Crisp green leaf for active tasks */
                                <svg
                                  viewBox="0 0 24 24"
                                  width="24"
                                  height="24"
                                  fill="#6b8f3c"
                                  stroke="#4a7c59"
                                  strokeWidth="1.5"
                                >
                                  <path d="M12 2 C18 6, 22 10, 22 16 C22 20, 16 22, 12 22 C8 22, 2 20, 2 16 C2 10, 6 6, 12 2 Z" />
                                  <path
                                    d="M12 4 L12 20 M12 12 L18 6 M12 16 L18 10 M12 12 L6 6 M12 16 L6 10"
                                    stroke="#4a7c59"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              )}
                            </div>
                            <span
                              className="todo-label"
                              style={{
                                color: todo.completed
                                  ? "#d4a843"
                                  : "var(--text-main)",
                                textDecoration: "none",
                                opacity: 1,
                              }}
                            >
                              {todo.title}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="todo-delete"
                            onClick={() => handleDeleteTodo(todo.id)}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              width="18"
                              height="18"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div style={{ position: "relative" }}>
                <FireflyTimer onFocusComplete={handleFocusComplete} />
                <AmbientBeetle
                  type="cicada"
                  style={{
                    position: "absolute",
                    right: "12px",
                    bottom: "12px",
                    width: "42px",
                    height: "42px",
                  }}
                />
              </div>
            </div>

            {/* The Compost Bin on the right end of the page */}
            <div
              className={`compost-bin-container ${isBinFull ? "full" : "empty"}`}
              onClick={() => setIsBinFull(false)}
              title={
                isBinFull
                  ? "Compost bin is full! Click to empty."
                  : "Compost bin (empty)"
              }
            >
              <div className="compost-bin-lid"></div>
              <div className="compost-bin-body">
                {/* Wood slats */}
                <div className="bin-slat"></div>
                <div className="bin-slat"></div>
                <div className="bin-slat"></div>

                {/* Overflow leaves inside the bin */}
                {isBinFull && (
                  <div className="bin-overflow-leaves">
                    <svg
                      className="bin-leaf leaf-1"
                      viewBox="0 0 24 24"
                      width="14"
                      height="14"
                      fill="#d4a843"
                    >
                      <path d="M12 2 C16 4, 20 8, 20 14 C20 19, 16 22, 12 22 C8 22, 4 19, 4 14 C4 8, 8 4, 12 2 Z" />
                    </svg>
                    <svg
                      className="bin-leaf leaf-2"
                      viewBox="0 0 24 24"
                      width="12"
                      height="12"
                      fill="#c4a35a"
                    >
                      <path d="M12 2 C16 4, 20 8, 20 14 C20 19, 16 22, 12 22 C8 22, 4 19, 4 14 C4 8, 8 4, 12 2 Z" />
                    </svg>
                    <svg
                      className="bin-leaf leaf-3"
                      viewBox="0 0 24 24"
                      width="10"
                      height="10"
                      fill="#e5c158"
                    >
                      <path d="M12 2 C16 4, 20 8, 20 14 C20 19, 16 22, 12 22 C8 22, 4 19, 4 14 C4 8, 8 4, 12 2 Z" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Scattered yellow leaves at the foot of the bin */}
              {isBinFull && (
                <div className="compost-bin-foot-leaves">
                  <svg
                    className="foot-leaf f-leaf-1"
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="#d4a843"
                    transform="rotate(45)"
                  >
                    <path d="M12 2 C16 4, 20 8, 20 14 C20 19, 16 22, 12 22 C8 22, 4 19, 4 14 C4 8, 8 4, 12 2 Z" />
                  </svg>
                  <svg
                    className="foot-leaf f-leaf-2"
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="#c4a35a"
                    transform="rotate(-30)"
                  >
                    <path d="M12 2 C16 4, 20 8, 20 14 C20 19, 16 22, 12 22 C8 22, 4 19, 4 14 C4 8, 8 4, 12 2 Z" />
                  </svg>
                  <svg
                    className="foot-leaf f-leaf-3"
                    viewBox="0 0 24 24"
                    width="15"
                    height="15"
                    fill="#b5892b"
                    transform="rotate(85)"
                  >
                    <path d="M12 2 C16 4, 20 8, 20 14 C20 19, 16 22, 12 22 C8 22, 4 19, 4 14 C4 8, 8 4, 12 2 Z" />
                  </svg>
                  <svg
                    className="foot-leaf f-leaf-4"
                    viewBox="0 0 24 24"
                    width="11"
                    height="11"
                    fill="#d4a843"
                    transform="rotate(-70)"
                  >
                    <path d="M12 2 C16 4, 20 8, 20 14 C20 19, 16 22, 12 22 C8 22, 4 19, 4 14 C4 8, 8 4, 12 2 Z" />
                  </svg>
                </div>
              )}
            </div>
          </div>
        )}

        {view === "journal" && (
          <div
            className="view-section journal-view"
            style={{ position: "relative" }}
          >
            <CocoonBackdrop />
            <CaterpillarJournal
              journals={journals}
              onAddJournal={handleAddJournal}
              onDeleteJournal={handleDeleteJournal}
              todayMood={mood[today]}
            />
            <AmbientBeetle
              type="stag"
              style={{
                position: "absolute",
                right: "12px",
                bottom: "12px",
                width: "46px",
                height: "46px",
              }}
            />
          </div>
        )}

        {view === "analytics" && (
          <BugAnalytics
            transactions={transactions}
            awareness={awareness}
            mood={mood}
            journals={journals}
          />
        )}
      </main>
    </div>
  );
}
