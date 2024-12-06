import { create } from 'zustand';

interface Reminder {
  id: string;
  date: Date;
  text: string;
}

interface ReminderStore {
  reminders: Reminder[];
  addReminder: (reminder: Reminder) => void;
  removeReminder: (id: string) => void;
}

export const useReminderStore = create<ReminderStore>((set) => ({
  reminders: [],
  addReminder: (reminder) =>
    set((state) => ({
      reminders: [...state.reminders, reminder],
    })),
  removeReminder: (id) =>
    set((state) => ({
      reminders: state.reminders.filter((reminder) => reminder.id !== id),
    })),
}));