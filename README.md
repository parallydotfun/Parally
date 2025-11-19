# Parally

A decentralized AI agent marketplace built on Solana blockchain.

## Overview

Parally is a comprehensive platform that enables users to create, deploy, and monetize AI agents. The platform features a complete marketplace ecosystem with staking mechanisms, wallet integration, and advanced agent management capabilities.

## Features

- **AI Agent Builder**: Create custom AI agents with configurable parameters
- **Marketplace**: Browse and purchase AI agents from the community
- **Staking System**: Stake tokens to earn rewards
- **User Panel**: Manage your agents and track activity
- **Platform Panel**: Administrative controls and analytics
- **Wallet Integration**: Seamless Solana wallet connectivity

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js
- **Database**: Supabase
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Solana wallet (Phantom, Solflare, etc.)

### Installation

```bash
npm install
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_OPENAI_API_KEY=your_openai_key
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Application pages
├── services/        # Business logic and API integrations
└── index.css        # Global styles

supabase/
├── migrations/      # Database migrations
└── functions/       # Edge functions
```

## License

MIT
