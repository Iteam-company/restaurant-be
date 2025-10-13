# Restaurant Management System - Entity Relationship Diagram

```mermaid
erDiagram
    User {
        int id PK
        string firstName
        string lastName
        string username
        string role "owner, waiter, admin"
        string email
        string phoneNumber
        string password
        string icon "nullable"
    }

    Restaurant {
        int id PK
        string name
        string address
        string image "nullable"
    }

    Quiz {
        int id PK
        string title
        date createdAt
        string difficultyLevel "easy, medium, hard"
        int timeLimit
        string status "in-progress, completed, not-started"
    }

    Question {
        int id PK
        string text
        string[] variants
        int[] correct
        boolean multipleCorrect
    }

    QuizResult {
        int id PK
        string score
        date raitingDate
    }

    QuizSummary {
        int id PK
        string bestScore
        date endDate
        string duration
    }

    %% Relationships
    Restaurant ||--o{ User : "has workers"
    Restaurant ||--|| User : "owned by"
    Restaurant ||--|| User : "administered by"

    Quiz ||--o{ Question : "contains questions"
    Quiz ||--o{ QuizResult : "has results"
    Quiz ||--|| QuizSummary : "summarized by"

    User ||--o{ QuizResult : "takes quizes"
    User }o--o{ QuizSummary : "members of quiz summary"
```

## Entity Descriptions

### Core Entities

- **User**: Represents system users (owners, waiters, admins)
- **Restaurant**: Restaurant information and settings

### Quiz System Entities

- **Quiz**: Training quizes for staff with difficulty levels
- **Question**: Quiz questions with multiple choice answers
- **QuizResult**: Individual quiz attempt results
- **QuizSummary**: Aggregated quiz performance data

## Key Relationships

1. **Restaurant-User**: One restaurant has many workers, one owner, and optionally one admin
2. **Quiz-Question**: Each quiz contains multiple questions
3. **User-QuizResult**: Users can take multiple quizes
4. **Quiz-QuizSummary**: Each quiz has one summary with multiple member participants

## Business Logic Notes

- Users have roles: `owner`, `waiter`, `admin`
- Quiz system supports staff training with different difficulty levels
- Quiz results track individual performance over time
