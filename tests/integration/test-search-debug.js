/**
 * Debug test for categories
 */

import { Calendar } from '../../core/calendar/Calendar.js';
import { EventSearch } from '../../core/search/EventSearch.js';

console.log('Debugging categories...\n');

const calendar = new Calendar();

// Add a simple test event
calendar.addEvent({
    id: 'test-1',
    title: 'Test Meeting',
    start: new Date('2025-01-15T10:00:00'),
    end: new Date('2025-01-15T11:00:00'),
    category: 'meeting'  // Singular
});

// Get the event back
const events = calendar.getEvents();
console.log('Number of events:', events.length);

const event = events[0];
console.log('\nEvent properties:');
console.log('  event.category:', event.category);
console.log('  event.categories:', event.categories);
console.log('  typeof event.categories:', typeof event.categories);
console.log('  Array.isArray(event.categories):', Array.isArray(event.categories));

// Test search
const searchEngine = new EventSearch(calendar.eventStore);

console.log('\nFiltering by category "meeting":');
const filtered = searchEngine.filter({
    categories: ['meeting']
});
console.log('  Found:', filtered.length, 'events');

console.log('\nGetting unique values for "category":');
const uniqueCategories = searchEngine.getUniqueValues('category');
console.log('  Found categories:', uniqueCategories);

console.log('\nDirect event check:');
const allEvents = calendar.eventStore.getAllEvents();
console.log('  Total events in store:', allEvents.length);
if (allEvents.length > 0) {
    const firstEvent = allEvents[0];
    console.log('  First event category:', firstEvent.category);
    console.log('  First event categories:', firstEvent.categories);
}

process.exit(0);