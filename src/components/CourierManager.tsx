import { useState, useContext } from "react";
import { TransportType } from "../types/delivery";
import { useDelivery } from "../context/DeliveryContext";

export const CourierManager = (): JSX.Element => {

    const { state, addCourier } = useDelivery();
    const { couriers } = state;

    const [selectedTransport, setSelectedTransport] = useState<TransportType | null>(null);
    const [newCourierName, setNewCourierName] = useState<string>('');

    const handleAddCourier = (e: React.SubmitEvent) => {
        e.preventDefault();
        addCourier(newCourierName, selectedTransport);
        setNewCourierName('');
        setSelectedTransport(null);
    };

    return (
        <div
            style={{
                padding: '16px',
                border: '1px dashed #a584fc'
            }}
        >
            <h3>Регистрация курьеров подразделения</h3>
            <form
                onSubmit={handleAddCourier}
                style={{
                    marginBottom: '16px',
                    display: 'flex',
                    gap: '8px',
                }}
            >   
                <input 
                    type="text" 
                    value={newCourierName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCourierName(e.target.value)}
                    placeholder="ФИО курьера"
                    style={{ padding: '6px', border: '1px solid #ccc'}}
                />
                <select
                    value={selectedTransport || ''}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedTransport(e.target.value as TransportType)}
                    style={{ padding: '6px', border: '1px solid #ccc'}}
                >
                    <option value='' style={{display: 'none'}} disabled>Веберите транспорт</option>
                    <option value='Car'>Машина</option>
                    <option value='Bicycle'>Велосипед</option>
                    <option value='Foot'>Пешком</option>
                </select>
                <button 
                    type="submit"
                    style={{
                        backgroundColor: '#10b981',
                        color: '#fff',
                        padding: '6px 12px',
                        border: 'none'
                    }}
                >
                    Добавить
                </button>
            </form>
            <ul>
                {couriers.map(c => (
                    <li key={c.id}>
                        <b>{c.name}</b>-{c.transport} {
                            c.currentOrderId ? `(В пути: ${c.currentOrderId})` : '(Свободен)'
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
}