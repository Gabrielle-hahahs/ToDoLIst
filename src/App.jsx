import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate, useParams } from 'react-router-dom'

const starterGroups = [
  { id: 'school', name: 'School Activities', emoji: '📚', color: 'bg-violet-100' },
  { id: 'personal', name: 'Personal Tasks', emoji: '🌿', color: 'bg-emerald-100' },
  { id: 'projects', name: 'Projects', emoji: '💻', color: 'bg-amber-100' },
  { id: 'daily', name: 'Daily Tasks', emoji: '☀️', color: 'bg-sky-100' },
]
const starterTasks = [
  { id: 1, title: 'Review Laboratory 3 instructions', groupId: 'school', done: false },
  { id: 2, title: 'Organize project files', groupId: 'projects', done: true },
  { id: 3, title: 'Prepare tomorrow’s to-do list', groupId: 'daily', done: false },
]
const readSaved = (key, fallback) => {
  try { const saved = localStorage.getItem(key); return saved ? JSON.parse(saved) : fallback }
  catch { return fallback }
}

function App() {
  const [groups, setGroups] = useState(() => readSaved('mintlist-groups', starterGroups))
  const [tasks, setTasks] = useState(() => readSaved('mintlist-tasks', starterTasks))
  useEffect(() => { localStorage.setItem('mintlist-groups', JSON.stringify(groups)) }, [groups])
  useEffect(() => { localStorage.setItem('mintlist-tasks', JSON.stringify(tasks)) }, [tasks])

  const addTask = (title, groupId) => setTasks(old => [...old, { id: Date.now(), title: title.trim(), groupId, done: false }])
  const toggleTask = id => setTasks(old => old.map(task => task.id === id ? { ...task, done: !task.done } : task))
  const deleteTask = id => setTasks(old => old.filter(task => task.id !== id))
  const addGroup = name => {
    const cleanName = name.trim()
    if (!cleanName || groups.some(group => group.name.toLowerCase() === cleanName.toLowerCase())) return false
    setGroups(old => [...old, { id: `group-${Date.now()}`, name: cleanName, emoji: '🗂️', color: 'bg-emerald-100' }])
    return true
  }
  const resetDemo = () => { setTasks(starterTasks); setGroups(starterGroups) }

  return <div className="min-h-screen bg-[#f5fbf7] text-[#173b32]">
    <header className="sticky top-0 z-10 border-b border-emerald-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/home" className="flex items-center gap-2 font-black tracking-tight text-emerald-800"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-xl">✓</span><span className="text-xl">MintList<span className="text-emerald-500">.</span><small className="block text-xs font-medium tracking-normal text-slate-500">your day, a little greener</small></span></Link>
        <nav className="flex flex-wrap items-center justify-end gap-1 text-sm font-semibold sm:gap-2">
          <NavLink to="/home" className={navClass}>Home</NavLink><NavLink to="/" end className={navClass}>Tasks</NavLink><NavLink to="/groups" className={navClass}>Groups</NavLink><NavLink to="/guide" className={navClass}>Guide</NavLink><NavLink to="/developers" className={navClass}>Developers</NavLink>
        </nav>
      </div>
    </header>
    <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <Routes>
        <Route path="/" element={<TaskPage groups={groups} tasks={tasks} addTask={addTask} toggleTask={toggleTask} deleteTask={deleteTask} />} />
        <Route path="/home" element={<Home groups={groups} tasks={tasks} />} />
        <Route path="/groups" element={<Groups groups={groups} tasks={tasks} addGroup={addGroup} />} />
        <Route path="/groups/:groupId" element={<GroupTasks groups={groups} tasks={tasks} addTask={addTask} toggleTask={toggleTask} deleteTask={deleteTask} />} />
        <Route path="/guide" element={<Guide />} />
        <Route path="/developers" element={<Developers />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="mt-12 border-t border-emerald-100 pt-5 text-center text-xs text-slate-500">Laboratory 3 · DCIT 26 · React + Tailwind CSS + React Router DOM</footer>
    </main>
  </div>
}
const navClass = ({ isActive }) => `rounded-xl px-3 py-2 transition ${isActive ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-800'}`

function PageHeading({ eyebrow, title, description, children }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="mb-2 text-xs font-bold uppercase tracking-[.2em] text-emerald-600">{eyebrow}</p><h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p></div>{children}</div>
}
function StatCard({ label, value, icon, hint }) {
  return <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-500">{label}</span><span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-xl">{icon}</span></div><p className="mt-3 text-3xl font-black">{value}</p><p className="mt-1 text-xs text-slate-500">{hint}</p></div>
}
function Home({ groups, tasks }) {
  const completed = tasks.filter(task => task.done).length
  const pending = tasks.length - completed
  return <><PageHeading eyebrow="Your personal planner" title="A fresh start, every day." description="Welcome to MintList. Keep your tasks organized, track your progress, and take things one step at a time."><Link to="/" className="rounded-xl bg-emerald-700 px-5 py-3 text-center text-sm font-bold text-white shadow-sm hover:bg-emerald-800">＋ Add a task</Link></PageHeading>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard label="All tasks" value={tasks.length} icon="📝" hint="Everything on your list"/><StatCard label="Completed" value={completed} icon="✅" hint="Small wins count"/><StatCard label="Still to do" value={pending} icon="🌱" hint="One task at a time"/></div>
    <section className="mt-8 rounded-3xl bg-emerald-800 p-6 text-white sm:p-8"><p className="text-sm font-semibold text-emerald-200">A LITTLE REMINDER</p><h2 className="mt-2 text-2xl font-black">Progress over perfection.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-emerald-50">Choose one thing to finish next. You can mark it complete when you’re done, or move it back to pending if plans change.</p><Link to="/groups" className="mt-5 inline-flex rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-900 hover:bg-emerald-50">Explore task groups →</Link></section>
    <section className="mt-8"><div className="mb-4 flex items-center justify-between"><h2 className="text-xl font-extrabold">Your task groups</h2><Link to="/groups" className="text-sm font-bold text-emerald-700 hover:underline">View all →</Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{groups.slice(0, 4).map(group => <Link key={group.id} to={`/groups/${group.id}`} className="rounded-2xl border border-emerald-100 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"><span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${group.color}`}>{group.emoji}</span><h3 className="mt-4 font-bold">{group.name}</h3><p className="mt-1 text-sm text-slate-500">{tasks.filter(task => task.groupId === group.id).length} tasks</p></Link>)}</div></section>
  </>
}

function TaskList({ tasks, groups, toggleTask, deleteTask }) {
  if (!tasks.length) return <div className="rounded-2xl border border-dashed border-emerald-200 bg-white p-8 text-center"><span className="text-3xl">🌿</span><p className="mt-2 font-bold">Nothing here yet</p><p className="mt-1 text-sm text-slate-500">Add a task above to get started.</p></div>
  return <div className="space-y-3">{tasks.map(task => { const group = groups.find(item => item.id === task.groupId); return <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"><button onClick={() => toggleTask(task.id)} aria-label={task.done ? 'Mark as not done' : 'Mark as done'} className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 text-xs font-black ${task.done ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300 hover:border-emerald-500'}`}>{task.done ? '✓' : ''}</button><div className="min-w-0 flex-1"><p className={`break-words font-semibold ${task.done ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{task.title}</p><p className="mt-1 text-xs text-slate-500">{group ? `${group.emoji} ${group.name}` : 'Unassigned group'}</p></div><span className={`hidden rounded-full px-3 py-1 text-xs font-bold sm:inline-block ${task.done ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{task.done ? 'Done' : 'Not Done'}</span><button onClick={() => deleteTask(task.id)} className="rounded-lg px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50" aria-label={`Delete ${task.title}`}>Delete</button></div>})}</div>
}
function TaskForm({ groups, onAdd, defaultGroup }) {
  const [title, setTitle] = useState('')
  const [groupId, setGroupId] = useState(defaultGroup || groups[0]?.id || '')
  useEffect(() => { if (defaultGroup) setGroupId(defaultGroup); else if (!groups.some(group => group.id === groupId)) setGroupId(groups[0]?.id || '') }, [defaultGroup, groups, groupId])
  const submit = event => { event.preventDefault(); if (!title.trim() || !groupId) return; onAdd(title, groupId); setTitle('') }
  return <form onSubmit={submit} className="mb-5 flex flex-col gap-3 rounded-2xl border border-emerald-100 bg-white p-4 sm:flex-row"><input value={title} onChange={event => setTitle(event.target.value)} placeholder="What do you need to do?" aria-label="Task name" maxLength={120} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"/><select value={groupId} onChange={event => setGroupId(event.target.value)} aria-label="Task group" className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-emerald-500" disabled={!groups.length}>{groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}</select><button type="submit" disabled={!title.trim() || !groupId} className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40">＋ Add task</button></form>
}
function TaskPage({ groups, tasks, addTask, toggleTask, deleteTask }) {
  const [filter, setFilter] = useState('all')
  const visible = tasks.filter(task => filter === 'all' || (filter === 'done' ? task.done : !task.done))
  return <><PageHeading eyebrow="Task manager" title="Make room for what matters." description="Add tasks, choose a group, and update each task when your progress changes."/><TaskForm groups={groups} onAdd={addTask}/><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-extrabold">Your tasks <span className="text-sm font-medium text-slate-500">({visible.length})</span></h2><div className="flex gap-2">{[['all','All'],['pending','Not Done'],['done','Done']].map(([value,label]) => <button key={value} onClick={() => setFilter(value)} className={`rounded-xl px-3 py-2 text-xs font-bold ${filter === value ? 'bg-emerald-700 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-emerald-50'}`}>{label}</button>)}</div></div><TaskList tasks={visible} groups={groups} toggleTask={toggleTask} deleteTask={deleteTask}/></>
}
function Groups({ groups, tasks, addGroup }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const submit = event => { event.preventDefault(); if (!name.trim()) { setError('Please enter a group name.'); return } if (!addGroup(name)) { setError('That group already exists. Choose another name.'); return } setName(''); setError('') }
  return <><PageHeading eyebrow="Stay organized" title="Task groups" description="Separate school work, personal plans, projects, and daily routines into their own lists."/><form onSubmit={submit} className="mb-6 rounded-2xl border border-emerald-100 bg-white p-4"><label htmlFor="groupName" className="mb-2 block text-sm font-bold">Create a new group</label><div className="flex flex-col gap-3 sm:flex-row"><input id="groupName" value={name} onChange={event => {setName(event.target.value); setError('')}} placeholder="e.g. Capstone Tasks" maxLength={45} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-500"/><button className="rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-800">＋ Create group</button></div>{error && <p role="alert" className="mt-2 text-sm text-rose-600">{error}</p>}</form><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{groups.map(group => <div key={group.id} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${group.color}`}>{group.emoji}</span><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{tasks.filter(task => task.groupId === group.id).length} tasks</span></div><h2 className="mt-4 text-lg font-extrabold">{group.name}</h2><p className="mt-1 text-sm text-slate-500">A dedicated place for this category.</p><Link to={`/groups/${group.id}`} className="mt-5 inline-flex rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-bold text-emerald-800 hover:bg-emerald-100">Open task list →</Link></div>)}</div></>
}
function GroupTasks({ groups, tasks, addTask, toggleTask, deleteTask }) {
  const { groupId } = useParams()
  const group = groups.find(item => item.id === groupId)
  if (!group) return <NotFound message="We couldn't find that task group."/>
  const groupTasks = tasks.filter(task => task.groupId === groupId)
  return <><div className="mb-5"><Link to="/groups" className="text-sm font-bold text-emerald-700 hover:underline">← All groups</Link></div><PageHeading eyebrow="Selected task group" title={`${group.emoji} ${group.name}`} description={`Only tasks assigned to ${group.name} are shown here.`}/><TaskForm groups={groups} onAdd={addTask} defaultGroup={groupId}/><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-extrabold">Tasks in this group</h2><span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">{groupTasks.length} total</span></div><TaskList tasks={groupTasks} groups={groups} toggleTask={toggleTask} deleteTask={deleteTask}/></>
}
function Guide() {
  const steps = [{title:'Create a task group',body:'Open Task Groups from the navigation. Type a category name, then select Create group. Duplicate group names are not accepted.'},{title:'Add a task',body:'Open Tasks or a specific group. Enter a short task name, select the correct group, and press Add task. Empty task names cannot be submitted.'},{title:'Mark a task Done or Not Done',body:'Press the square check button beside a task. A checked task is marked Done. Press it again to return it to Not Done.'},{title:'Delete a task',body:'Press Delete on the task you want to remove. The task disappears from the list and the dashboard totals update.'},{title:'Navigate between pages',body:'Use the navigation links at the top to move between Home, Tasks, Groups, Guide, and Developers. Open a category with its Open task list link.'},{title:'Save and test',body:'Tasks and groups are saved in this browser using localStorage, so they remain after a refresh on the same browser. Clearing browser storage removes saved data.'}]
  return <><PageHeading eyebrow="Help center" title="Quick user guide" description="Everything you need to use MintList and demonstrate its main features."/><div className="space-y-4">{steps.map((step,index) => <section key={step.title} className="flex gap-4 rounded-2xl border border-emerald-100 bg-white p-5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-100 font-black text-emerald-800">{index+1}</span><div><h2 className="font-extrabold">{step.title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{step.body}</p></div></section>)}</div></>
}
function Developers() {
  const [names, setNames] = useState(() => readSaved('mintlist-developer-names', ['Replace with Member 1 full name', 'Replace with Member 2 full name', 'Replace with Member 3 full name', 'Replace with Member 4 full name']))
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(names.join('\n'))
  const save = event => { event.preventDefault(); const clean = draft.split('\n').map(name => name.trim()).filter(Boolean).slice(0,4); setNames(clean); localStorage.setItem('mintlist-developer-names', JSON.stringify(clean)); setEditing(false) }
  return <><PageHeading eyebrow="The people behind MintList" title="Meet the developers" description="Replace the sample names below with the complete names of your actual group members before submission."><button onClick={() => {setDraft(names.join('\n')); setEditing(!editing)}} className="rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm font-bold text-emerald-800 hover:bg-emerald-50">{editing ? 'Cancel edit' : 'Edit member names'}</button></PageHeading>{editing && <form onSubmit={save} className="mb-6 rounded-2xl border border-emerald-100 bg-white p-4"><label htmlFor="members" className="mb-2 block text-sm font-bold">Enter one complete name per line (up to 4)</label><textarea id="members" value={draft} onChange={event => setDraft(event.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-emerald-500"/><button className="mt-3 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Save names</button></form>}<div className="grid gap-4 sm:grid-cols-2">{names.map((name,index) => <div key={`${name}-${index}`} className="rounded-2xl border border-emerald-100 bg-white p-6"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-100 text-2xl">👩‍💻</span><h2 className="mt-4 font-extrabold">{name}</h2><p className="mt-1 text-sm text-emerald-700">Project Developer · Member {index+1}</p></div>)}</div><p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Submission reminder: use your group's real full names and actual assigned roles. Do not submit the sample names as final information.</p></>
}
function NotFound({ message = 'That page does not exist.' }) { return <div className="rounded-3xl border border-emerald-100 bg-white p-10 text-center"><p className="text-4xl">🌱</p><h1 className="mt-3 text-2xl font-black">Page not found</h1><p className="mt-2 text-sm text-slate-600">{message}</p><Link to="/home" className="mt-5 inline-flex rounded-xl bg-emerald-700 px-5 py-3 text-sm font-bold text-white">Back to Home</Link></div> }

export default App
