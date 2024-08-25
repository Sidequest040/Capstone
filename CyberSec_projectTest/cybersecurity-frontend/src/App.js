// src/App.js
import React from 'react';
import Dashboard from './components/Dashboard';
import UserList from './components/UserList';
import AddUser from './components/AddUser';

function App() {
    return (
        <div className="App">
            <h1>Cybersecurity Dashboard</h1>
            <Dashboard />
            <UserList />
            <AddUser />
        </div>
    );
}

export default App;
