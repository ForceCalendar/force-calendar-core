/**
 * Test Search and Filter functionality
 */

import { Calendar } from '../../core/calendar/Calendar.js';
import { EventSearch } from '../../core/search/EventSearch.js';

console.log('Testing Search and Filter functionality...\n');

// Create calendar with diverse test events
const calendar = new Calendar();

// Add test events with various properties
const testEvents = [
    {
        id: 'meeting-1',
        title: 'Product Planning Meeting',
        description: 'Quarterly product roadmap discussion',
        start: new Date('2025-01-15T10:00:00'),
        end: new Date('2025-01-15T11:30:00'),
        location: 'Conference Room A',
        category: 'meeting',
        attendees: [
            { email: 'john@company.com', name: 'John Smith' },
            { email: 'sarah@company.com', name: 'Sarah Johnson' }
        ]
    },
    {
        id: 'meeting-2',
        title: 'Team Standup',
        description: 'Daily sync with the engineering team',
        start: new Date('2025-01-16T09:00:00'),
        end: new Date('2025-01-16T09:15:00'),
        location: 'Zoom',
        category: 'meeting',
        attendees: [
            { email: 'dev-team@company.com', name: 'Dev Team' }
        ],
        recurrence: 'FREQ=DAILY;COUNT=5'
    },
    {
        id: 'workshop-1',
        title: 'JavaScript Workshop',
        description: 'Advanced JavaScript patterns and best practices',
        start: new Date('2025-01-20T09:00:00'),
        end: new Date('2025-01-20T17:00:00'),
        location: 'Training Room',
        category: 'training',
        attendees: [
            { email: 'instructor@training.com', name: 'Instructor' },
            { email: 'students@company.com', name: 'Students' }
        ]
    },
    {
        id: 'holiday-1',
        title: 'Australia Day',
        description: 'National holiday',
        start: new Date('2025-01-26'),
        allDay: true,
        category: 'holiday'
    },
    {
        id: 'deadline-1',
        title: 'Project Deadline',
        description: 'Final submission for Q1 project',
        start: new Date('2025-01-31T23:59:00'),
        category: 'deadline',
        reminders: [
            { method: 'popup', minutesBefore: 1440 }, // 1 day before
            { method: 'popup', minutesBefore: 60 }    // 1 hour before
        ]
    },
    {
        id: 'social-1',
        title: 'Team Lunch',
        description: 'Monthly team gathering at Italian restaurant',
        start: new Date('2025-01-25T12:00:00'),
        end: new Date('2025-01-25T14:00:00'),
        location: 'Mario\'s Restaurant',
        category: 'social',
        attendees: [
            { email: 'team@company.com', name: 'Whole Team' }
        ]
    }
];

// Add all test events
testEvents.forEach(event => calendar.addEvent(event));
console.log(`✅ Created calendar with ${testEvents.length} test events\n`);

// Create search engine
const searchEngine = new EventSearch(calendar.eventStore);

// Test 1: Text search
console.log('=== Test 1: Text Search ===');
console.log('Searching for "meeting"...');
let results = searchEngine.search('meeting', {
    fields: ['title', 'description'],
    fuzzy: false
});
console.log(`Found ${results.length} results:`);
results.forEach(event => {
    console.log(`  - ${event.title}`);
});

// Test 2: Fuzzy search
console.log('\n=== Test 2: Fuzzy Search ===');
console.log('Searching for "meetting" (typo) with fuzzy matching...');
results = searchEngine.search('meetting', {
    fields: ['title'],
    fuzzy: true
});
console.log(`Found ${results.length} results with fuzzy matching:`);
results.forEach(event => {
    console.log(`  - ${event.title}`);
});

// Test 3: Category filter
console.log('\n=== Test 3: Category Filter ===');
console.log('Filtering by category: meeting...');
results = searchEngine.filter({
    categories: ['meeting']
});
console.log(`Found ${results.length} meetings:`);
results.forEach(event => {
    console.log(`  - ${event.title} (${event.category})`);
});

