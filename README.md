# Personal Finance Tracker

A full-stack, containerized personal finance dashboard for **expense analytics** and **net worth tracking** built with React, Node.js/Express, TypeScript, PostgreSQL, and Docker Compose.


>IMPORTANT NOTE: If you use the app via the link then your data are stored to the neon database i have configured. If you want to keep the private the you can fork the repo and deploy your own services by following this guide(comming soon)


>Practical NOTE: If you use the app for first time on the **Cashflow** page add first an income value for the app to work.
Also because it runs on Render free tier it may take between 1-2 minutes for the server to start.


Below is a short video on how the UI looks like

![Demo](https://private-user-images.githubusercontent.com/46191927/549069280-594056d2-95a7-4c0a-b6c1-37bb519a625e.gif?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzEwNjU3MjgsIm5iZiI6MTc3MTA2NTQyOCwicGF0aCI6Ii80NjE5MTkyNy81NDkwNjkyODAtNTk0MDU2ZDItOTVhNy00YzBhLWI2YzEtMzdiYjUxOWE2MjVlLmdpZj9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNjAyMTQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjYwMjE0VDEwMzcwOFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPWM3MmQwODE0YzhlNmI3MGNjZjM4OTE2ZGVjMGM4OWRhMWZiZjNiYTYyYjFiNWRiNWFhN2ZiMzE3YTdhYWUyMzUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0._bN4SJ5TmCl8Nsh49VJMHq6rof8Y58t9ImIHRRFzFhk)
---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Data Model](#data-model)
- [Setup & Installation](#setup--installation)
- [Usage](#usage)
- [Credits & Resources](#credits--resources)

---

## Overview
This project is a robust, user-friendly platform for tracking personal finances. It replaces complex spreadsheets with a modern dashboard, secure authentication, and insightful analytics. All components are containerized for easy deployment.

**Motivation:**
- Consolidate financial tracking into a single, efficient platform.
- Learn and apply best practices in full-stack development, security, and DevOps.

A detailed explanation of project's structure and core components are described in the following blogs:

>NOTE: The codebase has since evolved with net worth tracking features.
The blogs still describe the core architecture, authentication, and API patterns,
but may not reflect the latest schema additions.


- [Blog: Database Setup](https://medium.com/towards-data-engineering/building-a-personal-finance-management-app-database-setup-with-postgresql-and-docker-5075e283303e)
- [Blog: REST API & Integration](https://medium.com/towards-data-engineering/building-a-personal-finance-management-app-integrating-rest-api-node-js-7a0f0f27bd4e)
- [Blog: JWT Implementation](https://medium.com/gitconnected/building-a-personal-finance-management-app-secure-api-authentication-a-practical-guide-e9d936b6982b)

---

## Features
- **User Authentication:** Secure signup/login with JWT and password hashing.
- **User-specific Data:** Each user's data is isolated and protected.
- **Expense & Income Tracking:** Add, view, and categorize transactions.
- **Net Worth Tracking:** Track assets and liabilities by institution, category, and type
- **Responsive Dashboard:** Modern UI with charts (Recharts, MUI) and mobile-friendly design.
- **REST API:** Clean separation between frontend and backend.
- **Dockerized:** One-command setup for local or production.

---

## System Architecture

> Note: The architecture now also includes net worth–related routes, services,
and database tables (categories, types, institutions, and transactions),
following the same layered design shown below.

```mermaid
graph TD
    subgraph "User's Browser"
        A["React Frontend"]
    end

    subgraph "Docker Environment"
        B["Frontend Container\nNginx"]
        C["Backend Container\nNode.js/Express"]
        D["Database Container\nPostgreSQL"]
        E["Migration Container"]
    end

    subgraph "Backend Logic"
        F["Auth Routes"]
        G["Feed Routes (Protected)"]
        H["Auth Controller"]
        I["Feed Controller"]
        J["Auth Service"]
        K["Feed Service"]
        L["is-auth Middleware"]
    end
    
    subgraph "Database Schema"
        M["users Table"]
        N["transactions Table"]
        O["SQL Functions"]
        P["expense_categories Table"]
        Q["expense_types Table"]
    end

    A -- "HTTP Request" --> B
    B -- "API Calls" --> C

    C --> F & G

    F --> H
    G -- "Verifies JWT via" --> L
    L --> I
    
    H --> J
    I --> K
    
    J --> M
    K --> N & O
    
    E -- "Applies Schema to" --> D
    D --> M & N & O & P & Q

    style A fill:#e3f2fd,stroke:#333,stroke-width:2px
    style B fill:#e8f5e9,stroke:#333,stroke-width:2px
    style C fill:#fff3e0,stroke:#333,stroke-width:2px
    style D fill:#f3e5f5,stroke:#333,stroke-width:2px
    style E fill:#efebe9,stroke:#333,stroke-width:2px
    
    style F fill:#ffebee,stroke:#333,stroke-width:2px
    style G fill:#ffebee,stroke:#333,stroke-width:2px
    style H fill:#fffde7,stroke:#333,stroke-width:2px
    style I fill:#fffde7,stroke:#333,stroke-width:2px
    style J fill:#e0f7fa,stroke:#333,stroke-width:2px
    style K fill:#e0f7fa,stroke:#333,stroke-width:2px
    style L fill:#fce4ec,stroke:#333,stroke-width:2px
    
    style M fill:#f1f8e9,stroke:#333,stroke-width:2px
    style N fill:#f1f8e9,stroke:#333,stroke-width:2px
    style O fill:#f1f8e9,stroke:#333,stroke-width:2px
    style P fill:#f1f8e9,stroke:#333,stroke-width:2px
    style Q fill:#f1f8e9,stroke:#333,stroke-width:2px
```

---

## Data Model

### Entity-Relationship Diagram

```mermaid
erDiagram
    USERS {
        int id PK
        varchar email
        varchar password_hash
        timestamp created_at
    }

    TRANSACTIONS {
        int id PK
        date date
        decimal amount
        int type_id FK
        int category_id FK
        int user_id FK
    }

    EXPENSE_CATEGORIES {
        int id PK
        varchar category_name
    }

    EXPENSE_TYPES {
        int id PK
        varchar type_name
        int category_id FK
    }

    NETWORTH_CATEGORIES {
        int id PK
        varchar category_name
    }

    NETWORTH_TYPES {
        int id PK
        varchar type_name
        int category_id FK
    }

    NETWORTH_INSTITUTIONS {
        int id PK
        varchar institution_name
        int category_id FK
        int type_id FK
    }

    NETWORTH_TRANSACTIONS {
        int id PK
        date date
        decimal amount
        int type_id FK
        int category_id FK
        int institution_id FK
        int user_id FK
    }

    %% Expense relationships
    USERS ||--o{ TRANSACTIONS : "has expenses"
    EXPENSE_CATEGORIES ||--o{ EXPENSE_TYPES : "groups"
    EXPENSE_CATEGORIES ||--o{ TRANSACTIONS : "categorizes"
    EXPENSE_TYPES ||--o{ TRANSACTIONS : "typed by"
    TRANSACTIONS }o--|| USERS : "belongs to"
    TRANSACTIONS }o--|| EXPENSE_CATEGORIES : "in category"
    TRANSACTIONS }o--|| EXPENSE_TYPES : "of type"

    %% Net worth relationships
    USERS ||--o{ NETWORTH_TRANSACTIONS : "has net worth events"
    NETWORTH_CATEGORIES ||--o{ NETWORTH_TYPES : "groups"
    NETWORTH_CATEGORIES ||--o{ NETWORTH_INSTITUTIONS : "classifies"
    NETWORTH_CATEGORIES ||--o{ NETWORTH_TRANSACTIONS : "categorizes"
    NETWORTH_TYPES ||--o{ NETWORTH_INSTITUTIONS : "allowed for"
    NETWORTH_TYPES ||--o{ NETWORTH_TRANSACTIONS : "typed by"
    NETWORTH_INSTITUTIONS ||--o{ NETWORTH_TRANSACTIONS : "held at"
    NETWORTH_TRANSACTIONS }o--|| USERS : "belongs to"
    NETWORTH_TRANSACTIONS }o--|| NETWORTH_CATEGORIES : "in category"
    NETWORTH_TRANSACTIONS }o--|| NETWORTH_TYPES : "of type"
    NETWORTH_TRANSACTIONS }o--|| NETWORTH_INSTITUTIONS : "at institution"
```

**Table Descriptions:**
- **users:** Stores user credentials and metadata. Each user has a unique email and securely hashed password.
- **transactions:** Records all income/expenses. Each transaction is linked to a user, a category, and a type.
- **expense_categories:** High-level groupings (e.g., Housing, Personal Running Costs).
- **expense_types:** Specific types within a category (e.g., Restaurants, Groceries).
- **networth_categories:** Groupings of assets/liabilities (e.g. Cash, Investments, Pensions, Loans)
- **networth_types:** Specific types within a net worth category (eg. Real Estate, Bank, Crypto)
- **networth_institutions:** Banks/brokers/pension providers/etc.
- **networth_transactions:** Changes in balances / positions contributing to net worth

---

## Setup & Installation

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd finance-tracker
   ```
2. **Start the stack:**
   ```sh
   docker-compose up -d
   ```
   - To rebuild: `docker-compose up --build`
   - To stop: `docker-compose down` (add `-v` to remove volumes)
3. **Access the app:**
   - Frontend: [http://localhost:3001](http://localhost:3001)
   - Backend/API: [http://localhost:3000](http://localhost:3000)

**Note:** Change the frontend port in `docker-compose.yaml` if 3001 is blocked.

---

## Usage
- **Sign up** for a new account.
- **Log in** to access your dashboard.
- **Add transactions** (income/expenses) via the dashboard modal.
- **Add net worth** track total net worth and trends over time
- **View analytics** and charts for your financial overview.
- **Log out** securely; you'll be auto-logged out if your session expires.

---

## Credits & Resources
- Inspired by [ed-roh/finance-app](https://github.com/ed-roh/finance-app) and [this YouTube tutorial](https://www.youtube.com/watch?v=uoJ0Tv-BFcQ)
---

**Currency is hardcoded as Danish Crowns (DKK) in the frontend.**

**This project is a work in progress and intended for personal use.**
