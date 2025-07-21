import { useState } from 'react'

const initialMap = [
  { id: 1, type: 'machine', x: 1, y: 1, status: 'free', assignedTo: '' },
  { id: 2, type: 'machine', x: 2, y: 1, status: 'busy', assignedTo: 'Иван' },
  { id: 3, type: 'machine', x: 3, y: 1, status: 'broken', assignedTo: '' },
]

export default function Home() {
  const isMaster = false  // true для мастера, false для рабочего

  const [map, setMap] = useState(initialMap)
  const [nextId, setNextId] = useState(4)

  const addItem = (type) => {
    setMap([...map, { id: nextId, type, x: 0, y: 0, status: 'free', assignedTo: '' }])
    setNextId(nextId + 1)
  }

  const removeItem = (id) => {
    setMap(map.filter(item => item.id !== id))
  }

  const updateStatus = (id, status, worker = '') => {
    setMap(map.map(item => item.id === id ? { ...item, status, assignedTo: worker } : item))
  }

  const handleMachineClick = (item) => {
    if (isMaster) return

    const action = window.prompt(`Выберите действие для Станка №${item.id}:
1 — Работаю здесь
2 — Станок сломан`)
    if (action === '1') {
      const name = window.prompt("Ваше имя:")
      if (name) updateStatus(item.id, 'busy', name)
    } else if (action === '2') {
      updateStatus(item.id, 'broken')
      alert('🔧 Уведомление мастеру: станок сломался!')
    }
  }

  const statusColor = (status) => {
    switch (status) {
      case 'free': return 'bg-green-200'
      case 'busy': return 'bg-blue-200'
      case 'broken': return 'bg-red-200'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">🧾 Карта цеха</h1>

      {isMaster && (
        <div className="flex gap-2 mb-4">
          <button className="bg-blue-500 text-white px-4 py-2" onClick={() => addItem('machine')}>Добавить станок</button>
          <button className="bg-gray-500 text-white px-4 py-2" onClick={() => addItem('table')}>Добавить тумбу</button>
        </div>
      )}

      <div className="grid grid-cols-5 gap-4 border p-4">
        {map.map(item => (
          <div
            key={item.id}
            className={`p-3 border text-center shadow cursor-pointer ${statusColor(item.status)}`}
            onClick={() => item.type === 'machine' && handleMachineClick(item)}
          >
            <div className="font-bold">
              {item.type === 'machine' ? `Станок №${item.id}` : 'Тумба'}
            </div>
            {item.type === 'machine' && (
              <div className="text-sm text-gray-700">
                Статус: {item.status === 'free' ? '🟢 Свободен' :
                         item.status === 'busy' ? `🔵 ${item.assignedTo}` :
                         '🔴 Сломан'}
              </div>
            )}
            {isMaster && (
              <button onClick={(e) => { e.stopPropagation(); removeItem(item.id) }} className="text-red-500 text-sm mt-2">Удалить</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}