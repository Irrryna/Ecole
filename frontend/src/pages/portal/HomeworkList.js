// src/pages/portal/HomeworkList.js
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function HomeworkList(){
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const classId = ""; // TODO: sélectionner la classe de l'enfant

  useEffect(()=>{
    fetch(`${process.env.REACT_APP_API_URL || ""}/homework/class/${classId}`,{
      headers:{ Authorization: `Bearer ${token}` }
    }).then(r=>r.json()).then(setItems);
  },[token, classId]);

  return (
    <div>
      <h2>Devoirs</h2>
      <table className="table">
        <thead><tr><th>Titre</th><th>À rendre</th><th>Description</th></tr></thead>
        <tbody>
          {items.map(h=>(
            <tr key={h._id}>
              <td>{h.title}</td>
              <td>{h.dueDate ? new Date(h.dueDate).toLocaleDateString() : "—"}</td>
              <td>{h.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
