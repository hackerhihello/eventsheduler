  "use client";
  import React, { useState, useEffect } from "react";
  import Sidebar from "../Sidebar"; // Ensure this points to your Sidebar component
  import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
  } from "recharts";
  import Calendar from "react-calendar";
  import 'react-calendar/dist/Calendar.css';
  import { useRouter } from "next/navigation";

  const AdminDashboard: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [calendarValue, setCalendarValue] = useState(new Date());
    const router = useRouter();

    useEffect(() => {
      const token = document.cookie.split('; ').find(row => row.startsWith('authToken'));
      const userData = localStorage.getItem("user");
  
      if (!token || !userData) {
        // Redirect to login if token or user data is missing
        router.push("/login");
      } else {
        setUsers(JSON.parse(userData)); // Set the user if available
      }
    }, [router]);

    useEffect(() => {
      // Fetch users and requests from an API (dummy data here)
      const fetchUsers = async () => {
        const fetchedUsers = await new Promise(resolve =>
          setTimeout(() => resolve([
            { name: "John Doe", role: "Admin" },
            { name: "Jane Smith", role: "User" },
          ]), 1000)
        );
        setUsers(fetchedUsers as any);
      };

      fetchUsers();

      // Example pending requests
      setPendingRequests([
        { user: "Alice Johnson", position: "Frontend Developer", date: "Sep 24, 2024", status: "Pending" },
        { user: "Bob Brown", position: "SQL Developer", date: "Sep 30, 2024", status: "Approved" },
      ]);
    }, []);

    const data = [
      { name: "Jan", users: 30 },
      { name: "Feb", users: 40 },
      { name: "Mar", users: 50 },
    ];

    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-grow ml-64 ml-4 p-6" style={{marginLeft:'250px'}}> {/* Add mr-4 for right margin */}
        {/* <div className="flex-grow bg-gray-100 min-h-screen p-4"> */}
          <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-md shadow-md">
              <h3 className="text-lg font-medium mb-2">Total Users</h3>
              <p className="text-2xl">{users.length}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <h3 className="text-lg font-medium mb-2">Pending Requests</h3>
              <p className="text-2xl">{pendingRequests.length}</p>
            </div>
            <div className="bg-white p-4 rounded-md shadow-md">
              <h3 className="text-lg font-medium mb-2">Interviews Today</h3>
              <p className="text-2xl">15</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded-md shadow-md">
              <h3 className="text-lg font-medium mb-2">User Growth</h3>
              <BarChart width={400} height={200} data={data}>
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

          <div className="bg-white p-6 rounded-md shadow-md mb-8">
            <h2 className="text-lg font-medium mb-4">Recent Interview Requests</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="py-2 px-4 text-left">User</th>
                  <th className="py-2 px-4 text-left">Position</th>
                  <th className="py-2 px-4 text-left">Date</th>
                  <th className="py-2 px-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map((request, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4">{request.user}</td>
                    <td className="py-2 px-4">{request.position}</td>
                    <td className="py-2 px-4">{request.date}</td>
                    <td className="py-2 px-4">{request.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        {/* </div> */}
        </div>
      </div>
    );
  };

  export default AdminDashboard;
