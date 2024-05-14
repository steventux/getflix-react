import { useState } from 'react';
import { addTorrent } from '../lib/deluge';
import Result from '../types/result';
import Error from './Error';
import Loading from './Loading';

export default function SearchForm() {
  const emptyResults = { data: [] };
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(emptyResults);
  const baseUrl:string = process.env.NEXT_PUBLIC_TORRENT_API_BASE_URL || 'http://localhost:8009';
  const endPoint: string = "/api/v1/all/search";
  const torrentApiSearchUrl: string = `${baseUrl}${endPoint}`;
  const categories = ['TV', 'Television', 'Movie', 'Other/Video'];

  const resetStates = () => {
    setError('');
    setLoading(false);
    setResults(emptyResults);
  }

  const filterData = (data: { data: any }) => {
    return {
      data: data.data.filter((d: Result) => categories.includes(d.category))
                     .filter((d: Result) => Number(d.seeders) > 0)
                     .toSorted((a: Result, b: Result) => Number(b.seeders) - Number(a.seeders))
    };
  }

  const search = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetStates();

    const query = (event.target as HTMLFormElement).query.value; 

    if (query.length === 0) {
      setError('Enter something!')
      return;
    }

    setLoading(true);

    await fetch(`${torrentApiSearchUrl}?query=${query}&limit=10`)
      .then((res) => { 
        if (res.status === 200) {
          setLoading(false);
          res.json().then((data) => setResults(filterData(data)))
        }
      })
      .catch((err) => { 
        setLoading(false);
        setError(err.message);
      });
  }

  const enqueue = (event: any) => {
    event.preventDefault();
    
    const link = event.target as HTMLLinkElement;
    addTorrent(link.href);   
  };

  return (
    <>
      <form onSubmit={search} className="w-3/4">
        <div className="p-4">
          <input type="text" name="query" placeholder="The Shining" className="w-full border-2 border-slate-500 bg-slate-50 w-3/4 p-4 mt-10"/>
        </div>

        { error ? (<Error message={error}/>) : '' }

        <div className="container py-10 px-10 mx-0 min-w-full flex flex-col items-center">
          <button type="submit" className="bg-green-600 text-2xl font-bold text-white px-10 p-4 mx-auto">Search</button>
        </div>

        <div className="container min-w-full flex flex-col items-center">
          <a href={process.env.DELUGE_WEBUI || 'http://localhost:8112'} 
             className="font-semibold text-xl" 
             target="_blank"
             rel="noreferrer">Deluge</a>
        </div>
      </form>

      { loading ? (<Loading/>) : '' }

      <ul>
        {results.data.map((result: Result, idx) => (
          <li key={idx}>
            ({result.seeders} {result.size}) <a href={result.magnet || result.torrent} 
                                                onClick={enqueue} 
                                                className="underline font-semibold">{result.name}
                                             </a>
          </li>
        ))}
      </ul>
    </>
  );
}
