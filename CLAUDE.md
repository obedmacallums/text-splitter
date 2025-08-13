# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based text splitter application that intelligently divides long texts while respecting paragraph boundaries and character limits. The app is built with Create React App and styled with TailwindCSS.

## Development Commands

- `npm start` - Start development server at http://localhost:3000
- `npm run build` - Build production bundle
- `npm test` - Run tests in watch mode
- `npm run test -- --coverage` - Run tests with coverage report

## Architecture

### Core Application Structure
- **Single Component Architecture**: The entire application logic is contained within the `TextSplitter` component in `src/App.js`
- **State Management**: Uses React hooks for local state management:
  - `maxChars`: Character limit for text fragments (default: 3000)
  - `inputText`: User input text to be split
  - `fragments`: Array of split text fragments
  - `copiedIndex`: Tracks currently copied fragment for UI feedback
  - `copiedFragments`: Set tracking all previously copied fragments

### Text Splitting Algorithm
The core splitting logic in `splitText()` function:
1. **Paragraph-first splitting**: Splits text by double line breaks (`\n\s*\n`) to preserve paragraph structure
2. **Smart overflow handling**: When adding a paragraph would exceed `maxChars`, it's moved to a new fragment
3. **Sentence-level fallback**: For paragraphs longer than `maxChars`, splits by sentences using regex `(?<=[.!?])\s+`
4. **Graceful degradation**: Very long sentences are preserved as-is rather than being broken mid-sentence

### UI Components Structure
- **Header**: Title and description with Scissors icon
- **Configuration Panel**: Character limit input with Settings icon
- **Input Area**: Large textarea with character counter and split button
- **Results Section**: Dynamic fragment display with individual copy buttons

### Styling Framework
- **TailwindCSS v3.4.17**: Configured with PostCSS
- **Design System**: Uses blue color scheme with gradients, rounded corners, and shadow effects
- **Icons**: Lucide React icons (Copy, Check, FileText, Settings, Scissors)
- **Responsive**: Mobile-first responsive design with `sm:` breakpoints

### Key Dependencies
- **React 19.1.1**: Latest React version
- **lucide-react**: Icon library
- **TailwindCSS**: Utility-first CSS framework with PostCSS processing
- **Testing**: React Testing Library setup included