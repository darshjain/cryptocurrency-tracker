---
sidebar_position: 2
---


# API Information

### API Handling in the Crypto Price Tracker

In this section, we explain how API handling is implemented in the **Crypto Price Tracker** application. The primary task of the API integration is to fetch live cryptocurrency prices and ensure the UI updates accordingly. We utilize the **CoinGecko API** to get real-time cryptocurrency prices for the following coins: Bitcoin, Ethereum, Ripple, Litecoin, and Dogecoin.

---

### 1. **Setting up the API**

The CoinGecko API provides free and straightforward access to real-time cryptocurrency price data. We fetch the data from the following URL:

```plaintext
https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,ripple,litecoin,dogecoin&vs_currencies=usd
```

- **`ids`**: A comma-separated list of the cryptocurrency IDs for which we want to fetch the prices (Bitcoin, Ethereum, Ripple, Litecoin, and Dogecoin).
- **`vs_currencies`**: Specifies that the prices should be returned in USD.

This is done using the `NEXT_PUBLIC_API_URL` environment variable, which ensures that the API URL is properly configured in the `.env` file.

---

### 2. **Fetching the Data**

We use the `fetch` API to send a GET request to the CoinGecko API. This is done within a function called `fetchData()`. The data fetched from the API is then stored in the `data` state and displayed in the app.

#### Example of `fetchData` function:

```javascript
const fetchData = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await fetch(API); // API URL is passed here
    if (!response.ok) {
      throw new Error('Failed to fetch data. Please try again later.');
    }
    const data = await response.json();  // Parse the response into JSON
    setData(data);  // Update state with the data from the API
    return data;
  } catch (error) {
    setError(error.message);  // Set the error if the fetch fails
    return null;
  } finally {
    setLoading(false);  // Set loading state to false after the fetch
  }
};
```

### Explanation of the `fetchData` function:
1. **Error Handling**: We check if the response is successful with `if (!response.ok)`. If the fetch fails or the server returns an error, an exception is thrown, and the error is displayed to the user.
2. **State Management**: 
   - The `setData(data)` function updates the `data` state with the response from the API.
   - If there is an error during fetching, `setError(error.message)` updates the error state to inform the user.
3. **Loading State**: The loading state is managed using `setLoading(true)` and `setLoading(false)` to show and hide the loading indicator.

---

### 3. **Using `useEffect` to Periodically Fetch Data**

We use the `useEffect` hook to call the `fetchData()` function when the component is mounted and whenever the `retry` state is toggled (on button click for manual refresh). Additionally, the data is refreshed periodically using `setInterval` every 3 seconds.

#### Example of `useEffect` with Interval:

```javascript
useEffect(() => {
  const trackPrices = async () => {
    let newData = await fetchData(); // Fetch the data from the API
    if (newData !== null) {
      Object.keys(newData).forEach((crypto) => {
        const price = newData[crypto].usd;
        const time = new Date().toLocaleTimeString();

        // Update graph data for each cryptocurrency
        setGraphData((prevData) => ({
          ...prevData,
          [crypto]: [...(prevData[crypto] || []), price],
        }));

        // Update timestamps for each cryptocurrency
        setTimestamp((prevTimestamp) => ({
          ...prevTimestamp,
          [crypto]: [...(prevTimestamp[crypto] || []), time],
        }));
      });
    }
  };

  const interval = setInterval(() => {
    trackPrices(); // Call the function every 3 seconds
  }, 3000);

  const stopTracking = setTimeout(() => {
    clearInterval(interval); // Stop tracking after 3 seconds
  }, 3000);

  return () => {
    clearInterval(interval); // Clean up interval on component unmount
    clearTimeout(stopTracking);
  };
}, [retry]); // Re-run effect when retry state changes
```

#### Explanation:
- **Tracking Prices**: The `trackPrices` function is responsible for calling `fetchData` and updating the `graphData` and `timestamp` states for each cryptocurrency.
- **Interval**: The `setInterval` function calls `trackPrices` every 3 seconds to keep the prices updated.
- **Clearing the Interval**: `clearInterval(interval)` ensures that the interval is cleared when the component unmounts, preventing any potential memory leaks.

---

### 4. **Handling Errors and Displaying Loading Indicator**

While the data is being fetched, a loading state is displayed to the user. If an error occurs during the fetch, it is caught and displayed on the UI.

#### Example of Error Handling and Loading UI:

```javascript
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
  <div>/* Display the fetched data here */</div>
)}
```

#### Explanation:
- **Loading State**: If `loading` is `true`, a loading message is shown to the user.
- **Error State**: If `error` is not `null`, an error message is shown with a "Retry" button to refresh the data.
- **Data Display**: If there are no errors, the fetched data is displayed.

---

### Conclusion

This API integration ensures that the **Crypto Price Tracker** app displays live cryptocurrency prices by fetching data from the CoinGecko API. The key points to note are:
- **State management** for handling API responses and error states.
- **Interval-based fetching** to keep the data updated in real-time.
- **Error handling** and **loading indicators** to improve user experience.

Let me know if you need further clarification or any changes to the implementation!