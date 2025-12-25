import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import type { UserData } from '../utils/api';
import './Home.css';

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [exerciseGroup, setExerciseGroup] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getMe();
      setUserData(data);
    } catch (err: any) {
      console.error('Failed to fetch user data:', err);
      setError(err?.message || 'Failed to load user data');
      if (err?.message?.includes('Unauthorized')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear cookies by setting them to expire
    document.cookie = 'access_token_cookie=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    navigate('/login');
  };

  const handleAddExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim() || !exerciseGroup.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await api.createExercise(exerciseName.trim(), exerciseGroup.trim());
      setExerciseName('');
      setExerciseGroup('');
      setShowAddForm(false);
      // Refresh user data to show new exercise
      await fetchUserData();
    } catch (err: any) {
      console.error('Failed to create exercise:', err);
      setError(err?.message || 'Failed to create exercise');
      if (err?.message?.includes('Unauthorized')) {
        navigate('/login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="home-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error && !userData) {
    return (
      <div className="home-container">
        <div className="home-content">
          <div className="error-message">{error}</div>
          <button onClick={() => navigate('/login')} className="button-primary">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <header className="home-header">
          <div>
            <h1>Welcome, {userData?.username}!</h1>
            <p className="user-email">{userData?.email}</p>
          </div>
          <button onClick={handleLogout} className="button-secondary">
            Logout
          </button>
        </header>

        <div className="exercises-section">
          <div className="exercises-header">
            <h2>My Exercises</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="button-primary"
            >
              {showAddForm ? 'Cancel' : '+ Add Exercise'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddExercise} className="add-exercise-form">
              <div className="form-group">
                <label htmlFor="exerciseName">Exercise Name</label>
                <input
                  type="text"
                  id="exerciseName"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  placeholder="e.g., Bench Press"
                  required
                  disabled={submitting}
                />
              </div>
              <div className="form-group">
                <label htmlFor="exerciseGroup">Muscle Group</label>
                <input
                  type="text"
                  id="exerciseGroup"
                  value={exerciseGroup}
                  onChange={(e) => setExerciseGroup(e.target.value)}
                  placeholder="e.g., Chest"
                  required
                  disabled={submitting}
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button
                type="submit"
                disabled={submitting}
                className="button-primary"
              >
                {submitting ? 'Adding...' : 'Add Exercise'}
              </button>
            </form>
          )}

          {userData && userData.exercises.length === 0 ? (
            <div className="empty-state">
              <p>No exercises yet. Add your first exercise to get started!</p>
            </div>
          ) : (
            <div className="exercises-grid">
              {userData?.exercises.map((exercise) => (
                <div key={exercise.id} className="exercise-card">
                  <h3>{exercise.name}</h3>
                  <span className="exercise-group">{exercise.group}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

