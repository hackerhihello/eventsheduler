"use client";

import { useState, useEffect } from "react";
import { getEvents, deleteEvent } from '../api/events'; // Adjust the path as necessary
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faArrowLeft, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"; 
import Link from "next/link";

interface Event {
  _id: string;
  title: string;
  start: string;
  end: string;
  userId: string;
}

const EventList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getToken = () => localStorage.getItem('authToken');
  const getUserId = () => localStorage.getItem('user'); 
  const storedToken = getToken();
  const storedUserId = getUserId(); 
  
  useEffect(() => {
    const fetchEvents = async () => {
      if (!storedToken || !storedUserId) {
        console.error("No token or userId found.");
        return;
      }

      try {
        const fetchedEvents = await getEvents(storedToken, storedUserId);
        setEvents(fetchedEvents);
      } catch (err) {
        setError("Failed to fetch events");
      } finally {
        setLoading(false);
      }
    };

    if (storedToken && storedUserId) {
      fetchEvents();
    } else {
      setError("No authentication token or userId found.");
      setLoading(false);
    }
  }, [storedToken, storedUserId]);

  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.start);
    return (
      eventDate.toLocaleDateString().includes(searchTerm) ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleEdit = (id: string) => {
    console.log("Edit event with ID:", id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      try {
        await deleteEvent(id, storedToken!);
        setEvents(events.filter(event => event._id !== id));
      } catch (err) {
        setError("Failed to delete event");
      }
    }
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-5">
      <div className="mb-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out">
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          <Link href="/home">Back to Dashboard</Link>
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-5">Event List</h1>
      <input
        type="text"
        placeholder="Search by date (MM/DD/YYYY) or title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded mb-4 w-full"
      />
      {filteredEvents.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul className="list-disc pl-5">
          {filteredEvents.map((event) => (
            <li key={event._id} className="mb-2">
              <h2 className="font-semibold">{event.title}</h2>
              <p>
                Start: {new Date(event.start).toLocaleString()} <br />
                End: {new Date(event.end).toLocaleString()}
              </p>
              <div className="mt-2">
                <button
                  onClick={() => handleEdit(event._id)}
                  className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventList;
