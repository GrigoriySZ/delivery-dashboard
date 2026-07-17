import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DeliveryOrder, DeliveryStatus, Courier, TransportType } from "../types/delivery";

// ГЛОБАЛЬНОЕ СОСТОЯНИЕ ДЛЯ ОТCЛЕЖИВАНИЯ ЖИЗНЕННОГО ЦИКЛА ДАННЫХ
type DeliveryState = 
    | {status: 'LOADING'}
    | {status: 'SUCCESS'; data: DeliveryOrder[]; couriers: Courier[]}
    | {status: 'ERROR'; message: string};

interface DeliveryContextType {
    state: DeliveryState;
    updateOrderStatus: (orderId: string, nextStatus: DeliveryStatus) => void;
    assignCourierToOrder: (orderId: string, courierName: string) => void;
    addCourier: (name: string, transport: TransportType) => void;
}

// undefined нужен для перехвата ошибок вызова вне провайдера
const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

// Изначальные данные 
const InitialState: DeliveryState = {
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
                phone: '+79999999999', 
                transport: 'Car', 
                currentOrderId: null
            },
            createdAt: '2026-06-22'
        }, {
            id: '103',
            customAdress: 'Frunze St',
            totalPrice: 2500,
            itemsCount: 2,
            status: 'Delivered',
            assignedCourier: {
                id: 'C2', 
                name: 'Petr Petrov', 
                phone: '+7991112233', 
                transport: 'Bicycle', 
                currentOrderId: null
            },
            createdAt: '2026-06-23'
        }
    ],
    couriers: [
        {id: 'C1', name: 'Ivan Ivanov', phone: '+79999999999', transport: 'Car', currentOrderId: null},
        {id: 'C2', name: 'Petr Petrov', phone: '+7991112233', transport: 'Bicycle', currentOrderId: null}
    ]
};

export const DeliveryProvider = ({children}: {children: ReactNode}): JSX.Element => {

    // Хранение данных в state с загурзкой из localStorage
    const [state, setState] = useState<DeliveryState>(() => {
        try {
            const savedData = localStorage.getItem('delivery_dashboard_state');
            if (savedData) return JSON.parse(savedData);
        } catch (e) {
            console.error('Ошибка чтения localStorage', e);
        }
        return InitialState;
    });

    // Загрузка state в localStorage при изменениях
    useEffect(() => {
        if (state.status !== 'SUCCESS') return;
        localStorage.setItem('delivery_dashboard_state', JSON.stringify(state));
    }, [state])

    const updateOrderStatus = (orderId: string, nextStatus: DeliveryStatus) => {
        if (state.status !== 'SUCCESS') return;

        const updateOrders = state.data.map(order => 
            order.id === orderId ? {... order, status: nextStatus}: order
        );

        const updateCouriers = nextStatus === 'Delivered' || nextStatus === 'Cancelled'
            ? state.couriers.map(courier => 
                courier.currentOrderId === orderId 
                ? {... courier, currentOrderId: null}
                : courier)
            : state.couriers
        
        setState({ status: 'SUCCESS', data: updateOrders, couriers: updateCouriers});
    };

    // Назначение курьера на заказ
    const assignCourierToOrder = (orderId: string, courierId: string) => {
        if (state.status !== 'SUCCESS') return;
        
        // Ищем курьера с подходящим ID в списке известных курьеров
        const foundCourier = state.couriers.find(courier => courier.id === courierId);

        if (!foundCourier || foundCourier.currentOrderId !== null) return;

        const updateOrders = state.data.map(order => {
            if (order.id === orderId) {
                return {
                    ...order,
                    status: 'In_Transit' as DeliveryStatus,
                    assignedCourier: foundCourier
                }
            }
            return order;
        });

        const updateCouriers = state.couriers.map(courier => {
            if (courier.id === courierId) {
                return {
                    ...courier,
                    currentOrderId: orderId
                }
            }
            return courier;
        });
        setState({status: 'SUCCESS', data: updateOrders, couriers: updateCouriers});
    };

    const addCourier = (name: string, transport: TransportType) => {
        if (state.status !== 'SUCCESS') return;

        if(!name.trim() || !transport) return;

        const newCourier: Courier = {
            id: `C${Date.now()}`,
            name: name || '',
            phone: '000',
            transport: transport,
            currentOrderId: null
        };

        setState({...state, couriers: [...state.couriers, newCourier]});
    };

    return (
        <DeliveryContext.Provider
            value={{state, updateOrderStatus, assignCourierToOrder, addCourier}}
        >
            {children}
        </DeliveryContext.Provider>
    );
}

export const useDelivery = () => {
    const context = useContext(DeliveryContext);
    if (!context) {
        throw new Error('ERROR');
    }
    return context;
}