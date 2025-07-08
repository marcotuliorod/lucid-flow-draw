import { useState, useEffect, useCallback } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class Cache {
  private storage = new Map<string, CacheEntry<any>>();
  private storageKey = 'app_cache';

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.storage = new Map(Object.entries(parsed));
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  private saveToLocalStorage() {
    try {
      const data = Object.fromEntries(this.storage);
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };
    
    this.storage.set(key, entry);
    this.saveToLocalStorage();
  }

  get<T>(key: string): T | null {
    const entry = this.storage.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) return null;
    
    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.storage.delete(key);
      this.saveToLocalStorage();
      return null;
    }
    
    return entry.data;
  }

  clear(): void {
    this.storage.clear();
    localStorage.removeItem(this.storageKey);
  }

  delete(key: string): void {
    this.storage.delete(key);
    this.saveToLocalStorage();
  }
}

const cache = new Cache();

export const useCache = () => {
  const [cacheVersion, setCacheVersion] = useState(0);

  const set = useCallback((key: string, data: any, ttl?: number) => {
    cache.set(key, data, ttl);
    setCacheVersion(prev => prev + 1);
  }, []);

  const get = useCallback((key: string) => {
    return cache.get(key);
  }, [cacheVersion]);

  const clear = useCallback(() => {
    cache.clear();
    setCacheVersion(prev => prev + 1);
  }, []);

  const remove = useCallback((key: string) => {
    cache.delete(key);
    setCacheVersion(prev => prev + 1);
  }, []);

  return {
    set,
    get,
    clear,
    remove
  };
};