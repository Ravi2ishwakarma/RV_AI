function RecentSearch({ recentHistory, setRecentHistory, setSelHistory, askQuestion, darkmode, showRecent, setShowRecent }) {
  const clearHistory = () => {
    localStorage.clear();
    setRecentHistory([]);
  };

  const clearSelHistory = (selectedItem) => {
    let history = JSON.parse(localStorage.getItem('history')) || [];
    history = history.filter((item) => item !== selectedItem);
    setRecentHistory(history);
    localStorage.setItem('history', JSON.stringify(history));
  };

  return (
    <div
      className={`
        fixed top-0 left-0 h-full w-64 bg-red-100 dark:bg-zinc-800 z-40 p-3
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:col-span-1
        ${showRecent ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Close button only on mobile */}
      <div className="flex justify-between items-center mb-3 md:hidden">
        <h1 className="text-xl dark:text-white text-zinc-800">Recent Searches</h1>
        <button
          onClick={() => setShowRecent(false)}
          className="text-zinc-800 dark:text-white hover:text-red-600 dark:hover:text-red-400"
        >
          ✕
        </button>
      </div>

      {/* Clear All Button */}
      <div className="flex justify-center md:justify-start mb-2 text-blue-600">
        <button
          onClick={clearHistory}
          className="dark:hover:bg-zinc-950 hover:bg-red-300 cursor-pointer px-2 rounded"
        >
          Clear All
        </button>
      </div>

      <ul className="text-left overflow-auto h-[85%] text-sm pr-1 space-y-1">
        {recentHistory &&
          recentHistory.map((his, index) => (
            <div key={index} className="flex justify-between items-center">
              <li
                onClick={() => {
                  setSelHistory(his);
                  askQuestion();
                  setShowRecent(false);
                }}
                className="w-full px-3 truncate cursor-pointer dark:text-zinc-400 text-zinc-700 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 hover:bg-red-200 hover:text-zinc-800"
              >
                {his}
              </li>
              <button
                onClick={() => clearSelHistory(his)}
                className="px-1 dark:hover:bg-zinc-900 hover:bg-red-300"
              >
                🗑️
              </button>
            </div>
          ))}
      </ul>
    </div>
  );
}

export default RecentSearch;
