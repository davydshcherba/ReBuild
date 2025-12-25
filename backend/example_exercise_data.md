# Example Exercise Data

## JSON Format (API Request/Response)

### Creating an Exercise (POST /exercises)
```json
{
  "name": "Push-ups",
  "group": "Chest",
  "date": "2024-12-25"
}
```

### Exercise Response (from /me endpoint)
```json
{
  "id": 1,
  "name": "Push-ups",
  "group": "Chest",
  "date": "2024-12-25"
}
```

### Full User Response with Exercises
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "exercises": [
    {
      "id": 1,
      "name": "Push-ups",
      "group": "Chest",
      "date": "2024-12-25"
    },
    {
      "id": 2,
      "name": "Squats",
      "group": "Legs",
      "date": "2024-12-25"
    },
    {
      "id": 3,
      "name": "Pull-ups",
      "group": "Back",
      "date": "2024-12-26"
    },
    {
      "id": 4,
      "name": "Bench Press",
      "group": "Chest",
      "date": "2024-12-27"
    },
    {
      "id": 5,
      "name": "Deadlift",
      "group": "Back",
      "date": "2024-12-27"
    }
  ]
}
```

## SQL INSERT Examples

### Direct Database Insert
```sql
-- Insert a single exercise
INSERT INTO exercises (name, "group", exercise_date, user_id)
VALUES ('Push-ups', 'Chest', '2024-12-25', 1);

-- Insert multiple exercises
INSERT INTO exercises (name, "group", exercise_date, user_id) VALUES
  ('Squats', 'Legs', '2024-12-25', 1),
  ('Pull-ups', 'Back', '2024-12-26', 1),
  ('Bench Press', 'Chest', '2024-12-27', 1),
  ('Deadlift', 'Back', '2024-12-27', 1),
  ('Shoulder Press', 'Shoulders', '2024-12-28', 1);
```

## Example Exercise Groups

Common exercise groups you might use:
- **Chest**: Push-ups, Bench Press, Chest Fly, Incline Press
- **Back**: Pull-ups, Deadlift, Rows, Lat Pulldown
- **Legs**: Squats, Lunges, Leg Press, Leg Curl
- **Shoulders**: Shoulder Press, Lateral Raises, Front Raises
- **Arms**: Bicep Curls, Tricep Dips, Hammer Curls
- **Core**: Planks, Sit-ups, Russian Twists, Leg Raises
- **Cardio**: Running, Cycling, Swimming, Rowing

## Example Weekly Schedule

```json
{
  "monday": [
    { "name": "Push-ups", "group": "Chest", "date": "2024-12-23" },
    { "name": "Bench Press", "group": "Chest", "date": "2024-12-23" },
    { "name": "Tricep Dips", "group": "Arms", "date": "2024-12-23" }
  ],
  "wednesday": [
    { "name": "Squats", "group": "Legs", "date": "2024-12-25" },
    { "name": "Lunges", "group": "Legs", "date": "2024-12-25" },
    { "name": "Leg Press", "group": "Legs", "date": "2024-12-25" }
  ],
  "friday": [
    { "name": "Pull-ups", "group": "Back", "date": "2024-12-27" },
    { "name": "Deadlift", "group": "Back", "date": "2024-12-27" },
    { "name": "Rows", "group": "Back", "date": "2024-12-27" }
  ]
}
```

## Using the API (cURL examples)

### Create an exercise
```bash
curl -X POST http://localhost:8000/exercises \
  -H "Content-Type: application/json" \
  -b "access_token_cookie=YOUR_TOKEN" \
  -d '{
    "name": "Push-ups",
    "group": "Chest",
    "date": "2024-12-25"
  }'
```

### Get user with exercises
```bash
curl -X GET http://localhost:8000/me \
  -b "access_token_cookie=YOUR_TOKEN"
```

## Frontend TypeScript Interface

```typescript
interface Exercise {
  id: number
  name: string
  group: string
  date: string  // ISO format: "YYYY-MM-DD"
}

interface User {
  id: number
  username: string
  email: string
  exercises: Exercise[]
}
```

