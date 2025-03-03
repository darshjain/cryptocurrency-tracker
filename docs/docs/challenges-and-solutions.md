---
sidebar_position: 4
---

# Challenges and Solutions

### 1. Challenge: Handling API Rate Limits
**Problem**: The CoinGecko API has rate limits for free usage.

**Solution**: To mitigate this, I implemented polling at intervals and made sure not to overload the API with too many requests. I also used caching to avoid redundant calls.

### 2. Challenge: Ensuring Real-Time Data
**Problem**: Displaying real-time cryptocurrency data was challenging due to the constantly changing prices.

**Solution**: I used React Query to automatically refetch data every 10 seconds and keep the prices updated without requiring manual refresh.

### 3. Challenge: Managing Multiple Cryptocurrencies
**Problem**: Keeping track of multiple cryptocurrencies at once and displaying their data on the same dashboard was tricky.

**Solution**: I used dynamic state management by keeping an object of cryptocurrency prices and timestamps in the state. Each crypto's data was handled separately to avoid conflicts.