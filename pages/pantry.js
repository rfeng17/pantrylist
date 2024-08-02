// pages/pantry.js
import { useState, useEffect } from 'react';
import styles from '../styles/Pantry.module.css';
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import Link from 'next/link';

const Pantry = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newItem, setNewItem] = useState('');
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                fetchUserItems(currentUser.uid);
            } else {
                setUser(null);
                setItems([]);
            }
        });
        return () => unsubscribe();
    }, [user]);

    const fetchUserItems = async (uid) => {
        try {
            const itemsCollection = collection(db, 'users', uid, 'items');
            const snapshot = await getDocs(itemsCollection);
            const userItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setItems(userItems);
        } catch (error) {
            console.error('Error fetching user items:', error);
        }
    };

    const addItemToFirestore = async (uid, item) => {
        try {
            const itemsCollection = collection(db, 'users', uid, 'items');
            await addDoc(itemsCollection, item);
        } catch (error) {
            console.error('Error adding item to Firestore:', error);
        }
    };

    const updateItemInFirestore = async (uid, itemId, checked) => {
        try {
            const itemRef = doc(db, 'users', uid, 'items', itemId);
            await updateDoc(itemRef, { checked });
        } catch (error) {
            console.error('Error updating item in Firestore:', error);
        }
    };

    const deleteItemFromFirestore = async (uid, itemId) => {
        try {
            const itemRef = doc(db, 'users', uid, 'items', itemId);
            await deleteDoc(itemRef);
        } catch (error) {
            console.error('Error deleting item from Firestore:', error);
        }
    };

    const handleCheckboxChange = (id) => {
        const updatedItems = items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setItems(updatedItems);
        const changedItem = updatedItems.find(item => item.id === id);
        if (user) {
            updateItemInFirestore(user.uid, id, changedItem.checked);
        }
    };

    const handleRemove = (id) => {
        const updatedItems = items.filter(item => item.id !== id);
        setItems(updatedItems);
        if (user) {
            deleteItemFromFirestore(user.uid, id);
        }
    };

    const handleClear = () => {
        if (user) {
            items.forEach(item => deleteItemFromFirestore(user.uid, item.id));
        }
        setItems([]);
    };

    const handleAddItem = () => {
        if (newItem.trim()) {
            const item = { name: newItem.trim(), checked: false };
            setItems(prevItems => [...prevItems, { id: Date.now(), ...item }]);
            setNewItem('');
            if (user) {
                addItemToFirestore(user.uid, item);
            }
        }
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.navbar}>
                <Link href="/" className={styles.homeLink}>
                    Back to Home
                </Link>
            </div>
            <div className={styles.searchBar}>
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={handleClear}>Clear</button>
            </div>
            <ul className={styles.itemList}>
                {filteredItems.map(item => (
                    <li key={item.id} className={item.checked ? styles.crossed : ''}>
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleCheckboxChange(item.id)}
                        />
                        {item.name}
                        <button onClick={() => handleRemove(item.id)}>x</button>
                    </li>
                ))}
            </ul>
            <div className={styles.addItem}>
                <input
                    type="text"
                    placeholder="Add new item..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                />
                <button onClick={handleAddItem}>Add</button>
            </div>
        </div>
    );
};

export default Pantry;