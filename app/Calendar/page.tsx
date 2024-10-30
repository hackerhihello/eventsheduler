"use client";

import { useState, Fragment, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog, Transition } from "@headlessui/react";
import { CSSTransition } from "react-transition-group";
import { FiAlertTriangle } from "react-icons/fi";
import Sidebar from "../Sidebar";
import { createEvent, deleteEvent, getEvents, editEvent } from '../api/events';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  _id: string;
  userId?: string;
  description?: string; // Add this field if needed
}

export default function Home() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: new Date(),
    end: new Date(),
    _id: "",
    description: "", // Initialize the description
  });

  const getToken = () => localStorage.getItem('authToken');

  const fetchEvents = async () => {
    const storedToken = getToken();
    const storedUserId = localStorage.getItem('userId');

    if (!storedToken || !storedUserId) {
      console.error("No token or user ID found.");
      return;
    }

    try {
      const eventsData = await getEvents(storedToken, storedUserId);
      setAllEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setNewEvent({ title: "", start: slotInfo.start, end: slotInfo.end, _id: "", description: "" });
    setShowModal(true);
  };

  const handleEventAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const storedUser = localStorage.getItem('user');
    let userId = '';
  
    if (storedUser) {
      const user = JSON.parse(storedUser);
      userId = user.id; // Access user ID
    }
  
    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description,
        start: newEvent.start.toISOString(),
        end: newEvent.end.toISOString(),
        userId,
        date: newEvent.start.toISOString().split('T')[0], // Assuming date is derived from start
      };
  
      const savedEvent = await createEvent(eventData, getToken()!);
      setAllEvents([...allEvents, savedEvent]);
      setShowModal(false);
      setNewEvent({ title: "", start: new Date(), end: new Date(), _id: "", description: "" });
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };
  

  const handleSelectEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowDeleteModal(true);
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent && selectedEvent._id) {
      try {
        await deleteEvent(selectedEvent._id, getToken()!);
        await fetchEvents();
        setShowDeleteModal(false);
        setSelectedEvent(null);
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  const handleEditEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedEvent) {
      try {
        const updatedEventData = { ...selectedEvent, ...newEvent };
        const updatedEvent = await editEvent(selectedEvent._id, updatedEventData, getToken()!);
        const updatedEvents = allEvents.map((event) => (event._id === updatedEvent._id ? updatedEvent : event));
        setAllEvents(updatedEvents);
        setShowModal(false);
        setNewEvent({ title: "", start: new Date(), end: new Date(), _id: "", description: "" });
        setSelectedEvent(null);
      } catch (error) {
        console.error("Error editing event:", error);
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-grow ml-64 p-20 bg-gradient-to-br from-blue-900 via-purple-600 to-pink-500">
        <div className="flex justify-center">
          <div className="lg:w-8/12 bg-white bg-opacity-90 rounded-lg shadow-2xl p-10">
            <Calendar
              localizer={localizer}
              events={allEvents}
              selectable
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              views={["month", "week", "day"]}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </div>

        {/* Event Creation Modal */}
        <CSSTransition in={showModal} timeout={300} classNames="fade" unmountOnExit>
          <Transition.Root show={showModal} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={() => setShowModal(false)}>
              <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex items-center justify-center min-h-full p-4 text-center">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Dialog.Panel className="bg-white rounded-lg p-6 shadow-2xl">
                      <form onSubmit={handleEventAdd}>
                        <h3 className="font-bold text-lg mb-4">Create New Event</h3>
                        <input
                          type="text"
                          className="border border-gray-300 p-2 w-full rounded focus:ring-4 focus:ring-green-300"
                          placeholder="Event Title"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          required
                        />
                        <input
                          type="text"
                          className="border border-gray-300 p-2 w-full rounded focus:ring-4 focus:ring-green-300 mt-2"
                          placeholder="Description"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        />
                        <div className="mt-4">
                          <label className="block text-gray-700">Start Time:</label>
                          <DatePicker
                            selected={newEvent.start}
                            onChange={(date) => setNewEvent({ ...newEvent, start: date! })}
                            showTimeSelect
                            dateFormat="Pp"
                            className="border border-gray-300 p-2 w-full rounded focus:ring-4 focus:ring-green-300"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-gray-700">End Time:</label>
                          <DatePicker
                            selected={newEvent.end}
                            onChange={(date) => setNewEvent({ ...newEvent, end: date! })}
                            showTimeSelect
                            dateFormat="Pp"
                            className="border border-gray-300 p-2 w-full rounded focus:ring-4 focus:ring-green-300"
                          />
                        </div>
                        <div className="mt-4 flex justify-end space-x-4">
                          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
                          <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                      </form>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </CSSTransition>

        {/* Delete Confirmation Modal */}
        {selectedEvent && (
          <CSSTransition in={showDeleteModal} timeout={300} classNames="fade" unmountOnExit>
            <Transition.Root show={showDeleteModal} as={Fragment}>
              <Dialog as="div" className="relative z-10" onClose={() => setShowDeleteModal(false)}>
                <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
                <div className="fixed inset-0 z-10 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-full p-4 text-center">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Dialog.Panel className="bg-white rounded-lg p-6 shadow-2xl">
                        <div className="text-center">
                          <FiAlertTriangle className="text-red-500 mx-auto mb-4 h-12 w-12" />
                          <h3 className="font-bold text-lg">Delete Event</h3>
                          <p>Are you sure you want to delete this event?</p>
                          <div className="mt-4 flex justify-center space-x-4">
                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleDeleteEvent}>Delete</button>
                            <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </Dialog>
            </Transition.Root>
          </CSSTransition>
        )}
      </main>
    </div>
  );
}
