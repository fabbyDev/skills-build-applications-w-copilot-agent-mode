import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/teams/`;
      console.log('Fetching Teams from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched Teams data:', data);
      
      // Handle both paginated (.results) and plain array responses
      const teamsList = data.results || data;
      setTeams(Array.isArray(teamsList) ? teamsList : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError(error.message);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="alert alert-info">Loading teams...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card shadow mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="card-title mb-0 text-primary">Teams</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchTeams}>Refresh</button>
      </div>
      <div className="card-body">
        {teams.length === 0 ? (
          <p className="text-muted">No teams found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td>{team.id}</td>
                    <td>{team.name}</td>
                    <td>{team.description}</td>
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

export default Teams;
