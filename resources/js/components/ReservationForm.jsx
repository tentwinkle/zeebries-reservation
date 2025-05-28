import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Formulier om een reservering te maken
export default function ReservationForm() {
    const [bungalows, setBungalows] = useState([]);
    const [form, setForm] = useState({
        guest_id: '',
        bungalow_id: '',
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        axios.get('/api/bungalows').then(r => setBungalows(r.data));
    }, []);

    const submit = e => {
        e.preventDefault();
        axios.post('/api/reservations', form).then(() => alert('Reservering opgeslagen'));
    };

    return (
        <form onSubmit={submit}>
            <div>
                <label>Gast ID</label>
                <input value={form.guest_id} onChange={e => setForm({...form, guest_id: e.target.value})}/>
            </div>
            <div>
                <label>Bungalow</label>
                <select value={form.bungalow_id} onChange={e => setForm({...form, bungalow_id: e.target.value})}>
                    <option value="">Kies een bungalow</option>
                    {bungalows.map(b => (
                        <option key={b.id} value={b.id}>{b.number}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Start</label>
                <input type="date" value={form.start_date} onChange={e => setForm({...form, start_date: e.target.value})}/>
            </div>
            <div>
                <label>Einde</label>
                <input type="date" value={form.end_date} onChange={e => setForm({...form, end_date: e.target.value})}/>
            </div>
            <button type="submit">Reserveer</button>
        </form>
    );
}
