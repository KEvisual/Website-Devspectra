// Client-only localStorage order store.
// All functions guard against SSR with typeof window checks.

export type OrderStatus = "pending" | "completed";

export interface Order {
  orderId: string;
  status: OrderStatus;
  completedAt?: string;
  name?: string;
  jasa?: string;
}

export const ORDERS_KEY = "devspectra-orders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY) ?? "[]") as Order[];
  } catch {
    return [];
  }
}

export function upsertOrder(order: Order): void {
  if (typeof window === "undefined") return;
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.orderId === order.orderId);
  if (idx >= 0) {
    orders[idx] = order;
  } else {
    orders.push(order);
  }
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getOrder(orderId: string): Order | undefined {
  return getOrders().find((o) => o.orderId === orderId);
}

export function markOrderCompleted(orderId: string): void {
  if (typeof window === "undefined") return;
  const orders = getOrders();
  const idx = orders.findIndex((o) => o.orderId === orderId);
  if (idx >= 0) {
    orders[idx] = { ...orders[idx], status: "completed", completedAt: new Date().toISOString() };
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }
}
