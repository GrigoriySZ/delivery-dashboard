import { useState } from 'react';
import { GenericList } from './components/GenericList';
import { DeliveryCard } from './components/DeliveryCard';
import { useDelivery } from './context/DeliveryContext';
import { CourierManager } from './components/CourierManager';
import { QuickSearch } from './components/QuickSearch';
import { OrderManagementModal } from './components/OrderManagementModal';

const DashboardConsole = (): JSX.Element => {
  const { state, assignCourierToOrder, updateOrderStatus } = useDelivery();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (state.status === 'LOADING') return <h2>Загрузка данных</h2>;
  if (state.status === 'ERROR') return <h2>{state.message}</h2>

  // const filteredOrders = state.status === 'SUCCESS' ? state.data : []; -- заглушка
  const filteredOrders = state.data.filter(order => 
    order.customAdress.toLowerCase().includes(searchQuery.toLowerCase()) || 
    order.id.includes(searchQuery)
  );

  // const handleInteractOrder = (id: string) => {
  //   const courierName = prompt('Введите имя курьера');
  //   if (courierName) {
  //     assignCourierToOrder(id, courierName)
  //   }
  // };
  
  const activeOrder = state.data.find(order => order.id === selectedOrderId);

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px'
    }}>
      <header style={{
        borderBottom: '3px solid #4f46e5',
        padding: '12px',
        marginBottom: '24px'
      }}>
        <h1>Delivery Dashboard</h1>
      </header>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '24px'
      }}>
        <div>
          <QuickSearch onSearchSubmit={(query) => setSearchQuery(query)}/>
          <h2>Активные заказы</h2>
          <GenericList 
            items={filteredOrders} 
            renderItem={(order) => (
              <DeliveryCard 
                order={order}
                onSelectedOrder={(id) => setSelectedOrderId(id)}
              />
            )} 
            emptyPlaceholder='Заказы не найдены' 
          />
        </div>
        <div>
          <h2>Персонал</h2>
            <CourierManager />
        </div>
      </div>
      {activeOrder && (
        <OrderManagementModal 
          order={activeOrder}
          onClose={() => setSelectedOrderId(null)}
          onUpdateStatus={updateOrderStatus}
          onAssignCourier={assignCourierToOrder}
        />
      )}
    </div>
  )
}

export default DashboardConsole;