import { useEffect, useMemo, useState } from 'react';
import './App.css';

const STORAGE_KEY = 'titulodno2:v2';
const SESSION_KEY = 'session_user_id';
const MAX_FILE_SIZE = 1_500_000;
const now = () => new Date().toISOString();
const isUcEmail = (email) => /@uc\.cl$/i.test((email || '').trim());
const normalizeEmail = (email) => (email || '').trim().toLowerCase();
const randomToken = () => (globalThis.crypto?.randomUUID?.() || `tok_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`);

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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeState(next) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function ensureShape(raw) {
  const base = raw && typeof raw === 'object' ? raw : {};
  return {
    users: Array.isArray(base.users) ? base.users : [],
    sections: Array.isArray(base.sections) ? base.sections : [],
    enrollments: Array.isArray(base.enrollments) ? base.enrollments : [],
    invites: Array.isArray(base.invites) ? base.invites : [],
    resources: Array.isArray(base.resources) ? base.resources : [],
    files: Array.isArray(base.files) ? base.files : [],
  };
}

function Boot({ onReady }) {
  useEffect(() => {
    (async () => {
      const current = ensureShape(readState());
      if (current.users.length === 0) {
        const initial = structuredClone(seed);
        initial.users[0].hash = await hashPassword('Demo2026!', initial.users[0].salt);
        initial.users[1].hash = await hashPassword('Demo2026!', initial.users[1].salt);
        writeState(initial);
      }
      onReady();
    })();
  }, [onReady]);

  return <main className="shell">Inicializando plataforma…</main>;
}

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', inviteToken: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const setField = (key, value) => setForm((s) => ({ ...s, [key]: value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);

    try {
      const db = ensureShape(readState());
      const email = normalizeEmail(form.email);
      if (!isUcEmail(email)) return setError('Solo se aceptan correos institucionales @uc.cl.');
      const user = db.users.find((u) => normalizeEmail(u.email) === email);
      if (!user) return setError('Usuario no encontrado.');
      const hash = await hashPassword(form.password, user.salt);
      if (hash !== user.hash) return setError('Contraseña incorrecta.');
      sessionStorage.setItem(SESSION_KEY, user.id);
      onLogin();
    } finally {
      setBusy(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (busy) return;
    setError('');
    setBusy(true);

    try {
      if (!form.name.trim()) return setError('Ingresa nombre completo.');
      const email = normalizeEmail(form.email);
      if (!isUcEmail(email)) return setError('Debes usar correo @uc.cl.');
      if (form.password.length < 10) return setError('La contraseña debe tener mínimo 10 caracteres.');

      const db = ensureShape(readState());
      if (db.users.find((u) => normalizeEmail(u.email) === email)) return setError('Ese correo ya está registrado.');

      const invite = db.invites.find((i) => i.token === form.inviteToken.trim() && normalizeEmail(i.email) === email && !i.usedAt);
      if (!invite) return setError('Invitación inválida para ese correo.');
      if (new Date(invite.expiresAt) < new Date()) return setError('Invitación expirada.');

      const salt = randomToken();
      const id = `stu_${Date.now()}`;
      const hash = await hashPassword(form.password, salt);

      db.users.push({ id, name: form.name.trim(), email, role: 'student', salt, hash });
      db.enrollments.push({ id: `enr_${Date.now()}`, sectionId: invite.sectionId, studentId: id });
      invite.usedAt = now();
      writeState(db);

      sessionStorage.setItem(SESSION_KEY, id);
      onLogin();
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="shell auth">
      <h1>titulodno_2</h1>
      <p>Plataforma en español lista para pilotos con usuarios reales.</p>
      <form className="card" onSubmit={mode === 'login' ? handleLogin : handleRegister}>
        <h2>{mode === 'login' ? 'Ingresar' : 'Registro por invitación'}</h2>
        {mode === 'register' && (
          <>
            <label htmlFor="name">Nombre completo</label>
            <input id="name" value={form.name} onChange={(e) => setField('name', e.target.value)} required />
            <label htmlFor="inviteToken">Token de invitación</label>
            <input id="inviteToken" value={form.inviteToken} onChange={(e) => setField('inviteToken', e.target.value)} required />
          </>
        )}
        <label htmlFor="email">Correo institucional</label>
        <input id="email" type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} required />
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" value={form.password} onChange={(e) => setField('password', e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Procesando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
      </form>
      <button className="link" onClick={() => setMode((m) => (m === 'login' ? 'register' : 'login'))}>
        {mode === 'login' ? '¿No tienes cuenta?' : 'Ya tengo cuenta'}
      </button>
      <small>Demo: profesora.demo@uc.cl / Demo2026!</small>
    </main>
  );
}

