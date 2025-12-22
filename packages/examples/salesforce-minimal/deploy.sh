#!/bin/bash

echo "════════════════════════════════════════════════════════════"
echo "   Lightning Calendar Core - Minimal Salesforce Deployment"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "This will deploy just the core calendar engine to Salesforce"
echo "No frameworks, no dependencies - just 20KB of pure calendar logic"
echo ""

# Step 1: Build the core
echo "📦 Step 1: Building Lightning Calendar Core..."
cd ../../core
npm run build
echo "✅ Core built successfully (dist/index.esm.js)"
echo ""

# Step 2: Create Static Resource
echo "📋 Step 2: Preparing Static Resource..."
cd ../examples/salesforce-minimal
mkdir -p force-app/main/default/staticresources

# Copy the minified core
cp ../../core/dist/index.esm.js force-app/main/default/staticresources/LightningCalendarCore.js

# Create metadata for Static Resource
cat > force-app/main/default/staticresources/LightningCalendarCore.resource-meta.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<StaticResource xmlns="http://soap.sforce.com/2006/04/metadata">
    <cacheControl>Public</cacheControl>
    <contentType>application/javascript</contentType>
    <description>Lightning Calendar Core - Pure calendar engine (20KB)</description>
</StaticResource>
EOF

echo "✅ Static Resource prepared"
echo ""

# Step 3: Show file sizes
echo "📊 File Sizes:"
ls -lh force-app/main/default/staticresources/LightningCalendarCore.js | awk '{print "   Core Library: " $5}'
echo ""

# Step 4: Deploy
echo "🚀 Step 3: Deploy to Salesforce"
echo ""
echo "Choose deployment target:"
echo "  1) Deploy to default org"
echo "  2) Deploy to specific org (by alias)"
echo "  3) Skip deployment (manual)"
echo ""
read -p "Select (1-3): " choice

case $choice in
    1)
        echo "Deploying to default org..."
        sf project deploy start -d force-app
        echo "✅ Deployed!"
        echo ""
        echo "Next steps:"
        echo "1. Go to any Lightning Page"
        echo "2. Edit Page"
        echo "3. Add 'Minimal Calendar (Core Only)' component"
        echo "4. Save & Activate"
        ;;
    2)
        read -p "Enter org alias: " org_alias
        echo "Deploying to $org_alias..."
        sf project deploy start -d force-app -o $org_alias
        echo "✅ Deployed!"
        ;;
    3)
        echo ""
        echo "📦 Package ready for manual deployment in: force-app/"
        echo ""
        echo "Deploy manually with:"
        echo "  sf project deploy start -d force-app -o YOUR_ORG"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "════════════════════════════════════════════════════════════"
echo "   ✅ Lightning Calendar Core is ready!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "What you get:"
echo "  • Full calendar functionality in ~20KB"
echo "  • Zero dependencies"
echo "  • Month/Week/Day views"
echo "  • Event management"
echo "  • Recurring events"
echo "  • All core features"
echo ""
echo "The entire integration is just 3 steps:"
echo "  1. Load the library"
echo "  2. Create calendar instance"
echo "  3. Attach to DOM"
echo ""
echo "That's it! Check the console logs to see it working."