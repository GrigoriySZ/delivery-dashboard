// Generic - параметр типа. Функции для типов
// DeliveryOrder[] <T>-переменнтая, в которую подставляется реальный тип компонента в момент вызова

interface GenericListProps<T> {
    items: T[];
    renderItem: (item: T) => React.ReactNode;
    emptyPlaceholder: string;
}

export const GenericList = <T,>({items, renderItem, emptyPlaceholder}: GenericListProps): JSX.Element => {
    if (items.length === 0) {
        return <p style={{
            textAlign: 'center',
            color: '#9ca3af',
            padding: '24px'
        }}>
            {emptyPlaceholder}
        </p>
    }

    return(
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
            {items.map((item, index) => (
                <div key={index}>
                    {renderItem(item)}
                </div>
            ))}
        </div>
    );
}