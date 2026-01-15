import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const apiUrl = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/activities/`;
      console.log('Fetching Activities from:', apiUrl);
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched Activities data:', data);
      
      // Handle both paginated (.results) and plain array responses
      const activitiesList = data.results || data;
      setActivities(Array.isArray(activitiesList) ? activitiesList : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.message);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="alert alert-info">Loading activities...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="card shadow mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h2 className="card-title mb-0 text-primary">Activities</h2>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchActivities}>Refresh</button>
      </div>
      <div className="card-body">
        {activities.length === 0 ? (
          <p className="text-muted">No activities found.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Duration (minutes)</th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr key={activity.id}>
                    <td>{activity.id}</td>
                    <td>{activity.name}</td>
                    <td>{activity.description}</td>
                    <td>{activity.duration}</td>
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

export default Activities;