// Test 4: Date range filter
console.log('\n=== Test 4: Date Range Filter ===');
console.log('Filtering events from Jan 15-20, 2025...');
results = searchEngine.filter({
    dateRange: {
        start: new Date('2025-01-15'),
        end: new Date('2025-01-20T23:59:59')
    }
});
console.log(`Found ${results.length} events in date range:`);
results.forEach(event => {
    console.log(`  - ${event.title} (${event.start.toLocaleDateString()})`);
});

// Test 5: All-day events filter
console.log('\n=== Test 5: All-Day Events Filter ===');
console.log('Filtering for all-day events...');
results = searchEngine.filter({
    allDay: true
});
console.log(`Found ${results.length} all-day events:`);
results.forEach(event => {
    console.log(`  - ${event.title}`);
});

// Test 6: Events with reminders
console.log('\n=== Test 6: Events with Reminders ===');
console.log('Filtering for events with reminders...');
results = searchEngine.filter({
    hasReminders: true
});
console.log(`Found ${results.length} events with reminders:`);
results.forEach(event => {
    console.log(`  - ${event.title} (${event.reminders.length} reminders)`);
});

// Test 7: Attendee filter
console.log('\n=== Test 7: Attendee Filter ===');
console.log('Filtering for events with john@company.com...');
results = searchEngine.filter({
    attendees: ['john@company.com']
});
console.log(`Found ${results.length} events with John:`);
results.forEach(event => {
    console.log(`  - ${event.title}`);
});

// Test 8: Advanced search (text + filters)
console.log('\n=== Test 8: Advanced Search ===');
console.log('Searching for "team" in meetings category...');
results = searchEngine.advancedSearch('team', {
    categories: ['meeting', 'social']
});
console.log(`Found ${results.length} results:`);
results.forEach(event => {
    console.log(`  - ${event.title} (${event.category})`);
});

// Test 9: Get suggestions
console.log('\n=== Test 9: Autocomplete Suggestions ===');
console.log('Getting suggestions for "pro"...');
const suggestions = searchEngine.getSuggestions('pro', {
    field: 'title',
    limit: 5
});
console.log(`Found ${suggestions.length} suggestions:`);
suggestions.forEach(suggestion => {
    console.log(`  - ${suggestion}`);
});

// Test 10: Get unique values
console.log('\n=== Test 10: Unique Values ===');
console.log('Getting all unique categories...');
const categories = searchEngine.getUniqueValues('category');
console.log(`Found ${categories.length} categories:`);
categories.forEach(cat => {
    console.log(`  - ${cat}`);
});

// Test 11: Group by category
console.log('\n=== Test 11: Group By Category ===');
console.log('Grouping events by category...');
const grouped = searchEngine.groupBy('category', {
    sortGroups: true,
    sortEvents: true
});
for (const [category, events] of Object.entries(grouped)) {
    console.log(`${category}: ${events.length} events`);
    events.forEach(event => {
        console.log(`  - ${event.title}`);
    });
}

// Test 12: Location filter
console.log('\n=== Test 12: Location Filter ===');
console.log('Filtering by location containing "Room"...');
results = searchEngine.filter({
    custom: (event) => event.location && event.location.includes('Room')
});
console.log(`Found ${results.length} events in rooms:`);
results.forEach(event => {
    console.log(`  - ${event.title} @ ${event.location}`);
});

// Test 13: Recurring events
console.log('\n=== Test 13: Recurring Events Filter ===');
console.log('Filtering for recurring events...');
results = searchEngine.filter({
    recurring: true
});
console.log(`Found ${results.length} recurring events:`);
results.forEach(event => {
    console.log(`  - ${event.title} (${event.recurrence})`);
});

console.log('\n✅ Search and Filter functionality test complete!');process.exit(0);
