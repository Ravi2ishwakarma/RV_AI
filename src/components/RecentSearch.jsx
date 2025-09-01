import { dark } from "react-syntax-highlighter/dist/esm/styles/hljs";

function RecentSearch({recentHistory,setRecentHistory,setSelHistory,askQuestion,darkmode}) {
    const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };
  
    return (
        <>
            <div className="col-span-1 dark:bg-zinc-800 bg-red-100 pt-3">
                <h1 className='text-xl dark:text-white text-zinc-800 flex justify-center'>
                    <span>Recent Searches</span>
                    <button onClick={clearHistory} className='cursor-pointer'>
                        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill={darkmode=='dark'?"#F3F3F3":"#000000"}>
                            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
                        </svg>
                    </button>
                </h1>
                <ul className='text-left overflow-auto text-5m m-2'>
                    {recentHistory && recentHistory.map((his, index) => (
                        <li
                            key={index}
                            onClick={() => {
                                setSelHistory(his);
                                askQuestion();
                            }}
                            className='px-5 pl-5 block truncate cursor-pointer dark:text-zinc-400 text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 hover:bg-red-200 hover:text-zinc-800'>
                            {his}
                        </li>
                    ))}
                </ul>
            </div>

        </>
    );
}
export default RecentSearch;