/**
 * Lightning Calendar Core - Enterprise Demo
 * Showcasing all enhanced core features
 */

import { Calendar } from '../packages/core/src/core/calendar/Calendar.js';
import { EventStore } from '../packages/core/src/core/events/EventStore.js';
import { ConflictDetector } from '../packages/core/src/core/conflicts/ConflictDetector.js';

class CalendarDemo {
    constructor() {
        this.calendar = null;
        this.eventStore = null;
        this.conflictDetector = null;
        this.currentView = 'month';
        this.selectedEvent = null;
        this.eventIdCounter = 1000;

        this.init();
    }

    init() {
        // Initialize calendar with enhanced configuration
        this.calendar = new Calendar({
            view: 'month',
            date: new Date(),
            weekStartsOn: 0,
            businessHours: { start: '09:00', end: '17:00' }
        });

        // Get the event store and conflict detector
        this.eventStore = this.calendar.eventStore;
        this.conflictDetector = new ConflictDetector(this.eventStore);

        // Set up event listeners
        this.setupEventListeners();

        // Load initial sample data
        this.loadSampleEvents();

        // Render initial view
        this.render();

        // Update statistics
        this.updateStatistics();

        // Start performance monitoring
        this.startPerformanceMonitoring();
    }

    setupEventListeners() {
        // View buttons
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.btn-view').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentView = e.target.dataset.view;
                this.calendar.setView(this.currentView);
                this.render();
            });
        });

        // Navigation buttons
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.calendar.previous();
            this.render();
        });

        document.getElementById('todayBtn').addEventListener('click', () => {
            this.calendar.today();
            this.render();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.calendar.next();
            this.render();
        });

        // Action buttons
        document.getElementById('addEventBtn').addEventListener('click', () => {
            this.addRandomEvent();
        });

        document.getElementById('detectConflictsBtn').addEventListener('click', () => {
            this.detectAndShowConflicts();
        });

        document.getElementById('loadSampleBtn').addEventListener('click', () => {
            this.loadSampleEvents();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.eventStore.clear();
            this.render();
            this.updateStatistics();
            this.updateConflictInfo([]);
        });

        // Calendar events
        this.calendar.on('eventAdd', () => {
            this.render();
            this.updateStatistics();
        });

        this.calendar.on('eventUpdate', () => {
            this.render();
            this.updateStatistics();
        });

        this.calendar.on('eventRemove', () => {
            this.render();
            this.updateStatistics();
        });
    }

    loadSampleEvents() {
        // Clear existing events
        this.eventStore.clear();

        const today = new Date();
        const events = [];

        // Meeting with attendees and reminders
        events.push({
            id: `event-${++this.eventIdCounter}`,
            title: 'Quarterly Business Review',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 0),
            description: 'Review Q4 performance and plan for next quarter',
            location: 'Conference Room A',
            organizer: {
                name: 'Sarah Johnson',
                email: 'sarah.johnson@company.com'
            },
            attendees: [
                { name: 'John Smith', email: 'john.smith@company.com', responseStatus: 'accepted' },
                { name: 'Emily Davis', email: 'emily.davis@company.com', responseStatus: 'tentative' },
                { name: 'Michael Chen', email: 'michael.chen@company.com', responseStatus: 'accepted' },
                { name: 'Conference Room A', email: 'room-a@company.com', resource: true }
            ],
            reminders: [
                { method: 'email', minutesBefore: 15 },
                { method: 'popup', minutesBefore: 5 }
            ],
            categories: ['meeting', 'important'],
            status: 'confirmed'
        });

        // Recurring daily standup
        events.push({
            id: `event-${++this.eventIdCounter}`,
            title: 'Daily Standup',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 15),
            recurring: true,
            recurrenceRule: {
                freq: 'DAILY',
                byDay: ['MO', 'TU', 'WE', 'TH', 'FR']
            },
            attendees: [
                { name: 'Dev Team', email: 'dev-team@company.com', responseStatus: 'accepted' }
            ],
            categories: ['recurring', 'team'],
            status: 'confirmed'
        });

        // Workshop with resource conflict potential
        events.push({
            id: `event-${++this.eventIdCounter}`,
            title: 'Product Workshop',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 14, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 16, 0),
            location: 'Conference Room A',
            attendees: [
                { name: 'Product Team', email: 'product@company.com' },
                { name: 'Conference Room A', email: 'room-a@company.com', resource: true }
            ],
            categories: ['workshop'],
            status: 'confirmed'
        });

        // Conflicting event (same room)
        events.push({
            id: `event-${++this.eventIdCounter}`,
            title: 'Client Presentation',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 15, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 2, 17, 0),
            location: 'Conference Room A',
            attendees: [
                { name: 'Sales Team', email: 'sales@company.com' },
                { name: 'Conference Room A', email: 'room-a@company.com', resource: true }
            ],
            categories: ['client', 'important'],
            status: 'tentative'
        });

        // Training with categories
        events.push({
            id: `event-${++this.eventIdCounter}`,
            title: 'Security Compliance Training',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 13, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5, 15, 0),
            description: 'Annual security compliance training for all employees',
            categories: ['training', 'compliance', 'mandatory'],
            attendees: [
                { name: 'All Staff', email: 'all@company.com' }
            ],
            reminders: [
                { method: 'email', minutesBefore: 1440 }, // 1 day before
                { method: 'email', minutesBefore: 60 }    // 1 hour before
            ],
            status: 'confirmed'
        });

        // One-on-one meeting
        events.push({
            id: `event-${++this.eventIdCounter}`,
            title: '1:1 with Manager',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 11, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3, 11, 30),
            attendees: [
                { name: 'You', email: 'you@company.com', responseStatus: 'accepted' },
                { name: 'Manager', email: 'manager@company.com', responseStatus: 'accepted' }
            ],
            categories: ['1on1', 'recurring'],
            status: 'confirmed'
        });

        // All-day event
        events.push({
            id: `event-${++this.eventIdCounter}`,
            title: 'Company Holiday',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10),
            allDay: true,
            categories: ['holiday'],
            status: 'confirmed'
        });

        // Virtual meeting with conference data
        events.push({
            id: `event-${++this.eventIdCounter}`,
            title: 'Remote Team Sync',
            start: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 15, 0),
            end: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 4, 16, 0),
            conferenceData: {
                solution: 'zoom',
                url: 'https://zoom.us/j/123456789',
                accessCode: '123456',
                password: 'abc123'
            },
            attendees: [
                { name: 'Remote Team', email: 'remote@company.com' }
            ],
            categories: ['meeting', 'virtual'],
            status: 'confirmed'
        });

        // Add all events
        events.forEach(event => this.eventStore.addEvent(event));

        // Render and update UI
        this.render();
        this.updateStatistics();
        this.detectAndShowConflicts();
    }

    addRandomEvent() {
        const titles = [
            'Strategy Meeting', 'Code Review', 'Customer Call', 'Team Lunch',
            'Project Planning', 'Sprint Review', 'Training Session', 'Interview'
        ];

        const locations = [
            'Conference Room A', 'Conference Room B', 'Virtual', 'Cafeteria', 'Office'
        ];

        const attendees = [
            { name: 'Alice Johnson', email: 'alice@company.com' },
            { name: 'Bob Smith', email: 'bob@company.com' },
            { name: 'Carol White', email: 'carol@company.com' },
            { name: 'David Brown', email: 'david@company.com' }
        ];

        const today = new Date();
        const daysOffset = Math.floor(Math.random() * 14) - 7; // -7 to +7 days
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() + daysOffset);

        const hour = 9 + Math.floor(Math.random() * 8); // 9 AM to 5 PM
        startDate.setHours(hour, Math.random() < 0.5 ? 0 : 30, 0, 0);

        const duration = (0.5 + Math.random() * 1.5) * 60 * 60 * 1000; // 30-120 minutes
        const endDate = new Date(startDate.getTime() + duration);

        // Randomly select attendees
        const eventAttendees = [];
        const numAttendees = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < numAttendees; i++) {
            const attendee = { ...attendees[Math.floor(Math.random() * attendees.length)] };
            attendee.responseStatus = ['accepted', 'tentative', 'declined'][Math.floor(Math.random() * 3)];
            eventAttendees.push(attendee);
        }

        const event = {
            id: `event-${++this.eventIdCounter}`,
            title: titles[Math.floor(Math.random() * titles.length)],
            start: startDate,
            end: endDate,
            location: locations[Math.floor(Math.random() * locations.length)],
            attendees: eventAttendees,
            categories: ['generated'],
            status: ['confirmed', 'tentative'][Math.floor(Math.random() * 2)],
            reminders: Math.random() < 0.5 ? [{ method: 'email', minutesBefore: 15 }] : []
        };

        // Check for conflicts before adding
        const conflicts = this.conflictDetector.checkConflicts(event);
        if (conflicts.hasConflicts) {
            const proceed = confirm(`This event has ${conflicts.totalConflicts} conflict(s). Add anyway?`);
            if (!proceed) return;
        }

        this.eventStore.addEvent(event);
        this.detectAndShowConflicts();
    }

    detectAndShowConflicts() {
        const events = this.eventStore.getAllEvents();
        const allConflicts = [];

        events.forEach(event => {
            const conflicts = this.conflictDetector.checkConflicts(event);
            if (conflicts.hasConflicts) {
                allConflicts.push(...conflicts.conflicts.map(c => ({
                    ...c,
                    eventTitle: event.title
                })));
            }
        });

        this.updateConflictInfo(allConflicts);
    }

    updateConflictInfo(conflicts) {
        const conflictInfo = document.getElementById('conflictInfo');

        if (conflicts.length === 0) {
            conflictInfo.innerHTML = '<p class="empty-state">No conflicts detected</p>';
            return;
        }

        const conflictsHTML = conflicts.map(conflict => `
            <div class="conflict-item">
                <div class="conflict-type">${conflict.type} Conflict</div>
                <div class="conflict-description">${conflict.description}</div>
                <span class="conflict-severity severity-${conflict.severity}">${conflict.severity}</span>
            </div>
        `).join('');

        conflictInfo.innerHTML = conflictsHTML;
    }

    updateStatistics() {
        const stats = this.eventStore.getStats();
        const events = this.eventStore.getAllEvents();

        // Update basic stats
        document.getElementById('totalEvents').textContent = stats.totalEvents;
        document.getElementById('recurringEvents').textContent = stats.byRecurring.recurring || 0;

        // Count events with attendees
        const withAttendees = events.filter(e => e.attendees && e.attendees.length > 0).length;
        document.getElementById('attendeeEvents').textContent = withAttendees;

        // Update cache hit rate
        const cacheStats = this.eventStore.optimizer?.getCacheStats();
        if (cacheStats) {
            const hitRate = cacheStats.eventCache.hits + cacheStats.eventCache.misses > 0
                ? Math.round((cacheStats.eventCache.hits / (cacheStats.eventCache.hits + cacheStats.eventCache.misses)) * 100)
                : 0;
            document.getElementById('cacheHitRate').textContent = `${hitRate}%`;

            // Update cache metrics
            document.getElementById('cacheHits').textContent = cacheStats.eventCache.hits;
            document.getElementById('cacheMisses').textContent = cacheStats.eventCache.misses;
            document.getElementById('cacheEvictions').textContent = cacheStats.eventCache.evictions;
        }
    }

    startPerformanceMonitoring() {
        // Measure and display operation timings
        setInterval(() => {
            this.measurePerformance();
        }, 5000); // Update every 5 seconds
    }

    measurePerformance() {
        // Measure add operation
        const testEvent = {
            id: `perf-test-${Date.now()}`,
            title: 'Performance Test',
            start: new Date(),
            end: new Date(Date.now() + 3600000)
        };

        const addStart = performance.now();
        this.eventStore.addEvent(testEvent);
        const addTime = performance.now() - addStart;
        document.getElementById('addTiming').textContent = `${addTime.toFixed(2)}ms`;

        // Measure query operation
        const queryStart = performance.now();
        this.eventStore.getEventsInRange(new Date(), new Date(Date.now() + 86400000 * 30));
        const queryTime = performance.now() - queryStart;
        document.getElementById('queryTiming').textContent = `${queryTime.toFixed(2)}ms`;

        // Measure conflict check
        const conflictStart = performance.now();
        this.conflictDetector.checkConflicts(testEvent);
        const conflictTime = performance.now() - conflictStart;
        document.getElementById('conflictTiming').textContent = `${conflictTime.toFixed(2)}ms`;

        // Clean up test event
        this.eventStore.removeEvent(testEvent.id);

        // Measure batch operation
        const batchEvents = Array.from({ length: 100 }, (_, i) => ({
            id: `batch-${i}`,
            title: `Batch Event ${i}`,
            start: new Date(),
            end: new Date(Date.now() + 3600000)
        }));

        const batchStart = performance.now();
        this.eventStore.addEvents(batchEvents);
        const batchTime = performance.now() - batchStart;
        document.getElementById('batchTiming').textContent = `${batchTime.toFixed(2)}ms`;

        // Clean up batch events
        batchEvents.forEach(e => this.eventStore.removeEvent(e.id));
    }

    render() {
        const calendarEl = document.getElementById('calendar');

        // Get view data based on current view
        const viewData = this.calendar.getViewData();

        // Simple HTML rendering for demo
        let html = '';

        switch (this.currentView) {
            case 'month':
                html = this.renderMonthView(viewData);
                break;
            case 'week':
                html = this.renderWeekView(viewData);
                break;
            case 'day':
                html = this.renderDayView(viewData);
                break;
            case 'list':
                html = this.renderListView(viewData);
                break;
        }

        calendarEl.innerHTML = html;

        // Add event click handlers
        calendarEl.querySelectorAll('.calendar-event').forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const eventId = el.dataset.eventId;
                const event = this.eventStore.getEvent(eventId);
                this.showEventDetails(event);
            });
        });
    }

    renderMonthView(data) {
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        let html = `
            <div class="calendar-header">
                <h3>${monthNames[data.month]} ${data.year}</h3>
            </div>
            <div class="calendar-grid month-view">
                <div class="weekday-headers">
                    ${dayNames.map(day => `<div class="weekday">${day}</div>`).join('')}
                </div>
                <div class="month-days">
        `;

        data.weeks.forEach(week => {
            week.days.forEach(day => {
                const isToday = day.isToday ? 'today' : '';
                const isCurrentMonth = day.isCurrentMonth ? '' : 'other-month';
                const hasEvents = day.events.length > 0 ? 'has-events' : '';

                html += `
                    <div class="calendar-day ${isToday} ${isCurrentMonth} ${hasEvents}">
                        <div class="day-number">${day.dayOfMonth}</div>
                        <div class="day-events">
                            ${day.events.slice(0, 3).map(event => `
                                <div class="calendar-event" data-event-id="${event.id}">
                                    ${event.title}
                                </div>
                            `).join('')}
                            ${day.events.length > 3 ? `<div class="more-events">+${day.events.length - 3} more</div>` : ''}
                        </div>
                    </div>
                `;
            });
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    renderWeekView(data) {
        // Simplified week view
        return `
            <div class="calendar-header">
                <h3>Week ${data.weekNumber}</h3>
            </div>
            <div class="week-view">
                ${data.days.map(day => `
                    <div class="week-day">
                        <h4>${day.dayName}</h4>
                        ${day.events.map(event => `
                            <div class="calendar-event" data-event-id="${event.id}">
                                ${event.title}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderDayView(data) {
        // Simplified day view
        return `
            <div class="calendar-header">
                <h3>${data.dayName}</h3>
            </div>
            <div class="day-view">
                <div class="all-day-events">
                    ${data.allDayEvents.map(event => `
                        <div class="calendar-event all-day" data-event-id="${event.id}">
                            ${event.title}
                        </div>
                    `).join('')}
                </div>
                <div class="hourly-events">
                    ${data.hours.map(hour => `
                        <div class="hour-slot">
                            <div class="hour-time">${hour.time}</div>
                            <div class="hour-events">
                                ${hour.events.map(event => `
                                    <div class="calendar-event" data-event-id="${event.id}">
                                        ${event.title}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderListView(data) {
        // Simplified list view
        return `
            <div class="calendar-header">
                <h3>Event List</h3>
            </div>
            <div class="list-view">
                ${data.days.map(day => `
                    <div class="list-day">
                        <h4>${day.dayName}</h4>
                        ${day.events.map(event => `
                            <div class="calendar-event list-item" data-event-id="${event.id}">
                                <span class="event-time">${this.formatTime(event.start)} - ${this.formatTime(event.end)}</span>
                                <span class="event-title">${event.title}</span>
                                ${event.location ? `<span class="event-location">${event.location}</span>` : ''}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    showEventDetails(event) {
        const detailsEl = document.getElementById('eventDetails');

        if (!event) {
            detailsEl.innerHTML = '<p class="empty-state">Select an event to view details</p>';
            return;
        }

        const formatDate = (date) => {
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };

        let html = `
            <div class="event-details-content">
                <div class="event-detail-item">
                    <span class="event-detail-label">Title</span>
                    <span class="event-detail-value">${event.title}</span>
                </div>
                <div class="event-detail-item">
                    <span class="event-detail-label">Time</span>
                    <span class="event-detail-value">
                        ${formatDate(event.start)} - ${event.allDay ? 'All Day' : formatDate(event.end)}
                    </span>
                </div>
        `;

        if (event.location) {
            html += `
                <div class="event-detail-item">
                    <span class="event-detail-label">Location</span>
                    <span class="event-detail-value">${event.location}</span>
                </div>
            `;
        }

        if (event.organizer) {
            html += `
                <div class="event-detail-item">
                    <span class="event-detail-label">Organizer</span>
                    <span class="event-detail-value">${event.organizer.name}</span>
                </div>
            `;
        }

        if (event.attendees && event.attendees.length > 0) {
            const attendeeList = event.attendees.map(a =>
                `${a.name} (${a.responseStatus || 'pending'})`
            ).join(', ');

            html += `
                <div class="event-detail-item">
                    <span class="event-detail-label">Attendees</span>
                    <span class="event-detail-value">${attendeeList}</span>
                </div>
            `;
        }

        if (event.categories && event.categories.length > 0) {
            html += `
                <div class="event-detail-item">
                    <span class="event-detail-label">Categories</span>
                    <span class="event-detail-value">${event.categories.join(', ')}</span>
                </div>
            `;
        }

        if (event.reminders && event.reminders.length > 0) {
            const reminderList = event.reminders.map(r =>
                `${r.method} (${r.minutesBefore} min before)`
            ).join(', ');

            html += `
                <div class="event-detail-item">
                    <span class="event-detail-label">Reminders</span>
                    <span class="event-detail-value">${reminderList}</span>
                </div>
            `;
        }

        html += '</div>';
        detailsEl.innerHTML = html;
    }

    formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }
}

// Add calendar-specific styles
const style = document.createElement('style');
style.textContent = `
    .calendar-grid {
        display: flex;
        flex-direction: column;
        height: 100%;
    }

    .calendar-header {
        padding: var(--spacing-md);
        border-bottom: 1px solid var(--border-color);
    }

    .calendar-header h3 {
        margin: 0;
        color: var(--text-primary);
    }

    .weekday-headers {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-bottom: 1px solid var(--border-color);
    }

    .weekday {
        padding: var(--spacing-sm);
        text-align: center;
        font-weight: 600;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .month-days {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-rows: minmax(80px, 1fr);
        flex: 1;
    }

    .calendar-day {
        border: 1px solid var(--border-color);
        padding: var(--spacing-xs);
        background: var(--surface);
        transition: background var(--transition-fast);
    }

    .calendar-day:hover {
        background: var(--surface-hover);
    }

    .calendar-day.today {
        background: var(--primary-light);
        background: rgba(13, 71, 161, 0.05);
    }

    .calendar-day.other-month {
        background: var(--background);
        opacity: 0.5;
    }

    .day-number {
        font-weight: 600;
        font-size: 0.875rem;
        margin-bottom: var(--spacing-xs);
    }

    .day-events {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .calendar-event {
        background: var(--primary-color);
        color: white;
        padding: 2px 4px;
        border-radius: 2px;
        font-size: 0.75rem;
        cursor: pointer;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        transition: opacity var(--transition-fast);
    }

    .calendar-event:hover {
        opacity: 0.9;
    }

    .more-events {
        font-size: 0.75rem;
        color: var(--text-secondary);
        font-style: italic;
    }

    .week-view, .day-view, .list-view {
        padding: var(--spacing-lg);
    }

    .week-day {
        margin-bottom: var(--spacing-lg);
    }

    .week-day h4 {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin-bottom: var(--spacing-sm);
    }

    .hour-slot {
        display: grid;
        grid-template-columns: 80px 1fr;
        gap: var(--spacing-md);
        padding: var(--spacing-sm) 0;
        border-bottom: 1px solid var(--border-color);
    }

    .hour-time {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .list-day {
        margin-bottom: var(--spacing-lg);
    }

    .list-day h4 {
        margin-bottom: var(--spacing-md);
        color: var(--text-primary);
    }

    .calendar-event.list-item {
        display: flex;
        gap: var(--spacing-md);
        padding: var(--spacing-sm);
        background: var(--surface-hover);
        margin-bottom: var(--spacing-xs);
        color: var(--text-primary);
    }

    .event-time {
        color: var(--text-secondary);
        font-size: 0.875rem;
    }

    .event-location {
        color: var(--text-secondary);
        font-size: 0.875rem;
        font-style: italic;
    }
`;
document.head.appendChild(style);

// Initialize demo when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CalendarDemo());
} else {
    new CalendarDemo();
}