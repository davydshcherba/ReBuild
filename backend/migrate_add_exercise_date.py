"""
Migration script to add exercise_date column to exercises table
Run this once to update your existing database schema.
"""
from app.core.database import engine
from sqlalchemy import text

def migrate():
    """Add exercise_date column to exercises table"""
    with engine.begin() as conn:
        try:
            # Check if column already exists
            result = conn.execute(text("""
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name='exercises' AND column_name='exercise_date'
            """))
            
            if result.fetchone():
                print("Column 'exercise_date' already exists. Migration not needed.")
                return
            
            # Add the column with a default value for existing rows
            conn.execute(text("""
                ALTER TABLE exercises 
                ADD COLUMN exercise_date DATE NOT NULL DEFAULT CURRENT_DATE
            """))
            
            # Remove the default after adding (optional, but cleaner)
            conn.execute(text("""
                ALTER TABLE exercises 
                ALTER COLUMN exercise_date DROP DEFAULT
            """))
            
            print("Successfully added 'exercise_date' column to exercises table!")
            
        except Exception as e:
            print(f"Error during migration: {e}")
            raise

if __name__ == "__main__":
    migrate()

