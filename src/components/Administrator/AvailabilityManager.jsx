import React, { useState, useEffect } from "react";
import { firestore } from "../../firebase-config";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const AvailabilityManager = () => {
  const [selectedCity, setSelectedCity] = useState("Barcelona");
  const [mode, setMode] = useState("manual"); // "manual" o "rango"
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);
  const [returnDate, setReturnDate] = useState(new Date().toISOString().split("T")[0]);
  const [rangeStart, setRangeStart] = useState(new Date().toISOString().split("T")[0]);
  const [rangeEnd, setRangeEnd] = useState(new Date().toISOString().split("T")[0]);
  const [timeSlotsEntry, setTimeSlotsEntry] = useState([]);
  const [newSlot, setNewSlot] = useState("");
  const [maxBookings, setMaxBookings] = useState(5);
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    const snapshot = await getDocs(collection(firestore, "availability"));
    const data = {};
    snapshot.forEach((docSnap) => {
      const [city, date] = docSnap.id.split("_");
      if (!data[city]) data[city] = {};
      data[city][date] = docSnap.data();
    });
    setAvailability(data);
  };

  const handleSave = async () => {
    let datesToSave = [];

    if (mode === "rango") {
  // Al guardar fechas en rango
let start = new Date(rangeStart);
let end = new Date(rangeEnd);

// Normalizamos hora
start.setHours(0, 0, 0, 0);
end.setHours(0, 0, 0, 0);

while (start <= end) {
  // Restamos 1 día para ajustar visualmente
  const adjustedDate = new Date(start);
  adjustedDate.setDate(adjustedDate.getDate() - 1);

  const dateStr = adjustedDate.toISOString().split("T")[0];
  datesToSave.push({
    date: dateStr,
    slots: timeSlotsEntry
  });

  start.setDate(start.getDate() + 1);
}




    } else {
      datesToSave = [
        { date: entryDate, slots: timeSlotsEntry }
      ];
    }

    for (let d of datesToSave) {
      if (!d.date) continue;
      const docId = `${selectedCity}_${d.date}`;
      await setDoc(doc(firestore, "availability", docId), {
        available: true,
        timeSlots: d.slots,
        maxBookings,
        bookedCount: availability[selectedCity]?.[d.date]?.bookedCount || 0
      });
    }

    fetchAvailability();
    setTimeSlotsEntry([]);
    setNewSlot("");
  };

  const handleToggleAvailability = async (city, dateKey) => {
    const docId = `${city}_${dateKey}`;
    await updateDoc(doc(firestore, "availability", docId), {
      available: !availability[city][dateKey].available
    });
    fetchAvailability();
  };

  const handleDeleteDate = async (city, dateKey) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar la fecha ${dateKey} de ${city}?`
    );
    if (!confirmDelete) return;

    const docId = `${city}_${dateKey}`;
    await deleteDoc(doc(firestore, "availability", docId));
    fetchAvailability();
  };

  // Función para añadir un nuevo horario
  const handleAddSlot = () => {
    if (!newSlot) return;

    if (mode === "manual") {
      // Para entrada
      if (!timeSlotsEntry.includes(newSlot)) {
        setTimeSlotsEntry([...timeSlotsEntry, newSlot]);
      }
     
    } else {
      // Para modo rango
      if (!timeSlotsEntry.includes(newSlot)) {
        setTimeSlotsEntry([...timeSlotsEntry, newSlot]);
      }
    }

    setNewSlot("");
  };

  return (
    <div className="availability-manager">
      <h2>Gestión de Fechas y Horarios</h2>

      {/* Selección de ciudad */}
      <div className="city-picker mb-3">
        <label>Selecciona la ciudad:</label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="form-select"
        >
          <option value="Barcelona">Barcelona</option>
          <option value="Mataró">Mataró</option>
        </select>
      </div>

      {/* Modo de gestión */}
      <div className="mode-picker mb-4">
        <label>Modo de gestión:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="form-select"
        >
          <option value="manual">Fechas manuales</option>
          <option value="rango">Rango de fechas</option>
        </select>
      </div>

      {/* Modo rango */}
      {mode === "rango" && (
        <>
          <div className="date-picker mb-3">
            <label>Fecha inicio:</label>
            <input
              type="date"
              value={rangeStart}
              onChange={(e) => {
                setRangeStart(e.target.value);
                if (new Date(e.target.value) > new Date(rangeEnd)) {
                  setRangeEnd(e.target.value);
                }
              }}
              className="form-control"
            />
          </div>
          <div className="date-picker mb-3">
            <label>Fecha fin:</label>
            <input
              type="date"
              value={rangeEnd}
              min={rangeStart}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="form-control"
            />
          </div>

          {/* Horarios para rango */}
          <div className="time-slots mb-3">
            <label>Horarios disponibles:</label>
            <div className="slot-input d-flex mb-2">
              <input
                type="time"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="form-control me-2"
              />
              <button className="btn btn-primary" onClick={handleAddSlot}>
                Añadir horario
              </button>
            </div>
            <div className="slots-list">
              {timeSlotsEntry.map((slot) => (
                <span key={slot} className="badge bg-secondary me-2 mb-1">
                  {slot}{" "}
                  <button
                    className="btn btn-sm btn-light ms-1"
                    onClick={() =>
                      setTimeSlotsEntry(timeSlotsEntry.filter((s) => s !== slot))
                    }
                  >
                    ❌
                  </button>
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modo manual */}
      {mode === "manual" && (
        <>
          <div className="date-picker mb-3">
            <label>Fecha de entrada:</label>
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="time-slots mb-3">
            <label>Horarios de entrada:</label>
            <div className="slot-input d-flex mb-2">
              <input
                type="time"
                value={newSlot}
                onChange={(e) => setNewSlot(e.target.value)}
                className="form-control me-2"
              />
              <button className="btn btn-primary" onClick={() => {
                if (newSlot && !timeSlotsEntry.includes(newSlot)) {
                  setTimeSlotsEntry([...timeSlotsEntry, newSlot]);
                  setNewSlot("");
                }
              }}>
                Añadir horario
              </button>
            </div>
            <div className="slots-list">
              {timeSlotsEntry.map((slot) => (
                <span key={slot} className="badge bg-secondary me-2 mb-1">
                  {slot}{" "}
                  <button
                    className="btn btn-sm btn-light ms-1"
                    onClick={() =>
                      setTimeSlotsEntry(timeSlotsEntry.filter((s) => s !== slot))
                    }
                  >
                    ❌
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="date-picker mb-3">
            <label>Fecha de devolución:</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="form-control"
            />
          </div>
        </>
      )}

      {/* Cupo máximo */}
      <div className="max-bookings mb-3">
        <label>Cupo máximo por día:</label>
        <input
          type="number"
          value={maxBookings}
          onChange={(e) => setMaxBookings(Number(e.target.value))}
          className="form-control"
        />
      </div>

      <button className="btn btn-success mb-4" onClick={handleSave}>
        Guardar disponibilidad
      </button>

      <h3>Fechas configuradas</h3>
      <ul className="availability-list list-group">
        {Object.keys(availability).map((city) =>
          Object.keys(availability[city]).map((dateKey) => (
            <li
              key={`${city}_${dateKey}`}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{city}</strong> - {dateKey} —{" "}
                {availability[city][dateKey].available ? "✅ Disponible" : "❌ Bloqueado"}{" "}
                ({availability[city][dateKey].bookedCount} reservas)
                <br />
                Horarios: {availability[city][dateKey].timeSlots.join(", ")}
              </span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleToggleAvailability(city, dateKey)}
                >
                  {availability[city][dateKey].available ? "Bloquear" : "Desbloquear"}
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteDate(city, dateKey)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default AvailabilityManager;
