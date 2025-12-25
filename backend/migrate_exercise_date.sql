-- Migration script to add exercise_date column to exercises table
-- Run this directly against your PostgreSQL database

-- Check if column already exists (optional - will error if exists, which is fine)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name='exercises' AND column_name='exercise_date'
    ) THEN
        -- Add the column with a default value for existing rows
        ALTER TABLE exercises 
        ADD COLUMN exercise_date DATE NOT NULL DEFAULT CURRENT_DATE;
        
        -- Remove the default after adding
        ALTER TABLE exercises 
        ALTER COLUMN exercise_date DROP DEFAULT;
        
        RAISE NOTICE 'Successfully added exercise_date column to exercises table!';
    ELSE
        RAISE NOTICE 'Column exercise_date already exists. Migration not needed.';
    END IF;
END $$;

