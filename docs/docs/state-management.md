---
sidebar_position: 3
---
# State Management

For state management, I chose **React Query** because it simplifies data fetching, caching, synchronization, and error handling.

### Why React Query?

1. **Automatic Caching**: React Query caches API responses automatically, which helps in improving performance by reducing the number of API calls.
2. **Error Handling**: React Query has built-in error handling, making it easy to manage failed API requests.
3. **Polling**: React Query supports automatic polling (which is crucial for keeping cryptocurrency prices updated in real time).

### Code Example:

```javascript
import { useQuery } from 'react-query';

const { data, error, isLoading } = useQuery('cryptoPrices', fetchData, {
    refetchInterval: 10000,  // Fetch data every 10 seconds
});
```