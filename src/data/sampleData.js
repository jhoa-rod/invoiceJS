function day(offset) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
}

function timestamp(daysAgo) {
  return Date.now() - daysAgo * 24 * 60 * 60 * 1000;
}

export const seedState = {
  language: "en",
  session: {
    currentUserId: "user-demo",
  },
  users: [
    {
      id: "user-demo",
      name: "Alex Parker",
      email: "alex@example.com",
      password: "demo1234",
    },
  ],
  goals: [
    {
      id: "goal-english",
      title: "Learn English",
      description: "Improve speaking confidence and listening comprehension.",
      category: "Learning",
      horizon: "medium_term",
      importance: "high",
      createdAt: timestamp(21),
    },
    {
      id: "goal-app",
      title: "Launch a productivity app",
      description: "Ship a clean MVP with weekly planning, notes, and reports.",
      category: "Projects",
      horizon: "medium_term",
      importance: "high",
      createdAt: timestamp(18),
    },
    {
      id: "goal-routine",
      title: "Improve daily routine",
      description: "Protect focus time and create more consistent habits.",
      category: "Wellbeing",
      horizon: "short_term",
      importance: "medium",
      createdAt: timestamp(14),
    },
  ],
  tasks: [
    {
      id: "task-vocabulary",
      goalId: "goal-english",
      name: "Study vocabulary for 45 minutes",
      description: "Review 30 words and write example sentences.",
      priority: "high",
      status: "pending",
      dueDate: day(0),
      estimatedMinutes: 45,
      actualMinutes: 10,
      weeklyTargetMinutes: 150,
      plannedMinutesByDate: {
        [day(0)]: 45,
        [day(2)]: 35,
      },
      category: "Language",
      progress: 20,
      notes:
        "Focus on business phrases and conversation transitions.",
      phases: {
        monthly: [
          { id: "m1", title: "Complete 4 vocabulary themes", done: false },
        ],
        weekly: [
          { id: "w1", title: "Finish one business vocabulary block", done: false },
        ],
        daily: [
          { id: "d1", title: "Review 30 words today", done: false },
        ],
      },
      createdAt: timestamp(5),
    },
    {
      id: "task-speaking",
      goalId: "goal-english",
      name: "Speaking practice call",
      description: "Practice speaking for 20 minutes with a guided topic.",
      priority: "medium",
      status: "completed",
      dueDate: day(1),
      estimatedMinutes: 20,
      actualMinutes: 25,
      weeklyTargetMinutes: 60,
      plannedMinutesByDate: {
        [day(1)]: 20,
      },
      category: "Language",
      progress: 100,
      notes: "Record key mistakes and review them tomorrow.",
      phases: {
        monthly: [{ id: "m2", title: "Complete 4 speaking sessions", done: true }],
        weekly: [{ id: "w2", title: "Book two sessions this week", done: true }],
        daily: [{ id: "d2", title: "Speak for 20 minutes", done: true }],
      },
      createdAt: timestamp(4),
    },
    {
      id: "task-dashboard",
      goalId: "goal-app",
      name: "Design dashboard layout",
      description: "Create a cleaner dashboard with stronger weekly progress cues.",
      priority: "high",
      status: "in_progress",
      dueDate: day(0),
      estimatedMinutes: 120,
      actualMinutes: 70,
      weeklyTargetMinutes: 240,
      plannedMinutesByDate: {
        [day(0)]: 90,
        [day(1)]: 30,
      },
      category: "Design",
      progress: 58,
      notes: "Keep the dashboard useful without feeling crowded.",
      phases: {
        monthly: [{ id: "m3", title: "Finish the first complete UX revision", done: false }],
        weekly: [{ id: "w3", title: "Redesign navigation and summary cards", done: false }],
        daily: [{ id: "d3", title: "Ship the new dashboard shell", done: false }],
      },
      createdAt: timestamp(3),
    },
    {
      id: "task-components",
      goalId: "goal-app",
      name: "Build reusable task detail components",
      description: "Create cards for metrics, planning levels, and notes.",
      priority: "medium",
      status: "pending",
      dueDate: day(3),
      estimatedMinutes: 150,
      actualMinutes: 0,
      weeklyTargetMinutes: 180,
      plannedMinutesByDate: {
        [day(3)]: 75,
        [day(4)]: 75,
      },
      category: "Development",
      progress: 0,
      notes: "Aim for mobile-friendly composition.",
      phases: {
        monthly: [{ id: "m4", title: "Define the design system pieces", done: false }],
        weekly: [{ id: "w4", title: "Create 3 reusable detail components", done: false }],
        daily: [{ id: "d4", title: "Implement progress and summary cards", done: false }],
      },
      createdAt: timestamp(2),
    },
    {
      id: "task-routine",
      goalId: "goal-routine",
      name: "Plan tomorrow before 9 PM",
      description: "Choose the top 3 priorities and estimate effort.",
      priority: "low",
      status: "completed",
      dueDate: day(0),
      estimatedMinutes: 15,
      actualMinutes: 15,
      weeklyTargetMinutes: 90,
      plannedMinutesByDate: {
        [day(0)]: 15,
      },
      category: "Routine",
      progress: 100,
      notes: "Keep tomorrow realistic.",
      phases: {
        monthly: [{ id: "m5", title: "Keep 4 weeks of nightly planning", done: false }],
        weekly: [{ id: "w5", title: "Plan five evenings this week", done: false }],
        daily: [{ id: "d5", title: "Decide tomorrow's top 3 tasks", done: true }],
      },
      createdAt: timestamp(1),
    },
  ],
  notes: [
    {
      id: "note-1",
      title: "Speaking friction",
      content: "I still hesitate when I switch from reading to free speaking.",
      type: "complication",
      relatedGoalId: "goal-english",
      relatedTaskId: "task-speaking",
      createdAt: timestamp(2),
    },
    {
      id: "note-2",
      title: "UI reminder",
      content: "Keep the navigation clean and move language selection into settings.",
      type: "reminder",
      relatedGoalId: "goal-app",
      createdAt: timestamp(1),
    },
  ],
  settings: {
    preferredSummary: "weekly",
  },
};
