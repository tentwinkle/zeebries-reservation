<!DOCTYPE html>
<html>
<body>
    <h1>Bevestiging van uw reservering</h1>
    <p>Bungalows:</p>
    <ul>
        @foreach ($reservation->items as $item)
            <li>{{ $item->bungalow->name }} ({{ $item->guests }} pers.) - &euro;{{ $item->total_cost }}</li>
        @endforeach
    </ul>
    <p>Periode: {{ $reservation->start_date }} - {{ $reservation->end_date }}</p>
    <p>Totaal: &euro;{{ $reservation->total_cost }}</p>
</body>
</html>