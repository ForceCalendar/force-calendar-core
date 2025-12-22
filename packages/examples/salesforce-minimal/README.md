# Lightning Calendar Core - Minimal Salesforce Integration

## What This Is
The absolute minimum code needed to use Lightning Calendar Core in Salesforce. No UI framework, no fancy styling - just the pure calendar engine working in a Lightning Web Component.

## What You Get
- ✅ Full calendar functionality in 20KB
- ✅ Zero dependencies
- ✅ Locker Service compliant
- ✅ Complete control over UI/UX

## Files Included
1. **lightning-calendar.min.js** - The core engine (upload as Static Resource)
2. **minimalCalendar** - Bare-bones LWC that loads and uses the core

## Quick Setup (5 minutes)

### Step 1: Upload Static Resource
1. Go to Setup → Static Resources → New
2. Name: `LightningCalendarCore`
3. Upload: `lightning-calendar.min.js`
4. Cache Control: Public
5. Save

### Step 2: Deploy the Minimal LWC
```bash
sf project deploy start -d force-app -o YOUR_ORG
```

### Step 3: Add to Lightning Page
1. Go to any Lightning Page
2. Edit Page
3. Drag "Minimal Calendar" component
4. Save & Activate

## That's It!

You now have a fully functional calendar with:
- Month/Week/Day views
- Event management
- Date navigation
- Event clicking
- Recurring events
- All the core features

## The Code Is Simple

The entire LWC is just:
```javascript
import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import CALENDAR_CORE from '@salesforce/resourceUrl/LightningCalendarCore';

export default class MinimalCalendar extends LightningElement {
    async connectedCallback() {
        await loadScript(this, CALENDAR_CORE);

        // Create calendar
        this.calendar = new window.LightningCalendar.Calendar();

        // Render it
        const container = this.template.querySelector('div');
        new window.LightningCalendar.VanillaDOMRenderer(container, this.calendar);

        // Add sample event
        this.calendar.addEvent({
            title: 'It works!',
            start: new Date(),
            end: new Date(Date.now() + 3600000)
        });
    }
}
```

## Build Your Own UI

Now you can:
- Style it however you want
- Add your own controls
- Integrate with Salesforce data
- Build custom views
- Add your business logic

The core handles all the complex calendar logic. You just focus on your UI.

## Why This Approach?

1. **You own the UI** - Not locked into our design decisions
2. **Smaller footprint** - Only include what you need
3. **Easier to customize** - Direct access to the core API
4. **Better performance** - No unnecessary layers

## Next Steps

1. Check the [API Documentation](../../docs/INTEGRATION_GUIDE.md)
2. See [Full LWC Example](../salesforce-lwc/) for more features
3. Review [Core Documentation](../../core/README.md)

## The Value Proposition

> "Don't build calendar logic. Use our tested, optimized core and focus on your unique requirements."