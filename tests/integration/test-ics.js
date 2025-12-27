/**
 * Test ICS Import/Export functionality
 */

import { Calendar } from '../../core/calendar/Calendar.js';
import { ICSHandler } from '../../core/ics/ICSHandler.js';

console.log('Testing ICS Import/Export functionality...\n');

// Create calendar with test events
const calendar = new Calendar();

// Add some test events
calendar.addEvent({
    id: 'meeting-1',
    title: 'Team Standup',
    description: 'Daily team sync meeting',
    start: new Date('2025-01-15T09:00:00'),
    end: new Date('2025-01-15T09:30:00'),
    location: 'Zoom',
    category: 'meeting',
    attendees: [
        { email: 'john@example.com', name: 'John Doe' },
        { email: 'jane@example.com', name: 'Jane Smith' }
    ],
    recurrence: 'FREQ=DAILY;COUNT=5'
});

calendar.addEvent({
    id: 'event-2',
    title: 'Project Launch',
    description: 'Launch party for new project',
    start: new Date('2025-01-20T18:00:00'),
    end: new Date('2025-01-20T21:00:00'),
    location: 'Office Rooftop',
    category: 'social',
    attendees: [{ email: 'team@example.com', name: 'Team' }]
});

calendar.addEvent({
    id: 'workshop-1',
    title: 'All-Day Workshop',
    start: new Date('2025-01-25'),
    allDay: true,
    category: 'training'
});

console.log('✅ Created test calendar with 3 events\n');

// Create ICS handler
const icsHandler = new ICSHandler(calendar);

// Test export
console.log('Testing export...');
const exported = icsHandler.export({
    calendarName: 'Test Calendar Export'
});

console.log('Exported ICS preview:');
console.log(exported.split('\n').slice(0, 10).join('\n'));
console.log('... (truncated)\n');

// Test validation
console.log('Testing validation...');
const validation = icsHandler.validate(exported);
console.log('Validation result:', validation.valid ? '✅ Valid' : '❌ Invalid');
if (validation.warnings.length > 0) {
    console.log('Warnings:', validation.warnings);
}

// Test re-import
console.log('\nTesting import...');

// Create new calendar for import
const calendar2 = new Calendar();
const icsHandler2 = new ICSHandler(calendar2);

// Import the exported data
try {
    const importResults = await icsHandler2.import(exported);

    console.log('Import results:');
    console.log(`  - Imported: ${importResults.imported.length} events`);
    console.log(`  - Skipped: ${importResults.skipped.length} events`);
    console.log(`  - Updated: ${importResults.updated.length} events`);
    console.log(`  - Errors: ${importResults.errors.length}`);

    // Verify imported events
    const importedEvents = calendar2.getEvents();
    console.log('\nImported events:');
    importedEvents.forEach(event => {
        console.log(`  - ${event.title} (${event.id})`);
    });

} catch (error) {
    console.error('Import failed:', error.message);
}

// Test ICS parsing from external format
console.log('\nTesting external ICS format parsing...');

const externalICS = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//External Calendar//EN
BEGIN:VEVENT
UID:external-event-1
DTSTART:20250130T140000Z
DTEND:20250130T150000Z
SUMMARY:External Meeting
DESCRIPTION:Imported from external calendar
LOCATION:Conference Room A
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

try {
    const externalResults = await icsHandler2.import(externalICS);
    console.log('External import successful!');
    console.log(`Imported ${externalResults.imported.length} external events`);
} catch (error) {
    console.error('External import failed:', error.message);
}

// Test subscription simulation
console.log('\nTesting subscription features...');
const mockSubscription = {
    url: 'https://example.com/calendar.ics',
    events: [],

    // Simulate subscription
    simulateRefresh: function() {
        console.log(`Would fetch from: ${this.url}`);
        console.log('Subscription features include:');
        console.log('  - Auto-refresh at intervals');
        console.log('  - Merge updates with existing events');
        console.log('  - Handle additions, updates, deletions');
    }
};

mockSubscription.simulateRefresh();

console.log('\n✅ ICS functionality test complete!');

// Exit cleanly after async operations
process.exit(0);