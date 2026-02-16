import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Item {
    id: bigint;
    name: string;
    price: bigint;
}
export interface OrderItem {
    total: bigint;
    item: Item;
    quantity: bigint;
}
export interface Order {
    id: bigint;
    status: OrderStatus;
    billingAddress: Address;
    customer: Principal;
    createdAt: bigint;
    updatedAt: bigint;
    totalAmount: bigint;
    shippingAddress: Address;
    items: Array<OrderItem>;
}
export interface UserProfile {
    name: string;
    phone: string;
    location: string;
}
export interface Address {
    zip: string;
    street: string;
    country: string;
    city: string;
    name: string;
    state: string;
    phone: string;
}
export enum OrderStatus {
    shipped = "shipped",
    cancelled = "cancelled",
    pending = "pending",
    delivered = "delivered",
    processing = "processing"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelOrder(orderId: bigint): Promise<Order | null>;
    connectivityCheck(): Promise<string>;
    createOrder(items: Array<OrderItem>, billingAddress: Address, shippingAddress: Address): Promise<Order>;
    /**
     * / Fetch all orders (admin only)
     */
    getAllOrders(): Promise<Array<Order>>;
    /**
     * / Get caller's role/permission level
     */
    getCallerRole(): Promise<UserRole>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getOrder(orderId: bigint): Promise<Order | null>;
    /**
     * / Fetch order by ID without ownership check (admin only)
     */
    getOrderById(orderId: bigint): Promise<Order | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    /**
     * / Bootstrap initial admin if system has no admins yet
     */
    initializeAdmin(adminToken: string, userProvidedToken: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listOrders(): Promise<Array<Order>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    /**
     * / Assign/revoke admin role to/from a specific principal (admin only)
     */
    setAdminRole(target: Principal, isAdmin: boolean): Promise<void>;
    updateOrderStatus(orderId: bigint, status: OrderStatus): Promise<Order | null>;
}
