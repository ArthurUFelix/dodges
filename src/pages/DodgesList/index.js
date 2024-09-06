import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const DodgesList = () => {
  const [queueType, setQueueType] = useState('SOLO')
  const [dodges, setDodges] = useState([]);
  const { lastMessage } = useWebSocket(process.env.REACT_APP_WS_URL);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetch(`${process.env.REACT_APP_API_URL}/dodges`).then(res => res.json())
        setDodges(data)
      } catch (err) {
        console.log('api not available')
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (lastMessage !== null) {
      setDodges((prev) => [...JSON.parse(lastMessage.data), ...prev]);
    }
  }, [lastMessage]);

  const currentQueueDodges = useMemo(() => {
    return dodges.filter((dodge) => dodge.queue === queueType)
  }, [dodges, queueType])

  return (
    <div className="h-screen flex flex-col items-center">
      <h1 className="mt-20 mb-10 text-4xl">Lista de dodges</h1>

      <div className="flex flex-row gap-2">
        <button
          className={clsx("px-3 py-1", queueType === 'SOLO' ? 'bg-neutral-800' : 'border-neutral-800 border-2')}
          onClick={() => setQueueType('SOLO')}
        >
          SOLO
        </button>
        <button
          className={clsx("px-3 py-1", queueType === 'FLEX' ? 'bg-neutral-800' : 'border-neutral-800 border-2')}
          onClick={() => setQueueType('FLEX')}
        >
          FLEX
        </button>
      </div>
      
      <table className="table-auto w-1/3">
        <tbody>
          {currentQueueDodges.map((dodge) => (
            <tr key={dodge.id}>
              <td>{dodge.gameName}#{dodge.tagLine}</td>
              <td>{dodge.rank}</td>
              <td>- {dodge.lpLost} PDL</td>
              <td className="w-40">{new Date(dodge.time).toLocaleDateString("pt-BR", { hour: 'numeric', minute: 'numeric', second: 'numeric' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DodgesList