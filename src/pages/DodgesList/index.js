import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import useWebSocket from 'react-use-websocket';

const DodgesList = () => {
  const [queueType, setQueueType] = useState('SOLO')
  const [dodges, setDodges] = useState([]);
  const { lastMessage } = useWebSocket(process.env.REACT_APP_WS_URL, { shouldReconnect: () => true });

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
      <div className="flex flex-row gap-2 items-center self-start mt-5 ml-5">
        <img alt="logo" src="/logo192.png" className="w-8 rounded-full border-2 border-black shadow-md"/>
        <p>por duucky</p>
      </div>

      <h1 className="mt-5 mb-10 text-4xl">Dodges mais recentes</h1>

      <div className="flex flex-row gap-2 mb-10">
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
      
      <table className="table-fixed w-2/4">
        <tbody>
          {currentQueueDodges.map((dodge) => (
            <tr key={dodge.id}>
              <td className="py-1">{dodge.gameName}#{dodge.tagLine}</td>
              <td className="w-28">{dodge.lp} PDL</td>
              <td className="w-36">{dodge.rank}</td>
              <td className="w-20 text-red-500">{dodge.lpLost} PDL</td>
              <td className="w-40">{new Date(dodge.time).toLocaleDateString("pt-BR", { hour: 'numeric', minute: 'numeric', second: 'numeric' })}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default DodgesList