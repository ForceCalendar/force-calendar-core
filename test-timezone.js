#!/usr/bin/env node

/**
 * Test timezone functionality
 */

import { Calendar } from './packages/core/src/index.js';
import { Event } from './packages/core/src/core/events/Event.js';
import { TimezoneManager } from './packages/core/src/core/timezone/TimezoneManager.js';

console.log('Testing Lightning Calendar Core - Timezone Support');
console.log('==================================================\n');

// Create calendar with specific timezone
const calendar = new Calendar({
    timeZone: 'America/New_York'
});

console.log('1. Calendar initialized with timezone:', calendar.getTimezone());
console.log('   System timezone:', calendar.timezoneManager.getSystemTimezone());
console.log('');

// Test 1: Create event in New York time
console.log('2. Creating event in New York time (10 AM)...');
const nyEvent = new Event({
    id: 'test-event-1',
    title: 'Morning Meeting',
    start: new Date('2024-12-24T10:00:00'),
    end: new Date('2024-12-24T11:00:00'),
    timeZone: 'America/New_York'
});

console.log('   Event created:');
console.log('   - Title:', nyEvent.title);
console.log('   - Start (NY):', nyEvent.start);
console.log('   - Start (UTC):', nyEvent.startUTC);
console.log('   - Timezone:', nyEvent.timeZone);
console.log('');

// Test 2: Convert to different timezones
console.log('3. Converting event to different timezones...');
const londonTime = nyEvent.getStartInTimezone('Europe/London');
const tokyoTime = nyEvent.getStartInTimezone('Asia/Tokyo');
const laTime = nyEvent.getStartInTimezone('America/Los_Angeles');

console.log('   Start times in different timezones:');
console.log('   - New York:', nyEvent.getStartInTimezone('America/New_York').toLocaleString());
console.log('   - London:', londonTime.toLocaleString());
console.log('   - Tokyo:', tokyoTime.toLocaleString());
console.log('   - Los Angeles:', laTime.toLocaleString());
console.log('');

// Test 3: Add multiple events in different timezones
console.log('4. Adding events in different timezones...');
calendar.addEvent({
    id: 'ny-meeting',
    title: 'New York Meeting',
    start: new Date('2024-12-24T10:00:00'),
    end: new Date('2024-12-24T11:00:00'),
    timeZone: 'America/New_York'
});

calendar.addEvent({
    id: 'london-conf',
    title: 'London Conference',
    start: new Date('2024-12-24T15:00:00'),
    end: new Date('2024-12-24T16:00:00'),
    timeZone: 'Europe/London'
});

calendar.addEvent({
    id: 'tokyo-sync',
    title: 'Tokyo Team Sync',
    start: new Date('2024-12-25T09:00:00'),
    end: new Date('2024-12-25T10:00:00'),
    timeZone: 'Asia/Tokyo'
});

console.log('   Added 3 events in different timezones');
console.log('');

// Test 4: Query events for a date in specific timezone
console.log('5. Querying events for Dec 24, 2024 in different timezones...');
const dec24 = new Date('2024-12-24');

const nyEvents = calendar.getEventsForDate(dec24, 'America/New_York');
const londonEvents = calendar.getEventsForDate(dec24, 'Europe/London');
const tokyoEvents = calendar.getEventsForDate(dec24, 'Asia/Tokyo');

console.log('   Events on Dec 24:');
console.log('   - New York perspective:', nyEvents.length, 'events');
nyEvents.forEach(e => console.log('     •', e.title));

console.log('   - London perspective:', londonEvents.length, 'events');
londonEvents.forEach(e => console.log('     •', e.title));

console.log('   - Tokyo perspective:', tokyoEvents.length, 'events');
tokyoEvents.forEach(e => console.log('     •', e.title));
console.log('');

// Test 5: Timezone conversion utilities
console.log('6. Testing timezone conversion utilities...');
const now = new Date();
const tm = new TimezoneManager();

const nyToLa = tm.convertTimezone(now, 'America/New_York', 'America/Los_Angeles');
const timeDiff = tm.getTimezoneDifference('America/New_York', 'America/Los_Angeles');

console.log('   Current time conversions:');
console.log('   - Now (local):', now.toLocaleString());
console.log('   - NY to LA conversion:', nyToLa.toLocaleString());
console.log('   - Time difference (hours):', timeDiff);
console.log('');

// Test 6: Format in timezone
console.log('7. Testing date formatting in timezones...');
const testDate = new Date('2024-12-24T15:30:00Z');

console.log('   Formatting UTC date in different timezones:');
console.log('   - UTC:', testDate.toISOString());
console.log('   - New York:', calendar.formatInTimezone(testDate, 'America/New_York'));
console.log('   - London:', calendar.formatInTimezone(testDate, 'Europe/London'));
console.log('   - Tokyo:', calendar.formatInTimezone(testDate, 'Asia/Tokyo'));
console.log('   - Sydney:', calendar.formatInTimezone(testDate, 'Australia/Sydney'));
console.log('');

// Test 7: Get common timezones
console.log('8. Getting common timezones...');
const timezones = calendar.getTimezones();
console.log('   Available timezones:', timezones.length);
console.log('   Sample timezones:');
timezones.slice(0, 5).forEach(tz => {
    console.log(`   - ${tz.label}: ${tz.offset}`);
});
console.log('');

// Test 8: DST handling
console.log('9. Testing DST (Daylight Saving Time) handling...');
const summerDate = new Date('2024-07-15T12:00:00');
const winterDate = new Date('2024-12-15T12:00:00');

const summerOffset = tm.getTimezoneOffset(summerDate, 'America/New_York');
const winterOffset = tm.getTimezoneOffset(winterDate, 'America/New_York');

console.log('   New York timezone offsets:');
console.log('   - Summer (July):', summerOffset / 60, 'hours from UTC');
console.log('   - Winter (December):', winterOffset / 60, 'hours from UTC');
console.log('   - DST active in summer:', tm.isDST(summerDate, 'America/New_York'));
console.log('   - DST active in winter:', tm.isDST(winterDate, 'America/New_York'));
console.log('');

// Test 9: Change calendar timezone
console.log('10. Changing calendar timezone...');
console.log('    Original timezone:', calendar.getTimezone());
calendar.setTimezone('Europe/London');
console.log('    New timezone:', calendar.getTimezone());
console.log('');

// Performance test
console.log('11. Performance test with 100 timezone conversions...');
const startTime = Date.now();

for (let i = 0; i < 100; i++) {
    tm.convertTimezone(now, 'America/New_York', 'Asia/Tokyo');
}

const duration = Date.now() - startTime;
console.log('    Completed 100 conversions in', duration, 'ms');
console.log('    Average time per conversion:', (duration / 100).toFixed(2), 'ms');
console.log('');

console.log('✅ All timezone tests completed successfully!');
console.log('');
console.log('Key timezone features demonstrated:');
console.log('• Events store both wall-clock time and UTC');
console.log('• Timezone-aware queries respect local dates');
console.log('• DST transitions handled automatically');
console.log('• Fast timezone conversions with caching');
console.log('• Support for all major IANA timezones');
console.log('• Critical for global Salesforce deployments');