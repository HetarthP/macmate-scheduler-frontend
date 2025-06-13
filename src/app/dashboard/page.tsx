

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface ScheduleItem {
  id: number;
  title: string;
  type: string;
  courseCode: string;
  dueDate: string;
  notes: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: string;
  courseCode: string;
  notes: string;
}

const CustomToolbar = ({ label, onNavigate }: any) => (
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    borderRadius: "12px",
    background: "linear-gradient(to right, #7A003C, #FF4081)",
    color: "white",
    fontWeight: "bold",
    fontSize: "1.2rem"
  }}>
    <button onClick={() => onNavigate("PREV")} style={{ background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}>←</button>
    <span>{label}</span>
    <button onClick={() => onNavigate("NEXT")} style={{ background: "none", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer" }}>→</button>
  </div>
);

export default function Dashboard() {
  const router = useRouter();

  const [items, setItems] = useState<ScheduleItem[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState<"month" | "week" | "day" | "agenda">("month");

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "",
    courseCode: "",
    dueDate: "",
    notes: "",
  });

  useEffect(() => {
    const verifyAndFetch = async () => {
      const token = localStorage.getItem("jwt");
      if (!token) return router.push("/login");

      try {
        const res = await fetch("https://macmate-scheduler-backend.onrender.com/auth/protected", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const text = await res.text();
        if (text.startsWith("❌")) {
          localStorage.removeItem("jwt");
          router.push("/login");
        } else {
          fetchItems(token);
        }
      } catch {
        localStorage.removeItem("jwt");
        router.push("/login");
      }
    };

    verifyAndFetch();
  }, []);

  const fetchItems = async (token: string) => {
    try {
      const res = await fetch("https://macmate-scheduler-backend.onrender.com/schedule", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(data);
      setEvents(
        data.map((item: ScheduleItem) => ({
          id: item.id,
          title: item.title,
          start: new Date(item.dueDate + "T00:00:00"),
          end: new Date(item.dueDate + "T00:00:00"),
          allDay: true,
          type: item.type,
          courseCode: item.courseCode,
          notes: item.notes,
        }))
      );
    } catch (err) {
      console.error("🔥 Error fetching schedule:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async () => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    const url = selectedEvent
  ? `https://macmate-scheduler-backend.onrender.com/schedule/update/${selectedEvent.id}`
  : "https://macmate-scheduler-backend.onrender.com/schedule/add";

    const method = selectedEvent ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedItem = await res.json();
        const updatedEvent: CalendarEvent = {
          id: updatedItem.id,
          title: updatedItem.title,
          start: new Date(updatedItem.dueDate + "T00:00:00"),
          end: new Date(updatedItem.dueDate + "T00:00:00"),
          allDay: true,
          type: updatedItem.type,
          courseCode: updatedItem.courseCode,
          notes: updatedItem.notes,
        };

        if (selectedEvent) {
          setItems(items.map((item) => item.id === updatedItem.id ? updatedItem : item));
          setEvents(events.map((e) => e.id === updatedItem.id ? updatedEvent : e));
        } else {
          setItems([...items, updatedItem]);
          setEvents([...events, updatedEvent]);
        }

        setFormData({ title: "", type: "", courseCode: "", dueDate: "", notes: "" });
        setSelectedEvent(null);
        setShowForm(false);
      } else {
        alert("❌ Failed to save event");
      }
    } catch (err) {
      console.error("🔥 Error saving event:", err);
    }
  };

  const handleDelete = async (eventToDelete: CalendarEvent) => {
    const token = localStorage.getItem("jwt");
    if (!token) return;

    try {
      const res = await fetch(`https://macmate-scheduler-backend.onrender.com/schedule/delete/${eventToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setItems(items.filter((item) => item.id !== eventToDelete.id));
        setEvents(events.filter((e) => e.id !== eventToDelete.id));
        setSelectedEvent(null);
      } else {
        alert("❌ Failed to delete event");
      }
    } catch (err) {
      console.error("🔥 Error deleting event:", err);
    }
  };

  const handleEdit = (eventToEdit: CalendarEvent) => {
    setFormData({
      title: eventToEdit.title,
      type: eventToEdit.type,
      courseCode: eventToEdit.courseCode,
      dueDate: eventToEdit.start.toISOString().slice(0, 10),
      notes: eventToEdit.notes,
    });
    setSelectedEvent(eventToEdit);
    setShowForm(true);
  };

  return (
  <div style={{ padding: "2rem", backgroundColor: "#121212", color: "white", minHeight: "100vh" }}>
    
    {/* Header with logo and title */}
    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
      <div style={{
        width: "48px",
        height: "48px",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)"
      }}>
        <img
          src="/mcmaster.jpg"
          alt="McMaster Logo"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: "bold",
        background: "linear-gradient(to right, #7A003C, #FF4081)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        margin: 0
      }}>
        MacMate Scheduler
      </h1>
    </div>

    {/* Logout button */}
    <button
      onClick={() => {
        localStorage.removeItem("jwt");
        router.push("/login");
      }}
      style={{
        backgroundColor: "#e74c3c",
        color: "white",
        padding: "0.5rem 1rem",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "1rem"
      }}
    >
      🚪 Logout
    </button>


      <button
        onClick={() => { setShowForm(true); setSelectedEvent(null); }}
        style={{ backgroundColor: "#7A003C", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", border: "none", cursor: "pointer", marginBottom: "1rem" }}
      >
        ➕ Add Event
      </button>

      {showForm && (
        <div style={{ marginBottom: "2rem", backgroundColor: "#fff", color: "#000", borderRadius: "12px", padding: "1rem" }}>
          <input placeholder="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          <input placeholder="Type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
          <input placeholder="Course Code" value={formData.courseCode} onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })} />
          <input type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
          <input placeholder="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          <button onClick={handleAddEvent}>✅ {selectedEvent ? "Update" : "Submit"}</button>
          <button onClick={() => { setShowForm(false); setSelectedEvent(null); }}>❌ Cancel</button>
        </div>
      )}

      <div style={{ backgroundColor: "#fff", borderRadius: "12px", padding: "1rem", color: "#000" }}>
        <Calendar
          localizer={localizer}
          events={events}
          view={calendarView}
          onView={(view) => setCalendarView(view)}
          date={calendarDate}
          onNavigate={(date) => setCalendarDate(date)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          components={{ toolbar: CustomToolbar }}
          onSelectEvent={(event: CalendarEvent) => setSelectedEvent(event)}
          eventPropGetter={(event: CalendarEvent) => {
            let backgroundColor = "#3174ad";
            if (event.type === "Exam") backgroundColor = "#ff4d4f";
            else if (event.type === "Assignment") backgroundColor = "#52c41a";
            else if (event.type === "Reminder") backgroundColor = "#faad14";
            return { style: { backgroundColor } };
          }}
        />
      </div>

      {selectedEvent && !showForm && (
        <div style={{ backgroundColor: "#fff", color: "#000", padding: "1rem", borderRadius: "10px", marginTop: "1rem" }}>
          <h3>Event Details</h3>
          <p><strong>Title:</strong> {selectedEvent.title}</p>
          <p><strong>Type:</strong> {selectedEvent.type}</p>
          <p><strong>Course Code:</strong> {selectedEvent.courseCode}</p>
          <p><strong>Due Date:</strong> {selectedEvent.start.toDateString()}</p>
          <p><strong>Notes:</strong> {selectedEvent.notes}</p>
          <button onClick={() => handleEdit(selectedEvent)}>✏️ Edit</button>
          <button onClick={() => handleDelete(selectedEvent)}>🗑 Delete</button>
          <button onClick={() => setSelectedEvent(null)}>❌ Close</button>
        </div>
      )}
    </div>
  );
}