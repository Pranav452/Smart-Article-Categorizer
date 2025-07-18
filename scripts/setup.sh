#!/bin/bash

echo "🚀 Setting up Smart Article Categorizer..."
echo "============================================"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check for package manager
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
else
    echo "❌ No package manager found. Please install npm or pnpm."
    exit 1
fi

echo "✅ Package manager: $PKG_MANAGER"

# Install dependencies
echo "📦 Installing dependencies..."
$PKG_MANAGER install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies."
    exit 1
fi

echo "✅ Dependencies installed successfully!"

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "⚙️ Creating environment file..."
    cat > .env.local << EOF
# Google AI API Key (required for Gemini embeddings)
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here

# Supabase Configuration (optional - for document storage)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
EOF
    echo "✅ Created .env.local file. Please update it with your API keys."
    echo "📝 Note: Only GOOGLE_GENERATIVE_AI_API_KEY is required for full article classification functionality."
else
    echo "✅ Environment file already exists."
fi

echo ""
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "📋 Next Steps:"
echo "1. Update your .env.local file with API keys"
echo "2. Run: $PKG_MANAGER dev"
echo "3. Open http://localhost:3000"
echo "4. Go to 'Model Training' tab and train your first model"
echo "5. Start classifying articles!"
echo ""
echo "🔧 Available Commands:"
echo "• $PKG_MANAGER dev         - Start development server"
echo "• $PKG_MANAGER build       - Build for production"
echo "• $PKG_MANAGER start       - Start production server"
echo "• $PKG_MANAGER lint        - Run linter"
echo ""
echo "📚 Documentation: README.md"
echo "🐛 Issues: Create an issue on GitHub"
echo ""
echo "Happy classifying! 🤖📰" 