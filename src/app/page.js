"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Icons from '../components/Icons';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);

export default function Crypto() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [retry, setRetry] = useState(false);
  const [graphData, setGraphData] = useState({});
  const [timestamp, setTimestamp] = useState({});
  const [showLoader, setShowLoader] = useState(true);

  const API = process.env.NEXT_PUBLIC_API_URL;

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API);
      if (!response.ok) {
        throw new Error('Failed to fetch data. Please try again later.');
      }
      const data = await response.json();
      setData(data);
      return data;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const trackPrices = async () => {
      let newData = await fetchData();
      if (newData !== null) {
        Object.keys(newData).forEach((crypto) => {
          const price = newData[crypto].usd;
          const time = new Date().toLocaleTimeString();

          setGraphData((prevData) => ({
            ...prevData,
            [crypto]: [...(prevData[crypto] || []), price],
          }));

          setTimestamp((prevTimestamp) => ({
            ...prevTimestamp,
            [crypto]: [...(prevTimestamp[crypto] || []), time],
          }));
        });
      }
    };

    const interval = setInterval(() => {
      trackPrices();
    }, 3000);

    const stopTracking = setTimeout(() => {
      clearInterval(interval);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(stopTracking);
    };
  }, [retry]);

  useEffect(() => {
    if (data !== null) {
      setShowLoader(false);
    }
  }, [data]);

  const handleRefresh = () => {
    setRetry(!retry);
    setShowLoader(true);
  };

  const filterData = (term) => {
    if (!data) return [];
    return Object.keys(data)
      .filter((key) => key.toLowerCase().includes(term.toLowerCase()))
      .map((key) => ({ name: key, price: data[key].usd }));
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        labels: (timestamp[crypto] || []).slice(-3),
      },
      y: {
        beginAtZero: false,
      },
    },
  };

  const getChartData = (crypto) => ({
    labels: timestamp[crypto] || [],
    datasets: [
      {
        label: `${crypto} Price (USD)`,
        data: graphData[crypto] || [],
        fill: false,
        borderColor: 'rgba(255, 99, 132, 1)',
        tension: 0.1,
      },
    ],
  });

  return (
    <div className="h-screen bg-gradient-to-r from-blue-800 to-gray-800 p-6 overflow-y-auto">
      <h1 className="text-4xl font-extrabold text-white text-center mb-10 drop-shadow-lg">Cryptocurrency Tracker Dashboard</h1>

      <div className="mb-8 flex justify-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Cryptocurrency..."
            className="p-4 pl-12 rounded-full border-2 border-gray-300 w-96 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleRefresh}
          className="ml-4 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <Image src={Icons.reload} alt="refresh" width={40} height={40} />

        </button>
      </div>

      {showLoader && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}

      {!showLoader && (
        <div>
          {loading ? (
            <div className="text-center text-xl text-gray-300">Loading...</div>
          ) : error ? (
            <div className="text-center text-xl text-red-500">
              <p>{error}</p>
              <button
                onClick={handleRefresh}
                className="mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {filterData(searchTerm).map((crypto) => (
                <div key={crypto.name} className="bg-gray-900 p-6 rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-semibold text-white">
                      {crypto.name.charAt(0).toUpperCase() + crypto.name.slice(1).toLowerCase()}
                    </div>

                    {Icons[crypto.name] ? (
                      <Image src={Icons[crypto.name]} alt={crypto.name} width={40} height={40} />
                    ) : (
                      <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white">?</div>
                    )}
                  </div>
                  <div className="mt-4 text-lg text-gray-300 animate-pulse">${crypto.price.toFixed(2)}</div>

                  <div className="mt-4" style={{ height: '120px', width: '100%' }}>
                    <Line data={getChartData(crypto.name)} options={chartOptions} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


    </div>
  );
}
