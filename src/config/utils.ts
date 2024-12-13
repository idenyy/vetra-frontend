export function formatDate(date: Date) {
  const [, newDate] = new Date(date)
    .toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
    .split(', ');
  return newDate;
}
