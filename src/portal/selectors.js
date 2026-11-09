import { coaches, demoPeople, groups, locations } from './demoData';

export const programmeName = (id, programmes) => programmes.find((item) => item.id === id)?.name || 'Unassigned programme';
export const programmeAccent = (id, programmes) => programmes.find((item) => item.id === id)?.accent || 'lemon';
export const coachName = (id) => coaches.find((item) => item.id === id)?.name || 'Unassigned coach';
export const groupName = (id) => groups.find((item) => item.id === id)?.name || 'All groups';
export const locationName = (id) => locations.find((item) => item.id === id)?.name || 'Location to confirm';
export const guardianName = (id, guardians = demoPeople.guardians) => guardians.find((item) => item.id === id)?.name || 'Guardian to confirm';
export const playerName = (id) => demoPeople.players.find((item) => item.id === id)?.name || 'Player';

export const weekStart = (value) => {
  const date = new Date(`${value}T12:00:00`);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  return date;
};
export const dateKey = (date) => new Date(date).toISOString().slice(0, 10);
export const addDays = (date, days) => { const result = new Date(date); result.setDate(result.getDate() + days); return result; };
export const addMonths = (date, months) => { const result = new Date(date); result.setDate(1); result.setMonth(result.getMonth() + months); return result; };
