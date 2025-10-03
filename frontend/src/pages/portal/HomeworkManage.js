// src/pages/portal/HomeworkManage.js
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function HomeworkManage(){
  const { token } = useAuth();
  const API = process.env.REACT_APP_API_URL || "";
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ title:"", description:"", dueDate:"", classId:"" });

  const load = ()=> fetch(`${API}/homework/class/${form.classId || "all"}`).then(r=>r.json()).then(setList);

  const save = async(e)=>{
    e.preventDefault();
    const res = await fetch(`${API}/homework`,{
      method:"POST",
      headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
      body: JSON.stringify(form)
    });
    if(res.ok){ setForm({ title:"", description:"", dueDate:"", classId:"" }); load(); }
  };

  useEffect(()=>{ /* charge la liste */ },[]);

  return (
    <div className="grid-2">
      <form className="card form" onSubmit={save}>
        <h3>Ajouter un devoir</h3>
        <label>Titre<input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} /></label>
        <label>Classe<input value={form.classId} onChange={e=>setForm({...form, classId:e.target.value})} placeholder="ObjectId classe" /></label>
        <label>À rendre le<input type="date" value={form.dueDate} onChange={e=>setForm({...form, dueDate:e.target.value})} /></label>
        <label>Description<textarea rows="3" value={form.description} onChange={e=>setForm({...form, description:e.target.value})} /></label>
        <button className="btn">Enregistrer</button>
      </form>
      <div className="card">
        <h3>Liste</h3>
        {/* table comme plus haut */}
      </div>
    </div>
  );
}
