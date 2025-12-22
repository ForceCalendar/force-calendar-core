/**
 * Minimal Calendar - Lightning Calendar Core in Salesforce
 *
 * This is the simplest possible integration showing just the core
 * No bells, no whistles - just pure calendar functionality
 */
import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import CALENDAR_CORE from '@salesforce/resourceUrl/LightningCalendarCore';

export default class MinimalCalendar extends LightningElement {
    calendarInitialized = false;
    calendar;
    renderer;

    async connectedCallback() {
        if (this.calendarInitialized) return;

        try {
            // Step 1: Load the core library (20KB)
            await loadScript(this, CALENDAR_CORE);
            console.log('✅ Lightning Calendar Core loaded');

            // Step 2: Create calendar instance
            this.calendar = new window.LightningCalendar.Calendar({
                view: 'month',
                date: new Date(),
                weekStartsOn: 0  // Sunday
            });
            console.log('✅ Calendar instance created');

            // Step 3: Create renderer (connects calendar to DOM)
            const container = this.template.querySelector('.calendar-container');
            this.renderer = new window.LightningCalendar.VanillaDOMRenderer(
                container,
                this.calendar
            );
            console.log('✅ Renderer attached');

            // Step 4: Add some demo events to show it works
            this.addDemoEvents();

            // Step 5: Set up event listeners
            this.setupEventListeners();

            this.calendarInitialized = true;
            console.log('✅ Calendar ready!');

        } catch (error) {
            console.error('❌ Failed to initialize calendar:', error);
        }
    }

    addDemoEvents() {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Add sample events
        const events = [
            {
                id: 'demo-1',
                title: '🎯 Lightning Calendar Core Works!',
                start: new Date(today.setHours(10, 0, 0, 0)),
                end: new Date(today.setHours(11, 0, 0, 0)),
                color: '#0070f3'
            },
            {
                id: 'demo-2',
                title: '📊 Team Review',
                start: new Date(today.setHours(14, 0, 0, 0)),
                end: new Date(today.setHours(15, 0, 0, 0)),
                color: '#00c853'
            },
            {
                id: 'demo-3',
                title: '🚀 Project Launch',
                start: tomorrow,
                allDay: true,
                color: '#ff6b6b'
            },
            {
                id: 'demo-4',
                title: '☕ Daily Standup',
                start: new Date(today.setHours(9, 0, 0, 0)),
                end: new Date(today.setHours(9, 15, 0, 0)),
                recurring: true,
                recurrenceRule: 'FREQ=DAILY;BYDAY=MO,TU,WE,TH,FR',
                color: '#9c27b0'
            }
        ];

        events.forEach(event => this.calendar.addEvent(event));
        console.log(`✅ Added ${events.length} demo events`);
    }

    setupEventListeners() {
        // Listen for event clicks
        this.calendar.on('eventClick', (event) => {
            console.log('Event clicked:', event);
            // In real app: Navigate to record or show details
            alert(`Event: ${event.title}\nStart: ${event.start.toLocaleString()}`);
        });

        // Listen for date clicks
        this.calendar.on('dateClick', (date) => {
            console.log('Date clicked:', date);
            // In real app: Create new event
        });

        // Listen for view changes
        this.calendar.on('viewChange', (view) => {
            console.log('View changed to:', view);
        });
    }

    // Public methods that parent components can call
    @api
    addEvent(eventData) {
        if (this.calendar) {
            return this.calendar.addEvent(eventData);
        }
    }

    @api
    removeEvent(eventId) {
        if (this.calendar) {
            return this.calendar.removeEvent(eventId);
        }
    }

    @api
    getEvents() {
        return this.calendar ? this.calendar.getEvents() : [];
    }

    @api
    setView(viewType) {
        if (this.calendar) {
            this.calendar.setView(viewType);
        }
    }

    @api
    navigateToDate(date) {
        if (this.calendar) {
            this.calendar.goToDate(date);
        }
    }
}