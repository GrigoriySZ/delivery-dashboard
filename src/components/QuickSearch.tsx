import { useRef, useEffect } from "react";

interface QuickSearchProps{
    onSearchSubmit: (query: string) => void; 
}

export const QuickSearch = ({onSearchSubmit}: QuickSearchProps): JSX.Element => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    
    const debounceTimeRef = useRef<number | null>(null);
    
    useEffect(() => {
        // При монтировании компонента
        if (inputRef.current) {
            inputRef.current.focus();
        }

        // При размантировании компонента
        return () => {
            if (debounceTimeRef.current) {
                window.clearTimeout(debounceTimeRef.current);
            }
        }
    }, []);

    const handleInputChange = () => {
        if (!inputRef.current) return;
        const currentText = inputRef.current.value;
        // Сброс предыдущего отложенного вызова

        if (debounceTimeRef.current) {
            window.clearTimeout(debounceTimeRef.current);
        }
        // Новый таймер без триггера обнованения всего компонента
        debounceTimeRef.current = window.setTimeout(() => {
            onSearchSubmit(currentText);
        }, 500)
    };

    return (
        <div
            style={{
                marginBottom: '20px',
                backgroundColor: '#d3d4d5',
                padding: '12px'
            }}
        >
            <label htmlFor="search-input" style={{display: 'block', marginBottom: '6px'}}>
                Мгновенный поиск по заказам: 
            </label>
            <input 
                id="search-input"
                ref={inputRef}
                type="text"
                onChange={handleInputChange}
                placeholder="Введите адрес заказа"
                style={{width: '90%', padding: '8px', border: '1px solid #d1d5d8'}}
            />
        </div>
    );
}