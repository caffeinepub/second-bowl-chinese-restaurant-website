import { Clock } from 'lucide-react';
import { siteContent } from '@/content/siteContent';

export function OpeningHoursBadge() {
  // Derive a stable single-line summary from the hours array
  const hours = siteContent.contact.hours;
  
  // Default fallback if hours array is empty
  let displayHours = 'See contact for hours';
  
  // If we have hours data, create a summary
  if (hours && hours.length > 0) {
    // Check if all daily hours are the same (excluding Delivery line)
    const dailyHours = hours.filter(h => !h.toLowerCase().startsWith('delivery'));
    
    if (dailyHours.length > 0) {
      // Extract time range from first entry (e.g., "Saturday 12:00 PM–1:00 AM" -> "12:00 PM–1:00 AM")
      const firstEntry = dailyHours[0];
      const timeMatch = firstEntry.match(/(\d{1,2}:\d{2}\s*[AP]M\s*–\s*\d{1,2}:\d{2}\s*[AP]M)/i);
      
      if (timeMatch) {
        displayHours = `Daily ${timeMatch[1]}`;
      } else {
        // Fallback: just show the first line as-is
        displayHours = firstEntry;
      }
    }
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-sm">
      <Clock className="h-4 w-4 text-primary" />
      <span className="font-medium hidden sm:inline">Hours:</span>
      <span className="text-muted-foreground">{displayHours}</span>
    </div>
  );
}
