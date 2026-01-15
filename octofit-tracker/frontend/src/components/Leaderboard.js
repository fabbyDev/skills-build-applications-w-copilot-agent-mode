import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;
      console.log('Fetching Leaderboard from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched Leaderboard data:', data);
      
      // Handle both paginated (.results) and plain array responses
      const leaderboardList = data.results || data;
      setLeaderboard(Array.isArray(leaderboardList) ? leaderboardList : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="alert alert-info">Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card shadow mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="card-title mb-0 text-primary">Leaderboard</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchLeaderboard}>Refresh</button>
      </div>
      <div className="card-body">
        {leaderboard.length === 0 ? (
          <p className="text-muted">No leaderboard data found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Rank</th>
                  <th>User</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={entry.id || index}>
                    <td>{index + 1}</td>
                    <td>{entry.user_name || entry.username || 'Unknown'}</td>
                    <td>{entry.score || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
