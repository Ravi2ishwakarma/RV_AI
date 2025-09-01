import './App.css';
import { useEffect, useState, useRef } from 'react';
import { URL } from './constants';
import Answers from './components/Answers';
import RecentSearch from './components/RecentSearch';
import QuesAns from './components/QuesAns';

function App() {
  const [question, setQuestion] = useState('');
  const [result, setResult] = useState([]);
  const [recentHistory, setRecentHistory] = useState(
    JSON.parse(localStorage.getItem('history')) || []
  );
  const [selHistory, setSelHistory] = useState('');
  const scrollToAns = useRef();
  const [loader, setLoader] = useState(false);
  const [darkmode, setDarkmode] = useState('dark');
  const [showRecent, setShowRecent] = useState(false);

  const askQuestion = async () => {
    const currentQuestion = question || selHistory;
    if (!currentQuestion) return;

    setLoader(true);
    const payload = {
      contents: [
        {
          parts: [{ text: currentQuestion }],
        },
      ],
    };

    if (question) {
      let history = JSON.parse(localStorage.getItem('history')) || [];
      history = history.slice(0, 19);
      const normalizedInput = question.trim().toLowerCase();
      const exists = history.some((item) => item.toLowerCase() === normalizedInput);

      if (!exists) {
        const formattedInput =
          question.trim().charAt(0).toUpperCase() + question.trim().slice(1).toLowerCase();
        const updatedHistory = [formattedInput, ...history];
        localStorage.setItem('history', JSON.stringify(updatedHistory));
        setRecentHistory(updatedHistory);
      }
    }

    let response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    response = await response.json();
    let dataString = response.candidates[0].content.parts[0].text;
    dataString = dataString.split('* ').map((item) => item.trim());

    setResult((prev) => [
      ...prev,
      { type: 'q', text: currentQuestion },
      { type: 'a', text: dataString },
    ]);

    setQuestion('');
    setTimeout(() => {
      if (scrollToAns.current) {
        scrollToAns.current.scrollTop = scrollToAns.current.scrollHeight;
      }
    }, 500);
    setLoader(false);
    setShowRecent(false); // close on mobile
  };

  const isEnter = (event) => {
    if (event.key === 'Enter') askQuestion();
  };

  useEffect(() => {
    if (darkmode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkmode]);

  return (
    <div className={darkmode === 'dark' ? 'dark' : 'light'}>
      <div className="grid lg:grid-cols-5 grid-cols-4 h-screen text-center relative overflow-hidden">

        {/* Sidebar */}
        <RecentSearch
          recentHistory={recentHistory}
          setRecentHistory={setRecentHistory}
          setSelHistory={setSelHistory}
          askQuestion={askQuestion}
          darkmode={darkmode}
          showRecent={showRecent}
          setShowRecent={setShowRecent}
        />

        {/* Main content */}
        <div className="col-span-4 h-full flex flex-col items-center pt-5 px-2 md:px-10 overflow-hidden">

          {/* History button (mobile only, above h1) */}
          {!showRecent && (
            <button
              onClick={() => setShowRecent(true)}
              className="md:hidden -ml-24 mr-2 bg-white/30 text-black dark:text-white text-xs px-3 mr-50 py-1 rounded-full backdrop-blur-sm border border-white/20 shadow-md"
            >
              History
            </button>
          )}

          {!showRecent && (
            <h1 className="text-3xl md:text-4xl mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-700 to-violet-700">
              Hello User, Ask me anything
            </h1>
          )}

          {/* Loader */}
          {loader && (
            <div class="text-left rtl:text-right">
              <div role="status">
                <svg aria-hidden="true" class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          )}

          {/* Answers Area */}
          <div
            ref={scrollToAns}
            className="lg:h-[70%] h-[80%] overflow-y-auto w-full md:w-full max-w-4xl mx-auto flex flex-col"
          >
            <ul className="dark:text-zinc-300 text-zinc-800 flex flex-col">
              {result.map((item, index) => (
                <QuesAns key={index} item={item} index={index} />
              ))}
            </ul>
          </div>

          {/* Input Field */}
          <div className="fixed bottom-5 w-full flex justify-center z-40 px-2">
            <div className="flex items-center w-full sm:w-3/4 md:w-1/2 max-w-2xl 
                            dark:bg-zinc-800 bg-red-100 dark:text-white text-zinc-800 
                            p-1 pl-4 pr-2 rounded-3xl border border-zinc-400 h-14">
              <input
                className="w-full h-full p-3 outline-none bg-transparent text-sm"
                value={question}
                onKeyDown={isEnter}
                onChange={(e) => setQuestion(e.target.value)}
                type="text"
                placeholder="Ask me anything"
              />
              <button
                onClick={askQuestion}
                className="ml-3 px-4 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition text-sm"
              >
                Ask
              </button>
            </div>
          </div>
        </div>

        {/* Toggle Mode */}
        <select
          onChange={(e) => setDarkmode(e.target.value)}
          value={darkmode}
          className="fixed z-50 text-sm p-2 bg-zinc-700 text-white rounded-md shadow-md
                     bottom-4 left-4 hidden md:block"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>

        <select
          onChange={(e) => setDarkmode(e.target.value)}
          value={darkmode}
          className="fixed z-50 text-sm p-2 bg-zinc-700 text-white rounded-md shadow-md
                     top-4 right-4 md:hidden"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
        </select>
      </div>
    </div>
  );
}

export default App;
