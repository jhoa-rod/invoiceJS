import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedState } from "../data/sampleData";
import { getTranslations } from "../utils/i18n";
import { loadStoredState, saveStoredState } from "../utils/storage";
import {
  buildRecommendations,
  computeTaskStats,
  getDailyTasks,
  getGoalSummaries,
  getOverdueTasks,
  getPriorityAlerts,
  getTasksForPeriod,
  getWeeklyTasks,
  groupTasksByStatus,
} from "../utils/planner";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(() => loadStoredState(seedState));

  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  const isAuthenticated = Boolean(state.session?.currentUserId);
  const currentUser =
    state.users.find((user) => user.id === state.session?.currentUserId) || null;
  const t = getTranslations(state.language);

  function setLanguage(language) {
    setState((current) => ({ ...current, language }));
  }

  function login({ email, password }) {
    const user = state.users.find(
      (item) => item.email === email.trim() && item.password === password,
    );
    if (!user) {
      return { ok: false, message: "Invalid credentials" };
    }
    setState((current) => ({
      ...current,
      session: { currentUserId: user.id },
    }));
    return { ok: true };
  }

  function register({ name, email, password }) {
    const normalized = email.trim().toLowerCase();
    if (state.users.some((user) => user.email === normalized)) {
      return { ok: false, message: "Email already registered" };
    }
    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: normalized,
      password,
    };
    setState((current) => ({
      ...current,
      users: [...current.users, user],
      session: { currentUserId: user.id },
    }));
    return { ok: true };
  }

  function logout() {
    setState((current) => ({
      ...current,
      session: { currentUserId: null },
    }));
  }

  function addGoal(goalInput) {
    const goal = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...goalInput,
    };
    setState((current) => ({
      ...current,
      goals: [goal, ...current.goals],
    }));
    return goal;
  }

  function addTask(taskInput) {
    const task = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      progress: Number(taskInput.progress || 0),
      plannedMinutesByDate: taskInput.plannedMinutesByDate || {},
      phases: taskInput.phases || {
        monthly: [],
        weekly: [],
        daily: [],
      },
      ...taskInput,
    };
    setState((current) => ({
      ...current,
      tasks: [task, ...current.tasks],
    }));
    return task;
  }

  function updateTask(taskId, updates) {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task,
      ),
    }));
  }

  function updateTaskSchedule(taskId, date, minutes) {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              plannedMinutesByDate: {
                ...(task.plannedMinutesByDate || {}),
                [date]: Number(minutes || 0),
              },
            }
          : task,
      ),
    }));
  }

  function addTaskPhase(taskId, level, title) {
    const phase = {
      id: crypto.randomUUID(),
      title,
      done: false,
    };
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              phases: {
                ...task.phases,
                [level]: [...(task.phases?.[level] || []), phase],
              },
            }
          : task,
      ),
    }));
  }

  function toggleTaskPhase(taskId, level, phaseId) {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              phases: {
                ...task.phases,
                [level]: (task.phases?.[level] || []).map((phase) =>
                  phase.id === phaseId ? { ...phase, done: !phase.done } : phase,
                ),
              },
            }
          : task,
      ),
    }));
  }

  function addNote(noteInput) {
    const note = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      ...noteInput,
    };
    setState((current) => ({
      ...current,
      notes: [note, ...current.notes],
    }));
  }

  function updateSettings(updates) {
    setState((current) => ({
      ...current,
      settings: {
        ...current.settings,
        ...updates,
      },
    }));
  }

  const derived = useMemo(() => {
    const weeklyTasks = getWeeklyTasks(state.tasks);
    const dailyTasks = getDailyTasks(state.tasks);
    return {
      allStats: computeTaskStats(state.tasks),
      weeklyStats: computeTaskStats(weeklyTasks),
      monthlyStats: computeTaskStats(getTasksForPeriod(state.tasks, "monthly")),
      yearlyStats: computeTaskStats(getTasksForPeriod(state.tasks, "yearly")),
      dailyTasks,
      weeklyTasks,
      goalSummaries: getGoalSummaries(state.goals, state.tasks),
      statusGroups: groupTasksByStatus(state.tasks),
      alerts: getPriorityAlerts(state.tasks),
      overdue: getOverdueTasks(state.tasks),
      recommendations: buildRecommendations(state.tasks, state.goals),
    };
  }, [state.goals, state.tasks]);

  const value = {
    state,
    setState,
    t,
    currentUser,
    isAuthenticated,
    setLanguage,
    login,
    register,
    logout,
    addGoal,
    addTask,
    updateTask,
    updateTaskSchedule,
    addTaskPhase,
    toggleTaskPhase,
    addNote,
    updateSettings,
    ...derived,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used inside AppProvider");
  }
  return context;
}
