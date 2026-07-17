import { useState } from "react";
import { DeliveryStatus, DeliveryOrder } from "../types/delivery";
import { useDelivery } from "../context/DeliveryContext";

interface OrderManagementModalProps{
    order: DeliveryOrder;
    onClose: () => void;
    onUpdateStatus: (orderId: string, nextStatus: DeliveryStatus) => void;
    onAssignCourier: (orderId: string, courierId: string) => void;
};

export const OrderManagementModal = ({
    order,
    onClose,
    onUpdateStatus,
    onAssignCourier
}: OrderManagementModalProps): JXS.Element => {
    const { state } = useDelivery();
    const [courierSelect, setCourierSelect] = useState<string>('');
    const allStatuses: DeliveryStatus[] = ['Pending', 'In_Transit', 'Delivered', 'Cancelled'];

    const unorderedCouriers = state.couriers.filter(c => c.currentOrderId === null);
    
    const handleCourierSubmit = (e: React.SubmitEvent) => {
        e.preventDefault();
        if (!courierSelect.trim()) return;
        onAssignCourier(order.id, courierSelect);
        setCourierSelect('');
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, bottom: 0, right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: '#fff',
                padding: '24px',
                width: '100%',
                maxWidth: '500px'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <h3>Управление заказом</h3>
                    <button 
                        onClick={onClose}
                        style={{ background: 'none', border: 'none' }}
                    >
                        &times;
                    </button>
                </div>
                <p style={{ color: '#687280', marginBottom: '16px'}}>
                    <b>Текущий адрес доставки: </b> {order.customAdress}
                </p>
                <div>
                    <label htmlFor="order-status-select">
                        Изменить статус на:
                    </label>
                    <select
                        id="order-status-select"
                        value={order.status}
                        onChange={
                            (e: React.ChangeEvent<HTMLSelectElement>) => 
                            onUpdateStatus(order.id, e.target.value as DeliveryStatus)
                        }
                    >
                        {allStatuses.map(status => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <form onSubmit={handleCourierSubmit}>
                        <label htmlFor="courier-input">
                            Назначить нового курьера
                        </label>
                        <select
                            id="courier-input"
                            value={courierSelect || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCourierSelect(e.target.value)}
                            style={{ padding: '6px', border: '1px solid #ccc'}}
                        >   
                            <option value='' style={{display: 'none'}} disabled>Веберите курьера</option>
                            {unorderedCouriers.map(c => (
                                <option key={c.id} value={c.id}>{c.name}-{c.transport}</option>
                            ))}
                        </select>
                        <button type="submit">
                            Назначить
                        </button>
                    </form>
                    {order.assignedCourier && (
                        <p>
                            Сейчас заказ выполняет {order.assignedCourier.name}
                        </p>
                    )}
                </div>
                <button onClick={onClose}>Готово</button>
            </div>
        </div>
    );
}
