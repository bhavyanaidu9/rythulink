import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@RythuLink_Cache:';

/**
 * Save data to local cache with a TTL (Time To Live).
 */
export const setCache = async (key, data, ttlMinutes = 60) => {
  try {
    const expiry = Date.now() + ttlMinutes * 60 * 1000;
    const cacheValue = JSON.stringify({
      data,
      expiry,
    });
    await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, cacheValue);
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
};

/**
 * Get data from local cache if it hasn't expired.
 */
export const getCache = async (key) => {
  try {
    const cacheValue = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!cacheValue) return null;

    const { data, expiry } = JSON.parse(cacheValue);
    if (Date.now() > expiry) {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error reading from cache:', error);
    return null;
  }
};

/**
 * Clear all cached API responses.
 */
export const clearCache = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter(key => key.startsWith(CACHE_PREFIX));
    await AsyncStorage.multiRemove(cacheKeys);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};
