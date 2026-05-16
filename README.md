# FreelanceCLI

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/java-17%2B-brightgreen)
![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![Spring Boot](https://img.shields.io/badge/spring%20boot-3.0-brightgreen)
![React](https://img.shields.io/badge/react-vite-brightgreen)

A **distributed activity logging and analytics system** for freelancers: log work sessions via a CLI (offline-first), sync to a backend, and view reports on a web platform.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Design](#system-design)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Testing](#testing)
- [License](#license)

## Overview

FreelanceCLI is a comprehensive time tracking and analytics platform designed specifically for freelancers. It consists of three main components:

1. **CLI Application**: A command-line interface for logging work sessions offline-first with local SQLite storage
2. **Backend Services**: Modular Spring Boot microservices handling authentication, session tracking, and reporting
3. **Web Frontend**: A React/Vite application for visualizing work data and generating reports

The system enables freelancers to track their time spent on different projects, synchronize data across devices, and gain insights into their productivity and billing.

## Features

### CLI Features
- **Session Management**: `start`, `stop`, `report` commands for tracking work sessions
- **Offline-first**: Local SQLite storage with idempotent sync capabilities
- **Authentication**: Secure login with JWT token management
- **Synchronization**: Sync local sessions to backend when online

### Backend Features
- **Microservices Architecture**: Separate services for Auth, Tracking, and Reporting
- **API Gateway**: Centralized entry point for all client requests
- **Database per Service**: PostgreSQL instances for auth and tracking data
- **Caching**: Redis for report service performance optimization
- **RESTful APIs**: Well-documented endpoints for all operations

### Web Features
- **User Authentication**: Login/logout with JWT persistence
- **Session Visualization**: View logged sessions in tabular format
- **Analytics Dashboard**: Charts and reports for time tracking insights
- **Project Management**: Organize sessions by project/client
- **Export Capabilities**: Export reports in various formats


## Technology Stack

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.0
- **Build Tool**: Gradle
- **Databases**: PostgreSQL (2 instances: auth_db, tracking_db)
- **Caching**: Redis
- **API Gateway**: Spring Cloud Gateway
- **Security**: JWT-based authentication

### CLI
- **Language**: Java 17
- **Framework**: Picocli for command parsing
- **Database**: SQLite for local storage
- **Build Tool**: Gradle

### Frontend
- **Framework**: React with Vite
- **State Management**: React Context/Hooks
- **Styling**: CSS3 with modern layout techniques
- **Charts**: Chart.js or similar visualization library
- **HTTP Client**: Axios for API communication

### DevOps & Infrastructure
- **Containerization**: Docker and Docker Compose
- **Version Control**: Git/GitHub
- **Documentation**: Markdown with Mermaid diagrams
- **Testing**: JUnit (backend), Jest/Vitest (frontend)

## Getting Started

### Prerequisites

Before you begin, ensure you have installed:
- **Java 17** (OpenJDK or Oracle JDK)
- **Node.js 18+** (with npm)
- **PostgreSQL** (two instances or use Docker)
- **Redis** (for report service caching)
- **Gradle** (for backend and CLI builds)
- **Docker & Docker Compose** (optional, for containerized setup)

### Installation

#### Option 1: Local Setup (without Docker)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Himansyou/FreelanceCLI.git
   cd FreelanceCLI
   ```

2. **Set up databases**
   - Create PostgreSQL database `auth_db` on port 5432
   - Create PostgreSQL database `tracking_db` on port 5433
   - Start Redis server on port 6379
   - Update `application.yml` files in each service with your database credentials

3. **Build and run backend services**
   ```bash
   cd backend
   # Auth service (port 8081)
   gradle :auth-service:bootRun
   # Tracking service (port 8082)
   gradle :tracking-service:bootRun
   # Report service (port 8083)
   gradle :report-service:bootRun
   # API Gateway (port 8080)
   gradle :api-gateway:bootRun
   ```

4. **Set up CLI**
   ```bash
   cd ../CLI
   ./gradlew installDist
   ```

5. **Set up Web frontend**
   ```bash
   cd ../web
   npm install
   ```

#### Option 2: Docker Setup

1. **Ensure Docker and Docker Compose are installed**
2. **From project root:**
   ```bash
   docker-compose up -d
   ```
   This will start:
   - PostgreSQL (auth) on port 5432
   - PostgreSQL (tracking) on port 5433
   - Redis on port 6379
   - All backend services (Auth:8081, Tracking:8082, Report:8083, Gateway:8080)

### Usage

#### Using the CLI

1. **Login**
   ```bash
   ./build/install/CLI/bin/CLI login user@example.com --password secret
   ```

2. **Start tracking a project**
   ```bash
   ./build/install/CLI/bin/CLI start "My Project"
   ```

3. **Stop tracking**
   ```bash
   ./build/install/CLI/bin/CLI stop
   ```

4. **View reports**
   ```bash
   ./build/install/CLI/bin/CLI report
   ```

5. **Sync sessions to backend**
   ```bash
   ./build/install/CLI/bin/CLI sync
   ```

#### Using the Web Application

1. **Start the development server**
   ```bash
   cd web
   npm run dev
   ```

2. **Open your browser** to `http://localhost:3000`
3. **Set API URL** (if needed): `VITE_API_URL=http://localhost:8080`
4. **Login** with your credentials
5. **Navigate** through sessions, projects, and reports

## API Documentation

Detailed API specifications can be found in:
- [API Contracts](docs/API.md)
- [Sample Requests/Responses](docs/sample-data.md)
- **Postman Collection**: Import `postman/FreelanceCLI-API.postman_collection.json`

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

Please ensure your code follows our coding standards and includes appropriate tests.

### Development Guidelines
- Write meaningful commit messages
- Add unit tests for new functionality
- Update documentation as needed
- Follow existing code style and patterns

## Testing

### Backend Tests
```bash
cd backend
gradle test
```
- Uses H2 in-memory database for testing
- Auth and Tracking services have JUnit tests

### CLI Tests
```bash
cd CLI
./gradlew test
```

### Frontend Tests
```bash
cd web
npm test
```
- Uses Jest/Vitest for component and utility testing

## Project Structure

```
FreelanceCLI/
├── CLI/                    # Java CLI application (Picocli, SQLite)
├── backend/               # Spring Boot microservices
│   ├── api-gateway/       # Spring Cloud Gateway (:8080)
│   ├── auth-service/     # Authentication service (:8081)
│   ├── tracking-service/  # Session tracking service (:8082)
│   └── report-service/   # Reporting & analytics service (:8083)
├── web/                   # React/Vite frontend application
├── docs/                  # Architecture, database, API documentation
├── postman/               # Postman API collection
├── docker-compose.yml     # Docker Compose configuration
└── README.md              # This file
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by the need for freelancer-focused time tracking tools
- Built with modern Java/Spring Boot and React/Vite technologies
- Special thanks to the open-source community for libraries and frameworks used