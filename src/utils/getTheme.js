export const getTheme = (hour) => {
  if (hour >= 5 && hour < 8) return 'morning';   // 5 AM - 8 AM
  if (hour >= 8 && hour < 16) return 'afternoon'; // 8 AM - 4 PM
  if (hour >= 16 && hour < 19) return 'evening'; // 4 PM - 7 PM
  return 'night';                                 // 7 PM - 5 AM
};