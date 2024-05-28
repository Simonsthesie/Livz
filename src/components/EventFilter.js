// EventFilter.js
import React from 'react';

const EventFilter = ({ filter, setFilter }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <label htmlFor="event-filter" className="form-label me-3">Filtres:</label>
      <select
        id="event-filter"
        className="form-select"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ maxWidth: '200px' }}
      >
        <option value="all">Tous Les évenements</option>
        <option value="open">évenements Ouverts</option>
        <option value="closed">évenements Férmées</option>
      </select>
    </div>
  );
};

export default EventFilter;
