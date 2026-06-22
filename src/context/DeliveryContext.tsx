import React, { createContext, useContext, useState, ReactNode } from "react";
import { DeliveryOrder, DeliveryStatus } from "../types/delivery";

// ГЛОБАЛЬНОЕ СОСТОЯНИЕ ДЛЯ ОТВЛЕЖИВАНИЯ ЖИЗНЕННОГО ЦИКЛА ДАННЫХ
type DeliveryState = 
    | {status: 'LOADING'}
    | {status: 'SUCCESS'; data: DeliveryOrder[]}
    | {status: 'ERROR'; message: string};

interface DeliveryContextType {
    state: DeliveryState;
    updateOrderStatus: (orderId: string, nextStatus: DeliveryStatus) => void;
    assignCourierToOrder: (orderId: string, courierName: string) => void;
}

// undefined нужен для перехвата ошибок вызова вне провайдера
const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

export const DeliveryProvider = ({children}: {children: ReactNode}): JSX.Element => {
    
    const [state, setState] = useState<DeliveryState>({
        status: 'SUCCESS',
        data: [
            {
                id: '101',
                customAdress: 'Lenina St',
                totalPrice: 1500,
                itemsCount: 3,
                status: 'Pending',
                assignedCourier: null,
                createdAt: '2026-06-22'
            }, {
                id: '102',
                customAdress: 'Sovetskaya St',
                totalPrice: 3500,
                itemsCount: 1,
                status: 'In_Transit',
                assignedCourier: {
                    id: 'C1',
                    name: 'Ivan Ivanov',
                    phone: '123456789',
                    transport: 'Car',
                    currentOrderId: '102'
                },
                createdAt: '2026-06-22'
            }, {
                id: '103',
                customAdress: 'Frunze St',
                totalPrice: 2500,
                itemsCount: 2,
                status: 'Delivered',
                assignedCourier: {
                    id: 'C1',
                    name: 'Petr Petrov',
                    phone: '33333333',
                    transport: 'Foot',
                    currentOrderId: '103'
                },
                createdAt: '2026-06-23'
            }
        ]
    });

    const updateOrderStatus = (orderId: string, nextStatus: DeliveryStatus) => {
        if (state.status !== 'SUCCESS') return;
        const updateOrders = state.data.map(order => 
            order.id === orderId ? {... order, status: nextStatus}: order
        );
        setState({ status: 'SUCCESS', data: updateOrders});
    };

    const assignCourierToOrder = (orderId: string, courierName: string) => {
        if (state.status !== 'SUCCESS') return;
        const updateOrders = state.data.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    status: 'In_Transit' as DeliveryStatus,
                    assignedCourier: {
                        id: `C-${Date.now()}`,
                        name: courierName, 
                        phone: '89999999999',
                        transport: 'Bicycle' as const,
                        currentOrderId: orderId
                    }
                }
            }
            return order;
        });
        setState({ status: 'SUCCESS', data: updateOrders});
    };

    return (
        <DeliveryContext.Provider
            value={{state, updateOrderStatus, assignCourierToOrder}}
        >
            {children}
        </DeliveryContext.Provider>
    );
}
