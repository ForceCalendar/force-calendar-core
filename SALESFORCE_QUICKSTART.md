# Lightning Calendar Core - Salesforce Quick Start

## 5-Minute Setup for Salesforce Developers

### What You're Getting
**Lightning Calendar Core** is a lightweight (20KB), zero-dependency calendar engine that works perfectly in Salesforce. No frameworks, no bloat - just pure calendar logic that respects Locker Service.

### The Value
Instead of:
- Building calendar logic from scratch (weeks of work)
- Fighting with FullCalendar + Locker Service (compatibility nightmares)
- Using heavy libraries like moment.js (250KB+)

You get:
- ✅ Complete calendar engine in 20KB
- ✅ Zero dependencies
- ✅ Locker Service compliant
- ✅ Full control over UI

---

## Option 1: Try the Minimal Demo (Recommended First)

See the pure core in action - no bells and whistles:

```bash
# Clone the repo
git clone https://github.com/thedhanawada/lightning-calendar.git
cd lightning-calendar/packages/examples/salesforce-minimal

# Deploy to your org
chmod +x deploy.sh
./deploy.sh

# Or manually:
sf project deploy start -d force-app -o YOUR_ORG
```

This gives you the core engine with a minimal wrapper - perfect for understanding what the core provides.

---

## Option 2: Quick Integration in Your Project

### Step 1: Get the Core Library

```bash
# Download the latest release
curl -O https://raw.githubusercontent.com/thedhanawada/lightning-calendar/master/packages/core/dist/index.esm.js

# Or build from source
git clone https://github.com/thedhanawada/lightning-calendar.git
cd lightning-calendar/packages/core
npm install && npm run build
# Output: dist/index.esm.js
```

### Step 2: Upload as Static Resource

1. **Setup** → **Static Resources** → **New**
2. Name: `LightningCalendarCore`
3. File: Upload the `.js` file
4. Cache Control: **Public**
5. **Save**

### Step 3: Create Your LWC

**yourCalendar.js:**
```javascript
import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import CALENDAR from '@salesforce/resourceUrl/LightningCalendarCore';

export default class YourCalendar extends LightningElement {
    @api recordId;  // If on a record page

    async connectedCallback() {
        // Load the library
        await loadScript(this, CALENDAR);

        // Create calendar
        const calendar = new window.LightningCalendar.Calendar();

        // Render it
        const container = this.template.querySelector('div');
        new window.LightningCalendar.VanillaDOMRenderer(container, calendar);

        // Load your Salesforce data
        this.loadSalesforceEvents(calendar);
    }

    async loadSalesforceEvents(calendar) {
        // Example: Load Event records
        const events = await getEvents({ recordId: this.recordId });

        events.data.forEach(sfEvent => {
            calendar.addEvent({
                id: sfEvent.Id,
                title: sfEvent.Subject,
                start: new Date(sfEvent.StartDateTime),
                end: new Date(sfEvent.EndDateTime)
            });
        });
    }
}
```

**yourCalendar.html:**
```html
<template>
    <div lwc:dom="manual" style="height: 600px;"></div>
</template>
```

**yourCalendar.js-meta.xml:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<LightningComponentBundle xmlns="http://soap.sforce.com/2006/04/metadata">
    <apiVersion>59.0</apiVersion>
    <isExposed>true</isExposed>
    <targets>
        <target>lightning__AppPage</target>
        <target>lightning__RecordPage</target>
        <target>lightning__HomePage</target>
    </targets>
</LightningComponentBundle>
```

---

## Core API - What You Can Do

```javascript
// Create calendar with options
const calendar = new LightningCalendar.Calendar({
    view: 'month',      // or 'week', 'day', 'list'
    weekStartsOn: 1,    // Monday
    timeZone: 'America/New_York'
});

// Add events
calendar.addEvent({
    id: 'event-1',
    title: 'Customer Meeting',
    start: new Date('2024-01-15 10:00'),
    end: new Date('2024-01-15 11:00'),
    allDay: false,
    color: '#0070f3',
    metadata: { recordId: '001xxx' }  // Store SF record ID
});

// Add recurring event
calendar.addEvent({
    title: 'Weekly Sync',
    start: new Date('2024-01-15 09:00'),
    recurring: true,
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO'
});

// Navigate
calendar.next();        // Next month/week/day
calendar.previous();    // Previous
calendar.today();       // Go to today
calendar.goToDate(date);

// Change views
calendar.setView('week');

// Listen to events
calendar.on('eventClick', (event) => {
    // Navigate to Salesforce record
    this[NavigationMixin.Navigate]({
        type: 'standard__recordPage',
        attributes: {
            recordId: event.metadata.recordId,
            actionName: 'view'
        }
    });
});

// Query events
const todayEvents = calendar.queryEvents({
    start: startOfToday,
    end: endOfToday
});
```

---

## Working with Salesforce Data

### Transform Salesforce Event to Calendar Event

```javascript
// Apex Controller
@AuraEnabled(cacheable=true)
public static List<Event> getEvents(Id recordId) {
    return [
        SELECT Id, Subject, StartDateTime, EndDateTime,
               IsAllDayEvent, Description
        FROM Event
        WHERE WhatId = :recordId
        LIMIT 100
    ];
}
```

```javascript
// In your LWC
import getEvents from '@salesforce/apex/CalendarController.getEvents';

async loadEvents() {
    const sfEvents = await getEvents({ recordId: this.recordId });

    sfEvents.forEach(sfEvent => {
        this.calendar.addEvent({
            id: sfEvent.Id,
            title: sfEvent.Subject,
            start: new Date(sfEvent.StartDateTime),
            end: new Date(sfEvent.EndDateTime),
            allDay: sfEvent.IsAllDayEvent,
            description: sfEvent.Description,
            metadata: {
                recordId: sfEvent.Id,
                type: 'Event'
            }
        });
    });
}
```

### Handle Timezone

```javascript
// Get user's timezone
import TIMEZONE from '@salesforce/i18n/timeZone';

const calendar = new LightningCalendar.Calendar({
    timeZone: TIMEZONE  // Use Salesforce user's timezone
});
```

---

## Examples Available

Check out `/packages/examples/` for:

1. **salesforce-minimal/** - Just the core, no extras
2. **salesforce-lwc/** - Full-featured LWC implementation
3. **salesforce-aura/** - Aura component example
4. **visualforce/** - Visualforce page example

---

## Performance

- **Bundle size**: 20KB minified (7KB gzipped)
- **Initial render**: < 50ms for 100 events
- **Locker Service**: Fully compliant
- **Browser support**: All Salesforce-supported browsers

---

## Common Issues & Solutions

### Calendar not rendering
- Check console for Static Resource loading errors
- Ensure `lwc:dom="manual"` on container div
- Verify loadScript promise completes

### Locker Service errors
- The core is fully compliant, but check your custom code
- Don't access global window directly

### Timezone issues
- Use Salesforce user timezone: `@salesforce/i18n/timeZone`
- Convert dates properly from Salesforce DateTime fields

---

## Get Help

- **Documentation**: [Integration Guide](docs/INTEGRATION_GUIDE.md)
- **Examples**: Check `/packages/examples/`
- **Issues**: [GitHub Issues](https://github.com/thedhanawada/lightning-calendar/issues)

---

## The Bottom Line

You get enterprise-grade calendar functionality in 20KB. No dependencies, no compatibility issues, just pure calendar logic that works perfectly in Salesforce.

**Don't build calendar logic from scratch. Use Lightning Calendar Core.**