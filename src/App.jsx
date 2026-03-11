import { useEffect, useMemo, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'titulodno2:v1';
const now = () => new Date().toISOString();
const isUcEmail = (email) => /@uc\.cl$/i.test(email.trim());
const randomToken = () => crypto.randomUUID();

async function hashPassword(password, salt) {
  const input = new TextEncoder().encode(`${password}:${salt}`);
  const digest = await crypto.subtle.digest('SHA-256', input);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

const seed = {
  users: [
    { id: 'prof_demo', name: 'Profesora Demo', email: 'profesora.demo@uc.cl', role: 'professor', salt: 's1', hash: '' },
    { id: 'stu_demo', name: 'Estudiante Demo', email: 'estudiante.demo@uc.cl', role: 'student', salt: 's2', hash: '' },
  ],
  sections: [{ id: 'sec_demo', code: 'DIS301-D', name: 'Seminario de Título Demo', professorId: 'prof_demo' }],
  enrollments: [{ id: 'enr_demo', sectionId: 'sec_demo', studentId: 'stu_demo' }],
  invites: [],
  resources: [],
  files: [],
};

function readState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function writeState(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function Boot({ onReady }) {
  useEffect(() => {
    (async () => {
      const current = readState();
      if (!current) {
        const initial = structuredClone(seed);
        initial.users[0].hash = await hashPassword('Demo2026!', initial.users[0].salt);
        initial.users[1].hash = await hashPassword('Demo2026!', initial.users[1].salt);
        writeState(initial);
      }
      onReady();
    })();
  }, []);
  return <main className="shell">Inicializando plataforma…</main>;
}

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', inviteToken: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const db = readState();
    if (!isUcEmail(form.email)) return setError('Solo se aceptan correos institucionales @uc.cl.');
    const user = db.users.find((u) => u.email.toLowerCase() === form.email.toLowerCase());
    if (!user) return setError('Usuario no encontrado.');
    const hash = await hashPassword(form.password, user.salt);
    if (hash !== user.hash) return setError('Contraseña incorrecta.');
    sessionStorage.setItem('session_user_id', user.id);
    onLogin();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Ingresa nombre completo.');
    if (!isUcEmail(form.email)) return setError('Debes usar correo @uc.cl.');
    if (form.password.length < 10) return setError('La contraseña debe tener mínimo 10 caracteres.');
    const db = readState();

    if (db.users.find((u) => u.email.toLowerCase() === form.email.toLowerCase())) return setError('Ese correo ya está registrado.');
    const invite = db.invites.find((i) => i.token === form.inviteToken && i.email === form.email.toLowerCase() && !i.usedAt);
    if (!invite) return setError('Invitación inválida para ese correo.');
    if (new Date(invite.expiresAt) < new Date()) return setError('Invitación expirada.');

    const salt = randomToken();
    const id = `stu_${Date.now()}`;
    db.users.push({ id, name: form.name.trim(), email: form.email.toLowerCase(), role: 'student', salt, hash: await hashPassword(form.password, salt) });
    db.enrollments.push({ id: `enr_${Date.now()}`, sectionId: invite.sectionId, studentId: id });
    invite.usedAt = now();
    writeState(db);
    sessionStorage.setItem('session_user_id', id);
    onLogin();
  };

  return (
    <main className="shell auth">
      <h1>titulodno_2</h1>
      <p>Plataforma en español con 4 fases implementadas y acceso institucional.</p>
      <form className="card" onSubmit={mode === 'login' ? handleLogin : handleRegister}>
        <h2>{mode === 'login' ? 'Ingresar' : 'Registro por invitación'}</h2>
        {mode === 'register' && (
          <>
            <label>Nombre</label>
            <input value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
            <label>Token de invitación</label>
            <input value={form.inviteToken} onChange={(e) => setForm((s) => ({ ...s, inviteToken: e.target.value }))} required />
          </>
        )}
        <label>Correo institucional</label>
        <input type="email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
        <label>Contraseña</label>
        <input type="password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} required />
        {error && <p className="error">{error}</p>}
        <button type="submit">{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
      </form>
      <button className="link" onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}>
        {mode === 'login' ? '¿No tienes cuenta?' : 'Ya tengo cuenta'}
      </button>
      <small>Demo: profesora.demo@uc.cl / Demo2026!</small>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const [db, setDb] = useState(readState());
  const [inviteEmail, setInviteEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [resource, setResource] = useState({ title: '', desc: '', file: null });

  const section = useMemo(() => {
    if (user.role === 'professor') return db.sections.find((s) => s.professorId === user.id) || null;
    const enr = db.enrollments.find((e) => e.studentId === user.id);
    return db.sections.find((s) => s.id === enr?.sectionId) || null;
  }, [db, user]);

  const students = useMemo(() => {
    if (!section) return [];
    return db.enrollments
      .filter((e) => e.sectionId === section.id)
      .map((e) => db.users.find((u) => u.id === e.studentId))
      .filter(Boolean);
  }, [db, section]);

  const invites = db.invites.filter((i) => section && i.sectionId === section.id && !i.usedAt);

  const persist = (next) => {
    writeState(next);
    setDb(next);
  };

  const createInvite = () => {
    if (!isUcEmail(inviteEmail)) return setMsg('El correo debe terminar en @uc.cl.');
    const email = inviteEmail.toLowerCase();
    const next = structuredClone(db);
    if (next.users.some((u) => u.email === email)) return setMsg('Ese correo ya tiene cuenta.');
    const token = randomToken();
    next.invites.push({ id: `inv_${Date.now()}`, email, token, sectionId: section.id, createdAt: now(), expiresAt: new Date(Date.now() + 604800000).toISOString() });
    persist(next);
    setInviteEmail('');
    setMsg(`Invitación creada: ${token}`);
  };

  const addResource = () => {
    if (!resource.title.trim()) return;
    const next = structuredClone(db);
    const resId = `res_${Date.now()}`;
    next.resources.push({ id: resId, sectionId: section.id, title: resource.title.trim(), desc: resource.desc.trim(), by: user.name, at: now() });
    if (resource.file) {
      const reader = new FileReader();
      reader.onload = () => {
        next.files.push({ id: `file_${Date.now()}`, resourceId: resId, name: resource.file.name, size: resource.file.size, dataUrl: reader.result });
        persist(next);
        setResource({ title: '', desc: '', file: null });
      };
      reader.readAsDataURL(resource.file);
    } else {
      persist(next);
      setResource({ title: '', desc: '', file: null });
    }
  };

  const resources = db.resources.filter((r) => section && r.sectionId === section.id);

  return (
    <main className="shell">
      <header>
        <div>
          <h1>Seminario de Título UC</h1>
          <p>{user.name} · {user.role === 'professor' ? 'Profesor/a' : 'Estudiante'}</p>
        </div>
        <button onClick={onLogout}>Cerrar sesión</button>
      </header>
      <h2>Sección: {section?.code || 'Sin sección'}</h2>
      {msg && <p className="info">{msg}</p>}

      {user.role === 'professor' && (
        <section className="card">
          <h3>Fase 1: Registro + acceso por invitación segura</h3>
          <p>El registro exige token, validez temporal y correo institucional @uc.cl.</p>
          <div className="row">
            <input placeholder="nuevo.estudiante@uc.cl" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
            <button onClick={createInvite}>Generar invitación</button>
          </div>
          <ul>{invites.map((i) => <li key={i.id}>{i.email} — expira {new Date(i.expiresAt).toLocaleDateString('es-CL')}</li>)}</ul>
        </section>
      )}

      <section className="card">
        <h3>Fase 2: Datos estructurados</h3>
        <p>Usuarios, secciones, matrículas, invitaciones, recursos y archivos se guardan en un modelo unificado.</p>
        <p>Estudiantes inscritos: {students.length}</p>
      </section>

      <section className="card">
        <h3>Fase 3: Almacenamiento de archivos</h3>
        <input placeholder="Título recurso" value={resource.title} onChange={(e) => setResource((s) => ({ ...s, title: e.target.value }))} />
        <textarea placeholder="Descripción" value={resource.desc} onChange={(e) => setResource((s) => ({ ...s, desc: e.target.value }))} />
        <input type="file" onChange={(e) => setResource((s) => ({ ...s, file: e.target.files?.[0] || null }))} />
        <button onClick={addResource}>Guardar recurso</button>
        <ul>
          {resources.map((r) => {
            const file = db.files.find((f) => f.resourceId === r.id);
            return (
              <li key={r.id}>
                <b>{r.title}</b> ({r.by})
                {file && <a href={file.dataUrl} download={file.name}> {file.name}</a>}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="card">
        <h3>Fase 4: Usabilidad</h3>
        <p>Interfaz compacta en español, validaciones claras, navegación por rol y mensajes de estado.</p>
      </section>
    </main>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);

  const loadSession = () => {
    const db = readState();
    const uid = sessionStorage.getItem('session_user_id');
    setUser(uid ? db?.users.find((u) => u.id === uid) || null : null);
  };

  if (!ready) return <Boot onReady={() => { setReady(true); loadSession(); }} />;
  if (!user) return <Auth onLogin={loadSession} />;
  return <Dashboard user={user} onLogout={() => { sessionStorage.removeItem('session_user_id'); setUser(null); }} />;
}
