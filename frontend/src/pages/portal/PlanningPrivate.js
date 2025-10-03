// src/pages/portal/PlanningPrivate.js
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function PlanningPrivate(){
  const { token } = useAuth();
  const API = process.env.REACT_APP_API_URL || "";
  const [slots, setSlots] = useState([]);

  const load = ()=> fetch(`${API}/planning`).then(r=>r.json()).then(setSlots);
  const signup = async(id)=> {
    await fetch(`${API}/planning/${id}/signup`,{
      method:"POST", headers:{ Authorization:`Bearer ${token}`, "Content-Type":"application/json" },
      body: JSON.stringify({ note:"" })
    });
    load();
  };

  useEffect(load,[]);

  return (
    <div>
      <h2>Planning familial</h2>
      <table className="table">
        <thead><tr><th>Date</th><th>Tâche</th><th>Places</th><th>Actions</th></tr></thead>
        <tbody>
          {slots.map(s=>(
            <tr key={s._id}>
              <td>{new Date(s.date).toLocaleString()}</td>
              <td>{s.task}</td>
              <td>{(s.signups?.length||0)} / {s.capacity}</td>
              <td>
                <button className="btn btn--outline" onClick={()=>signup(s._id)} disabled={(s.signups?.length||0)>=s.capacity}>S’inscrire</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
