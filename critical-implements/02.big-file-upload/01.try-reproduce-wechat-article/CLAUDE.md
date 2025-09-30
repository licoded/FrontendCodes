# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project focused on implementing big file upload functionality with chunked/fragmented upload and instant upload capabilities. The project name suggests it's reproducing functionality from a WeChat article about file upload techniques using Spring Boot + Vue approach, but implemented in React.

## Development Commands

- **Start full system**: `./start.sh` (starts both frontend and backend)
- **Frontend only**: `npm run dev` (Vite development server)
- **Backend only**: `cd server && npm run dev` (Express server with watch mode)
- **Build for production**: `npm run build` (TypeScript compilation + Vite build)
- **Lint code**: `npm run lint` (ESLint with TypeScript support)
- **Preview production build**: `npm run preview`

## Project Structure

### Frontend
- `src/main.tsx` - Application entry point using React 19
- `src/App.tsx` - Main application component with FileUpload
- `src/components/FileUpload.tsx` - Main file upload component with drag & drop
- `src/hooks/useFileUpload.ts` - Upload state management hook
- `src/utils/upload.ts` - File uploader class with chunking logic
- `src/utils/hash.ts` - File and chunk hashing utilities
- `src/types/upload.ts` - TypeScript type definitions
- `src/index.css` - Global styles
- Uses npm as package manager

### Backend
- `server/server.js` - Express.js API server
- `server/package.json` - Backend dependencies
- `server/temp/` - Temporary chunk storage directory
- `server/uploads/` - Final uploaded files directory

## Technical Stack

- **React 19.1.0** with TypeScript
- **Vite 6.3.5** for build tooling and development server
- **ESLint** with TypeScript support and React-specific rules
- **Modern ES modules** (type: "module" in package.json)

## Key Configuration

- TypeScript configuration split into `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json`
- ESLint configured with modern flat config format using TypeScript ESLint
- Vite uses React plugin with standard configuration
- Express.js backend with multer for file handling and crypto for hash verification

## File Upload Features

This is a complete big file upload system with:
- **Chunked Upload**: Files are split into 2MB chunks for parallel upload
- **Instant Upload/Skip**: SHA-256 hash detection for duplicate files (秒传)
- **Resume Upload**: Continue from where you left off after interruptions
- **Real-time Progress**: Visual progress for both overall and individual chunks
- **Concurrent Upload**: Configurable parallel chunk uploads (default: 3)
- **Error Handling**: Automatic retry for failed chunks with hash verification

## API Endpoints

- `POST /api/check-file` - Check if file exists (instant upload detection)
- `POST /api/upload-chunk` - Upload individual file chunks
- `POST /api/merge-file` - Merge chunks into final file
- `GET /api/files` - List uploaded files
- `GET /api/download/:hash` - Download file by hash
- `DELETE /api/files/:hash` - Delete uploaded file