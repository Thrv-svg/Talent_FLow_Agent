import React, { useState, useEffect } from 'react';
import apiClient from '../apiClient';
import { Film, Star, Loader2 } from 'lucide-react';

export default function MoviesView() {
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await apiClient.get('/api/movies/catalog');
        if (res.data.success) {
          setMovies(res.data.data);
        }
      } catch (err: any) {
        console.error('Failed to fetch movies', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <Film className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">Tes Minat Film (MongoDB)</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Pilih referensi film untuk mendeteksi kecenderungan kepribadian Anda.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {movies.map((movie: any) => (
            <div key={movie._id} className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 p-5 rounded-2xl flex flex-col hover:border-purple-500/50 transition-colors">
              <div className="flex gap-4">
                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} className="w-24 h-32 object-cover rounded-lg bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out " />
                ) : (
                  <div className="w-24 h-32 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">No Image</div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display leading-tight truncate">{movie.title}</h3>
                  <div className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out flex gap-2 mt-1">
                    <span>{movie.year}</span>
                    <span>&bull;</span>
                    <span className="truncate">{movie.genres?.join(', ')}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-2 line-clamp-3">{movie.plot}</p>
                </div>
              </div>
              <button className="mt-4 w-full bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out hover:bg-purple-600 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out text-sm font-medium py-2.5 rounded-xl transition-colors border border-gray-300 hover:border-purple-500">
                Pilih Film Ini
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
