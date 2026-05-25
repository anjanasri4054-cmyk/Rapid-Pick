// src/pages/admin/AdminMenu.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import AdminNav from '../../components/admin/AdminNav';

const EMPTY_ITEM = {
    name: '',
    description: '',
    price: '',
    category: 'breakfast',
    image: '',
    isVeg: true,
    available: true,
    prepTime: 10,
    rating: 4.0
};

const CATEGORIES = ['breakfast', 'lunch', 'snacks', 'dinner', 'beverages'];

export default function AdminMenu() {
    const { menu, addItem, updateItem, deleteItem, toggleAvailability } = useMenu();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(EMPTY_ITEM);
    const [filterCat, setFilterCat] = useState('all');

    const openAdd = () => {
        setForm(EMPTY_ITEM);
        setEditingId(null);
        setShowForm(true);
    };

    const openEdit = (item) => {
        setForm(item);
        setEditingId(item.id);
        setShowForm(true);
    };

    const handleSave = () => {
        const data = {
            ...form,
            price: Number(form.price),
            prepTime: Number(form.prepTime),
            rating: Number(form.rating)
        };

        if (editingId) {
            updateItem(editingId, data);
        } else {
            addItem(data);
        }
        setShowForm(false);
    };

    const filteredMenu = filterCat === 'all'
        ? menu
        : menu.filter(item => item.category === filterCat);

    return (
        <div className="min-h-screen bg-background">
            <AdminNav />
            <div className="md:ml-64 p-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold">Menu Management</h1>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-2xl font-semibold hover:bg-primary/90 transition"
                    >
                        <Plus size={18} /> Add New Item
                    </button>
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 mb-8 flex-wrap">
                    {['all', ...CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilterCat(cat)}
                            className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${filterCat === cat
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredMenu.map(item => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className={`bg-card border border-border rounded-3xl overflow-hidden ${!item.available ? 'opacity-75' : ''}`}
                            >
                                <div className="relative h-48">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button
                                            onClick={() => openEdit(item)}
                                            className="w-9 h-9 bg-white/90 hover:bg-white rounded-xl flex items-center justify-center"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => deleteItem(item.id)}
                                            className="w-9 h-9 bg-white/90 hover:bg-white rounded-xl flex items-center justify-center text-red-500"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-semibold text-lg">{item.name}</h3>
                                        <span className="font-bold text-xl text-primary">₹{item.price}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="capitalize px-3 py-1 bg-muted rounded-full">{item.category}</span>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <span className="text-muted-foreground">Available</span>
                                            <input
                                                type="checkbox"
                                                checked={item.available}
                                                onChange={() => toggleAvailability(item.id)}
                                                className="w-4 h-4 accent-primary"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Add/Edit Modal */}
                <AnimatePresence>
                    {showForm && (
                        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-card border border-border rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            >
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">
                                            {editingId ? 'Edit Menu Item' : 'Add New Item'}
                                        </h2>
                                        <button onClick={() => setShowForm(false)}>
                                            <X size={24} />
                                        </button>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label className="text-sm font-medium block mb-2">Item Name</label>
                                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-border bg-input" />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium block mb-2">Description</label>
                                            <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-border bg-input resize-none" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium block mb-2">Price (₹)</label>
                                                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-border bg-input" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium block mb-2">Prep Time (min)</label>
                                                <input type="number" value={form.prepTime} onChange={e => setForm({ ...form, prepTime: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-border bg-input" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium block mb-2">Category</label>
                                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-3 rounded-2xl border border-border bg-input">
                                                {CATEGORIES.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium block mb-2">Image URL</label>
                                            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://" className="w-full px-4 py-3 rounded-2xl border border-border bg-input" />
                                        </div>

                                        <label className="flex items-center gap-3">
                                            <input type="checkbox" checked={form.isVeg} onChange={e => setForm({ ...form, isVeg: e.target.checked })} />
                                            Vegetarian Item
                                        </label>

                                        <button onClick={handleSave} className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-2xl hover:bg-primary/90">
                                            {editingId ? 'Update Item' : 'Add Item'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}