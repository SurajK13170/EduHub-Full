import React from 'react';
import { Link } from 'react-router-dom';

const navStyle = {
  backgroundColor: '#333',
  padding: '10px 0',
};

const ulStyle = {
  listStyleType: 'none',
  margin: 0,
  padding: 0,
};

const liStyle = {
  display: 'inline',
  margin: '0 10px',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
};

function AdminDashboard() {
  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Admin Dashboard</h1>
      <nav style={navStyle}>
        <ul style={ulStyle}>
          <li style={liStyle}>
            <Link to="/admin/add-leacture" style={linkStyle}>Add Lecture</Link>
          </li>
          <li style={liStyle}>
            <Link to="/admin/lecture-List" style={linkStyle}>Lecture List</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminDashboard;
