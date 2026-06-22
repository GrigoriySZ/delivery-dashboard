export type DeliveryStatus = 'Pending' | 'In_Transit' | 'Delivered' | 'Cancelled'; 
export type TransportType = 'Bicycle' | 'Car' | 'Foot';

export interface Courier {
    id: string;
    name: string;
    phone: string;
    transport: TransportType;
    currentOrderId: string | null;
}

export interface DeliveryOrder {
    id: string;
    customAdress: string;
    totalPrice: number;
    itemsCount: number;
    status: DeliveryStatus;
    assignedCourier: Courier | null;
    createdAt: string;
}

export interface DashboardFilter {
    status: DeliveryStatus | 'All';
    searchQuery: string;
}