import { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import api from '../api/axios';
import { ORDER_ENDPOINTS } from '../config/api';
import { formatCurrency } from '../utils/formatters';

const STORAGE_KEY = 'reine_afrique_admin_seen_order_ids';
const POLL_INTERVAL_MS = 45000; // 45 secondes

const loadSeenIds = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
};

const saveSeenIds = (set) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch (e) {
    console.warn('OrderNotifications: impossible d\'écrire dans localStorage', e);
  }
};

/** Vide le cache des notifications (IDs vus) — à appeler pour repartir à zéro */
export function clearNotificationsCache() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('OrderNotifications: impossible de vider le cache', e);
  }
}

const OrderNotificationsContext = createContext(null);

export function OrderNotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const seenIdsRef = useRef(loadSeenIds());
  const pollTimerRef = useRef(null);
  const isMountedRef = useRef(true);

  const normalizeOrder = (o) => ({
    id: o.id ?? o._id ?? o.order_id,
    client: o.customer_name ?? o.customer?.name ?? o.client_name ?? o.customer_email ?? 'Client',
    total: o.total ?? o.amount ?? o.grand_total ?? null,
    status: o.status ?? o.state ?? o.order_status ?? '—',
    createdAt: o.created_at ?? o.createdAt ?? o.date ?? null,
  });

  const fetchAndDiff = useCallback(async () => {
    if (!isMountedRef.current) return;
    try {
      setLoading(true);
      const res = await api.get(ORDER_ENDPOINTS.LIST, {
        params: { limit: 30, sort: 'created_at:desc' },
      });
      const data = Array.isArray(res.data) ? res.data : Array.isArray(res.data?.data) ? res.data.data : [];
      const seen = seenIdsRef.current;
      const wasEmpty = seen.size === 0;
      const newOnes = [];
      const nowSeen = new Set(seen);

      for (const o of data) {
        const norm = normalizeOrder(o);
        const id = norm.id;
        if (id == null) continue;
        nowSeen.add(String(id));
        if (!wasEmpty && !seen.has(String(id))) {
          newOnes.push(norm);
        }
      }

      seenIdsRef.current = nowSeen;
      saveSeenIds(nowSeen);

      if (wasEmpty) {
        setNotifications([]);
        setUnreadCount(0);
      } else {
        setNotifications((prev) => {
          const byId = new Map(prev.map((n) => [String(n.id), n]));
          for (const n of newOnes) {
            byId.set(String(n.id), n);
          }
          return [...byId.values()].sort((a, b) => {
            const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return tb - ta;
          });
        });
        setUnreadCount((prev) => {
          const unread = newOnes.length + prev;
          return Math.min(unread, 99);
        });
      }
    } catch (err) {
      if (isMountedRef.current && err?.response?.status !== 401) {
        console.warn('OrderNotifications: erreur fetch', err?.response?.status || err.message);
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  }, []);

  // Premier chargement : marquer toutes les commandes actuelles comme vues pour ne pas bombarder l’admin
  useEffect(() => {
    isMountedRef.current = true;
    let initial = true;
    const run = async () => {
      await fetchAndDiff();
      if (initial) {
        initial = false;
        setUnreadCount(0);
      }
    };
    run();

    pollTimerRef.current = setInterval(() => {
      fetchAndDiff();
    }, POLL_INTERVAL_MS);

    return () => {
      isMountedRef.current = false;
      if (pollTimerRef.current) {
        clearInterval(pollTimerRef.current);
        pollTimerRef.current = null;
      }
    };
  }, [fetchAndDiff]);

  const markAsRead = useCallback((orderId) => {
    const id = String(orderId);
    seenIdsRef.current.add(id);
    saveSeenIds(seenIdsRef.current);
    setNotifications((prev) => prev.filter((n) => String(n.id) !== id));
    setUnreadCount((c) => Math.max(0, c - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      for (const n of prev) seenIdsRef.current.add(String(n.id));
      saveSeenIds(seenIdsRef.current);
      return [];
    });
    setUnreadCount(0);
  }, []);

  const addNewOrderFromPlatform = useCallback((order) => {
    const norm = normalizeOrder(order);
    if (norm.id == null) return;
    if (seenIdsRef.current.has(String(norm.id))) return;
    seenIdsRef.current.add(String(norm.id));
    setNotifications((prev) => [norm, ...prev]);
    setUnreadCount((c) => Math.min(99, c + 1));
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchAndDiff,
    addNewOrderFromPlatform,
    formatCurrency,
  };

  return (
    <OrderNotificationsContext.Provider value={value}>
      {children}
    </OrderNotificationsContext.Provider>
  );
}

export function useOrderNotifications() {
  const ctx = useContext(OrderNotificationsContext);
  if (!ctx) {
    throw new Error('useOrderNotifications doit être utilisé dans OrderNotificationsProvider');
  }
  return ctx;
}
