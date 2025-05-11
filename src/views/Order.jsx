import { cancelRow } from "../assets/js/script.jsx";
import { Nav } from '../components/Nav.jsx'
import { Header } from '../components/Header.jsx'
import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { FormSelect } from '../components/FormSelect.jsx'
import { FormInput } from '../components/FormInput.jsx'
import { API_URL } from '../../config/config.jsx'
import { AuthContext } from "../../context/AuthContext.jsx";

export const Order = () => {
    const { id } = useParams(); // <-- Para capturar el id si quieres editar
    const isCreating = id === "news";
    const isEditing = id && id !== "news";
    const navigate = useNavigate();
    const { token, logout } = useContext(AuthContext);
    async function onSubmit(e) {
        e.preventDefault()
        console.log('ids', [id, id === "news", isCreating])
        const uri = isCreating ? `${API_URL}/api/order` : `${API_URL}/api/order/${id}`
        const method = isCreating ? "POST" : "PUT"
        const totalCalculated = formData.items.reduce((acc, item) => {
            const valor = parseFloat(item.total_amount || 0);
            return acc + (isNaN(valor) ? 0 : valor);
        }, 0);
        const totalTaxAmount = formData.items.reduce((acc, item) => {
            const valor = parseFloat(item.tax_amount || 0);
            return acc + (isNaN(valor) ? 0 : valor);
        }, 0);
        const totalDiscountAmount = formData.items.reduce((acc, item) => {
            const valor = parseFloat(item.discount_amount || 0);
            return acc + (isNaN(valor) ? 0 : valor);
        }, 0);
        const subtotal = formData.items.reduce((acc, item) => {
            const quantity = parseFloat(item.quantity || 0);
            const unitPrice = parseFloat(item.unit_price || 0);
            const valor = parseFloat(quantity * unitPrice || 0);
            return acc + (isNaN(valor) ? 0 : valor);
        }, 0);
        const dataToSend = {
            ...formData,
            total: totalCalculated.toFixed(2),
            taxAmount: totalTaxAmount.toFixed(2),
            subtotal: subtotal.toFixed(2),
            discountAmount: totalDiscountAmount.toFixed(2),
        };

        if (itemsToDelete.length > 0) {
            for (let i = 0; i < itemsToDelete.length; i++) {
                const element = itemsToDelete[i];
                const res = await fetch(`${API_URL}/api/orderItem/${element}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    }, body: JSON.stringify(itemsToDelete)
                })
                const ok = await res.json()
                console.log('delete', ok)
                
            }
        }
        const res = await fetch(uri, {
            method: method,
            headers: {
                "Content-Type": "application/json",
            }, body: JSON.stringify(dataToSend)

        })

        const ok = await res.json()
        console.log('send order', ok)
        navigate("/orders")
    }
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [itemsToDelete, setItemsToDelete] = useState([]);
    const [newItem, setNewItem] = useState({
        item_id_item: '',
        quantity: '',
        description: '',
        unit_price: '',
        tax_percentage: 0,
        discount_percentage: 0,
        discount_amount: 0,
        total_amount: 0,
        tax_amount: 0,
        id_order_item: ''
    });

    const [formData, setFormData] = useState({
        salesRep: '',
        taxAmount: '',
        memo: '',
        date: new Date().toISOString().split('T')[0],
        discountAmount: '0',
        entityId: '',
        subtotal: 0,
        total: 0,
        items: [],
    });

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(`${API_URL}/api/item`);
                const data = await res.json();
                setItems(data);
            } catch (error) {
                console.error("Error fetching Items:", error);
            }
        };
        const fetchOrders = async () => {
            try {
                const res = await fetch(`${API_URL}/api/order`);
                const data = await res.json();
                setOrders(data);
            } catch (error) {
                console.error("Error fetching Orders:", error);
            }
        };
        const fetchEmployees = async () => {
            const res = await fetch(`${API_URL}/api/entity?entityType=0`);
            const data = await res.json();
            setEmployees(data);
        };

        const fetchCustomers = async () => {
            const res = await fetch(`${API_URL}/api/entity?entityType=1`);
            const data = await res.json();
            setCustomers(data);
        };

        const fetchOrderById = async (id) => {
            let data = {}
            if (id !== 'news') {
                const res = await fetch(`${API_URL}/api/order/${id}`);
                data = await res.json();
            }
            const date = data?.[0]?.created_date.split(' ')
            setFormData({
                salesRep: data?.[0]?.sales_rep || '',
                taxAmount: data?.[0]?.tax_amount || '',
                memo: data?.[0]?.memo_transaction || '',
                discountAmount: data?.[0]?.discount_amount || 0,
                entityId: data?.[0]?.entity_id_entity || '',
                subtotal: data?.[0]?.subtotal || 0,
                total: data?.[0]?.total || 0,
                items: data?.[0]?.items || [],
                date: date[0] || '',
            });
        };

        if (!id) {
            fetchOrders();

        }
        if (isEditing) {
            fetchOrderById(id);
        }
        if (isCreating) {
            setFormData({
                salesRep: '',
                taxAmount: '',
                memo: '',
                discountAmount: '0',
                entityId: '',
                date: new Date().toISOString().split('T')[0],
                subtotal: 0,
                total: 0,
                items: [],
            });

        }

        fetchEmployees();
        fetchCustomers();
        fetchOrders();
        fetchItems();
    }, [id]);

    const addNewItem = (e) => {
        e.preventDefault();

        // Validación mínima
        if (!newItem.item_id_item || !newItem.quantity) return;

        const unitPrice = parseFloat(newItem.unit_price || 0);
        const quantity = parseFloat(newItem.quantity || 0);
        const tax = parseFloat(newItem.tax_percentage || 0);
        const discount = parseFloat(newItem.discount_percentage || 0);
        const baseAmount = unitPrice * quantity;
        
        const discountAmount = (baseAmount) * (discount / 100);
        const taxAmount = (baseAmount) * (tax / 100);
        const total = (baseAmount + taxAmount) - discountAmount;
        console.log( 'baseAmount', baseAmount, 'taxAmount', taxAmount, 'discountAmount', discountAmount,'total', total, )
        const finalItem = {
            ...newItem,
            total_amount: total.toFixed(2),
            tax_amount: taxAmount.toFixed(2),
            discount_amount: discountAmount.toFixed(2),
        };

        setFormData({
            ...formData,
            items: [...formData.items, finalItem]
        });

        setNewItem({
            item_id_item: '',
            quantity: '',
            description: '',
            unit_price: '',
            tax_percentage: 0,
            discount_percentage: 0,
            tax_amount: 0,
            total_amount: 0,
            id_order_item: '',
            discount_amount: 0
        });
    };


    const updateItem = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index][field] = value;
        setFormData({ ...formData, items: updatedItems });
    };

    const handleNewItemChange = (field, value) => {
        setNewItem({ ...newItem, [field]: value });
    };

    const saveEditedItem = (index) => {
        const item = formData.items[index];

        const unitPrice = parseFloat(item.unit_price || 0);
        const quantity = parseFloat(item.quantity || 0);
        const tax = parseFloat(item.tax_percentage || 0);
        const discount = parseFloat(item.discount_percentage || 0);
        const baseAmount = unitPrice * quantity;
        
        const discountAmount = (baseAmount) * (discount / 100);
        const taxAmount = (baseAmount) * (tax / 100);
        const total = (baseAmount + taxAmount) - discountAmount;

        const updatedItems = [...formData.items];
        updatedItems[index] = {
            ...item,
            total_amount: total.toFixed(2),
            tax_amount: taxAmount.toFixed(2),
            discount_amount: discountAmount.toFixed(2),
        };

        setFormData({ ...formData, items: updatedItems });
        setEditingIndex(null); // Salir del modo edición
    };

    const removeItem = (indexToRemove) => {
        const itemToRemove = formData.items[indexToRemove];

        if (itemToRemove.id_order_item) {
            setItemsToDelete(prev => [...prev, itemToRemove.id_order_item]);
        }

        const updatedItems = formData.items.filter((_, index) => index !== indexToRemove);
        setFormData({ ...formData, items: updatedItems });
    };

    useEffect(() => {
        (() => {
            if (!token) {
                navigate("/login");
            }
        })();
    });

    return (
        <>
            <Nav logout={logout} />
            <main>
                <Header />
                <div className="record-title">
                    <h1>Agregar Nueva Orden</h1>
                    <Link to="/orders/news" >Crear Orden</Link>
                    <Link to="/orders">Lista</Link>
                </div>
                {!id && (
                    <div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Número de Transacción</th>
                                    <th>Cliente</th>
                                    <th>Date</th>
                                    <th>Nota</th>
                                    <th>Subtotal</th>
                                    <th>Descuento</th>
                                    <th>Total de Impuestos</th>
                                    <th>Total</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((transaction) => (
                                    <tr key={transaction.id_orders}>
                                        <td>OR-{transaction.id_orders}</td>
                                        <td>{transaction.entity_id_entity}</td>
                                        <td>{transaction.created_date.split(' ')[0]}</td>
                                        <td>{transaction.memo_transaction}</td>
                                        <td>$ {transaction.subtotal}</td>
                                        <td>$ {transaction.discount_amount}</td>
                                        <td>$ {transaction.total}</td>
                                        <td>$ {transaction.tax_amount}</td>
                                        <td>
                                            <button className="submit-btn" onClick={() => {
                                                navigate(`/orders/${transaction.id_orders}`)
                                            }}>Editar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {(isCreating || isEditing) && (
                    <form onSubmit={onSubmit} >
                        <div className="formulario">
                            <FormSelect
                                label="Cliente"
                                id="customer"
                                name="customer"
                                value={formData.entityId}
                                onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                                options={customers.map((entity) => ({
                                    value: entity.id_entity,
                                    label: entity.company_name
                                }))}
                                required
                            />
                            <FormSelect
                                label="Vendedor"
                                id="salesrep"
                                name="salesrep"
                                value={formData.salesRep}
                                onChange={(e) => { setFormData({ ...formData, salesRep: e.target.value }) }}
                                options={employees.map((employee) => ({
                                    value: employee.id_entity,
                                    label: employee.first_name + ' ' + employee.last_name
                                }))}
                                required
                            />
                             <FormInput label="Fecha" type="date" id="date" value={formData.date} disabled />
                            <div className="form-group">
                                <label>Número de Transacción</label>
                                <p>{id == "news" ? "A generar" : 'OR-' + id}</p>
                            </div>
                            <FormInput label="Nota" id="memo" value={formData.memo} onChange={(e) => setFormData({ ...formData, memo: e.target.value })} />
                        </div>
                        <div className="formulario-items">
                            <table id="itemsTable">
                                <thead>
                                    <tr>
                                        <th>Artículo *</th>
                                        <th>Cantidad *</th>
                                        <th>Descripción *</th>
                                        <th>Tarifa *</th>
                                        <th>Impuesto% *</th>
                                        <th>Descuento% *</th>
                                        <th>Importe total</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formData.items.map((item, index) => (
                                        <tr
                                            key={item.id_order_item || index}
                                            onClick={() => {
                                                if (editingIndex !== index) setEditingIndex(index);
                                            }}
                                        >
                                            <td hidden>
                                                {editingIndex === index ? (
                                                    <FormInput
                                                        type="number"
                                                        value={item.id_order_item}
                                                        readOnly
                                                    />
                                                ) : (
                                                    item.id_order_item
                                                )}
                                            </td>
                                            <td>
                                                {editingIndex === index ? (
                                                    <FormSelect
                                                        value={item.item_id_item}
                                                        onChange={(e) => updateItem(index, 'item_id_item', e.target.value)}
                                                        options={items.map((i) => ({
                                                            value: i.id_item,
                                                            label: i.comercial_name
                                                        }))}
                                                    />
                                                ) : (
                                                    items.find(i => i.id_item === item.item_id_item)?.comercial_name || ''
                                                )}
                                            </td>
                                            <td>
                                                {editingIndex === index ? (
                                                    <FormInput
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                                    />
                                                ) : (
                                                    item.quantity
                                                )}
                                            </td>
                                            <td>
                                                {editingIndex === index ? (
                                                    <FormInput
                                                        value={item.description}
                                                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                                                    />
                                                ) : (
                                                    item.description
                                                )}
                                            </td>
                                            <td>
                                                {editingIndex === index ? (
                                                    <FormInput
                                                        value={item.unit_price}
                                                        type="number"
                                                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                                    />
                                                ) : (
                                                    item.unit_price
                                                )}
                                            </td>
                                            <td>
                                                {editingIndex === index ? (
                                                    <FormInput
                                                        value={item.tax_percentage}
                                                        type="number"
                                                        onChange={(e) => updateItem(index, 'tax_percentage', e.target.value)}
                                                    />
                                                ) : (
                                                    item.tax_percentage
                                                )}
                                            </td>
                                            <td>
                                                {editingIndex === index ? (
                                                    <FormInput
                                                        value={item.discount_percentage}
                                                        type="number"
                                                        onChange={(e) => updateItem(index, 'discount_percentage', e.target.value)}
                                                    />
                                                ) : (
                                                    item.discount_percentage
                                                )}
                                            </td>
                                            <td>
                                                {editingIndex === index ? (
                                                    <FormInput
                                                        value={item.total_amount}
                                                        type="number"
                                                        onChange={(e) => updateItem(index, 'total_amount', e.target.value)}
                                                    />
                                                ) : (
                                                    item.total_amount
                                                )}
                                            </td>
                                            <td>
                                                {editingIndex === index ? (
                                                    <button
                                                        type="button"
                                                        className="submit-btn"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // ← evita que el click también active edición de nuevo
                                                            saveEditedItem(index);
                                                        }}
                                                    >
                                                        Guardar
                                                    </button>
                                                ) : <button
                                                    type="button"
                                                    className="submit-btn"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // evita activar la edición
                                                        removeItem(index);
                                                    }}
                                                >
                                                    Eliminar
                                                </button>}
                                            </td>
                                        </tr>
                                    ))}

                                    {/* Línea vacía adicional */}
                                    <tr>
                                        <td>
                                            <FormSelect
                                                value={newItem.item_id_item}
                                                onChange={(e) => handleNewItemChange('item_id_item', e.target.value)}
                                                options={items.map((i) => ({ value: i.id_item, label: i.comercial_name }))}
                                            />
                                        </td>
                                        <td>
                                            <FormInput
                                                type="number"
                                                value={newItem.quantity}
                                                onChange={(e) => handleNewItemChange('quantity', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <FormInput
                                                value={newItem.description}
                                                onChange={(e) => handleNewItemChange('description', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <FormInput
                                                type="number"
                                                value={newItem.unit_price}
                                                onChange={(e) => handleNewItemChange('unit_price', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <FormInput
                                                type="number"
                                                value={newItem.tax_percentage}
                                                onChange={(e) => handleNewItemChange('tax_percentage', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <FormInput
                                                type="number"
                                                value={newItem.discount_percentage}
                                                onChange={(e) => handleNewItemChange('discount_percentage', e.target.value)}
                                            />
                                        </td>
                                    
                                        <td></td>
                                        <td> </td>

                                    </tr>
                                </tbody>
                            </table>
                            <button className="submit-btn" onClick={addNewItem} type="button">
                                Agregar Artículo
                            </button>
                            <button className="cancel-btn" onClick={(e) => cancelRow(e)} type="button">
                                Cancelar Artículo
                            </button>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="submit-btn">Guardar</button>
                            <button type="button" className="cancel-btn" onClick={() => navigate("/orders")}>Cancelar</button>
                        </div>
                    </form>
                )}
            </main>
        </>
    )
}