export function formatDate(date: Date | string, format: 'full' | 'weekday' | 'day' = 'full') {
  const d = new Date(date);
  
  switch (format) {
    case 'weekday':
      return d.toLocaleDateString('fr-FR', { weekday: 'short' });
    case 'day':
      return d.toLocaleDateString('fr-FR', { day: 'numeric' });
    default:
      return d.toLocaleDateString('fr-FR', { 
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
  }
}