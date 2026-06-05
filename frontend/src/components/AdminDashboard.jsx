import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {

  const [results, setResults] = useState([]);

  useEffect(() => {

    fetch('http://localhost:5000/api/admin/results')
      .then(res => res.json())
      .then(data => {

        const sorted =
          [...data].sort(
            (a, b) =>
              b.finalScore - a.finalScore
          );

        setResults(sorted);

      });

  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#020617',
        color: '#fff',
        padding: '2rem'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          color: '#10b981',
          marginBottom: '2rem'
        }}
      >
        VIGILQUAD ANALYTICS
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(auto-fit,minmax(250px,1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div
          style={{
            background: '#0f172a',
            padding: '1.5rem',
            borderRadius: '16px'
          }}
        >
          <h3>Total Candidates</h3>
          <h2>{results.length}</h2>
        </div>

        <div
          style={{
            background: '#0f172a',
            padding: '1.5rem',
            borderRadius: '16px'
          }}
        >
          <h3>Highest Score</h3>
          <h2>
            {results.length
              ? results[0].finalScore
              : 0}
          </h2>
        </div>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#0f172a',
          borderRadius: '16px',
          overflow: 'hidden'
        }}
      >
        <thead>
          <tr>
  <th style={th}>Rank</th>
  <th style={th}>Username</th>
  <th style={th}>Score</th>
  <th style={th}>Answer Accuracy</th>
  <th style={th}>Calibration Accuracy</th>
  <th style={th}>Top Right Samples</th>
  <th style={th}>Bottom Right Samples</th>
  <th style={th}>Bottom Left Samples</th>
  <th style={th}>Warnings</th>
</tr>
        </thead>

        <tbody>
          {results.map((item, index) => (
            <tr key={index}>
              <td style={td}>
                {index === 0
                  ? '🥇'
                  : index === 1
                  ? '🥈'
                  : index === 2
                  ? '🥉'
                  : index + 1}
              </td>

              <td style={td}>
                {item.username}
              </td>

              <td style={td}>
                {item.finalScore}
              </td>

              <td style={td}>
  {item.answerAccuracy}%
</td>

<td style={td}>
  {item.calibrationAccuracy}%
</td>

<td style={td}>
  {item.topRightSamples}
</td>

<td style={td}>
  {item.bottomRightSamples}
</td>

<td style={td}>
  {item.bottomLeftSamples}
</td>

<td style={td}>
  {item.warnings}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  padding: '1rem',
  background: '#10b981',
  color: '#020617'
};

const td = {
  padding: '1rem',
  textAlign: 'center',
  borderBottom: '1px solid #1e293b'
};