function Dashboard({ user, onLogout }) {
  const [db, setDb] = useState(ensureShape(readState()));
  const [inviteEmail, setInviteEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [resource, setResource] = useState({ title: '', desc: '', file: null });

  const section = useMemo(() => {
    if (user.role === 'professor') return db.sections.find((s) => s.professorId === user.id) || null;
    const enrollment = db.enrollments.find((e) => e.studentId === user.id);
    return db.sections.find((s) => s.id === enrollment?.sectionId) || null;
  }, [db.enrollments, db.sections, user.id, user.role]);

  const students = useMemo(() => {
    if (!section) return [];
    return db.enrollments
      .filter((e) => e.sectionId === section.id)
      .map((e) => db.users.find((u) => u.id === e.studentId))
      .filter(Boolean);
  }, [db.enrollments, db.users, section]);

  const invites = useMemo(() => db.invites.filter((i) => section && i.sectionId === section.id && !i.usedAt), [db.invites, section]);

  const persist = (next) => {
    writeState(next);
    setDb(next);
  };

  const createInvite = () => {
    setMsg('');
    if (!section) return setMsg('No tienes una sección activa para invitar estudiantes.');
    if (!isUcEmail(inviteEmail)) return setMsg('El correo debe terminar en @uc.cl.');

    const email = normalizeEmail(inviteEmail);
    const next = structuredClone(db);

    if (next.users.some((u) => normalizeEmail(u.email) === email)) return setMsg('Ese correo ya tiene cuenta.');

    const token = randomToken();
    next.invites = next.invites.filter((inv) => normalizeEmail(inv.email) !== email || inv.usedAt);
    next.invites.push({
      id: `inv_${Date.now()}`,
      email,
      token,
      sectionId: section.id,
      createdAt: now(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      usedAt: null,
    });

    persist(next);
    setInviteEmail('');
    setMsg(`Invitación creada para ${email}. Token: ${token}`);
  };

  const addResource = () => {
    setMsg('');
    if (!section) return setMsg('No hay sección activa para guardar recursos.');
    if (!resource.title.trim()) return setMsg('Debes ingresar un título para el recurso.');

    const next = structuredClone(db);
    const resourceId = `res_${Date.now()}`;
    next.resources.push({
      id: resourceId,
      sectionId: section.id,
      title: resource.title.trim(),
      desc: resource.desc.trim(),
      by: user.name,
      at: now(),
    });

    if (resource.file) {
      if (resource.file.size > MAX_FILE_SIZE) return setMsg('El archivo supera 1.5MB.');
      const reader = new FileReader();
      reader.onload = () => {
        next.files.push({
          id: `file_${Date.now()}`,
          resourceId,
          name: resource.file.name,
          size: resource.file.size,
          dataUrl: reader.result,
        });
        persist(next);
        setResource({ title: '', desc: '', file: null });
        setMsg('Recurso guardado correctamente.');
      };
      reader.onerror = () => setMsg('No se pudo leer el archivo. Intenta nuevamente.');
      reader.readAsDataURL(resource.file);
      return;
    }

    persist(next);
    setResource({ title: '', desc: '', file: null });
    setMsg('Recurso guardado correctamente.');
  };

  const resources = useMemo(() => db.resources.filter((r) => section && r.sectionId === section.id), [db.resources, section]);

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
            <input
              placeholder="nuevo.estudiante@uc.cl"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            <button onClick={createInvite}>Generar invitación</button>
          </div>
          <ul>
            {invites.map((invite) => (
              <li key={invite.id}>
                {invite.email} — expira {new Date(invite.expiresAt).toLocaleDateString('es-CL')}
              </li>
            ))}
            {invites.length === 0 && <li>No hay invitaciones pendientes.</li>}
          </ul>
        </section>
      )}

      <section className="card">
        <h3>Fase 2: Datos estructurados</h3>
        <p>Usuarios, secciones, matrículas, invitaciones, recursos y archivos se guardan en un modelo unificado.</p>
        <p>Estudiantes inscritos: {students.length}</p>
      </section>

      <section className="card">
        <h3>Fase 3: Almacenamiento de archivos</h3>
        <input
          placeholder="Título recurso"
          value={resource.title}
          onChange={(e) => setResource((s) => ({ ...s, title: e.target.value }))}
        />
        <textarea
          placeholder="Descripción"
          value={resource.desc}
          onChange={(e) => setResource((s) => ({ ...s, desc: e.target.value }))}
        />
        <input type="file" onChange={(e) => setResource((s) => ({ ...s, file: e.target.files?.[0] || null }))} />
        <button onClick={addResource}>Guardar recurso</button>
        <ul>
          {resources.map((item) => {
            const file = db.files.find((f) => f.resourceId === item.id);
            return (
              <li key={item.id}>
                <b>{item.title}</b> ({item.by})
                {file && (
                  <a href={file.dataUrl} download={file.name}>
                    {` ${file.name}`}
                  </a>
                )}
              </li>
            );
          })}
          {resources.length === 0 && <li>No hay recursos cargados todavía.</li>}
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
    const db = ensureShape(readState());
    const uid = sessionStorage.getItem(SESSION_KEY);
    setUser(uid ? db.users.find((u) => u.id === uid) || null : null);
  };

  useEffect(() => {
    if (!ready) return;
    loadSession();
  }, [ready]);

  if (!ready) {
    return <Boot onReady={() => setReady(true)} />;
  }

  if (!user) {
    return <Auth onLogin={loadSession} />;
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => {
        sessionStorage.removeItem(SESSION_KEY);
        setUser(null);
      }}
    />
  );
}
