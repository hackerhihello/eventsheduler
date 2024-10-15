"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { fetchUsers } from "../api/userapi"; // Adjust the import path
import { fetchMentors } from "../api/mentor"; // Adjust the import path
import { fetchCoAdmins } from "../api/coAdmin"; // Adjust the import path
import { getEvents } from "../api/events"; // Adjust the import path

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [coAdmins, setCoAdmins] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [calendarValue, setCalendarValue] = useState(new Date());
  const token = "YOUR_AUTH_TOKEN"; // Replace with actual token management

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await fetchUsers();
        const mentorsData = await fetchMentors();
        const coAdminsData = await fetchCoAdmins();
        const eventsData = await getEvents(token, "YOUR_USER_ID"); // Replace with actual user ID

        setUsers(usersData);
        setMentors(mentorsData);
        setCoAdmins(coAdminsData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const data = [
    { name: "Jan", users: users.length },
    { name: "Feb", users: users.length + 10 }, // Example data
    { name: "Mar", users: users.length + 20 }, // Example data
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow ml-64 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-medium mb-2">Total Users</h3>
            <p className="text-2xl">{users.length}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-medium mb-2">Total Mentors</h3>
            <p className="text-2xl">{mentors.length}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-medium mb-2">Total Co-Admins</h3>
            <p className="text-2xl">{coAdmins.length}</p>
          </div>
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-medium mb-2">Total Events</h3>
            <p className="text-2xl">{events.length}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-medium mb-2">User Growth</h3>
            <BarChart width="100%" height={200} data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="users" fill="#8884d8" />
            </BarChart>
          </div>
          <div className="bg-white p-4 rounded-md shadow-md">
            <h3 className="text-lg font-medium mb-2">Schedule</h3>
            <Calendar onChange={setCalendarValue} value={calendarValue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
