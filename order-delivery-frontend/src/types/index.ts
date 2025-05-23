export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    PROCESSING = 'PROCESSING',
    READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
    IN_DELIVERY = 'IN_DELIVERY',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED'
}

export enum DeliveryStatus {
    PENDING = 'PENDING',
    ASSIGNED = 'ASSIGNED',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    FAILED = 'FAILED'
}

export interface OrderTrackingInfo {
    orderId: number;
    orderStatus: OrderStatus;
    orderDate: string;
    totalAmount: number;
    deliveryId?: number;
    deliveryStatus?: DeliveryStatus;
    deliveryDate?: string;
    carrierName?: string;
    carrierPhone?: string;
    customerName: string;
    customerAddress: string;
}

export interface TrackingHistory {
    id: number;
    orderStatus?: OrderStatus;
    deliveryStatus?: DeliveryStatus;
    timestamp: string;
    description: string;
} 