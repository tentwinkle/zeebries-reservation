<!DOCTYPE html>
<html>
<body>
    <h1>Bevestiging van uw reservering</h1>
    <p>Bungalow: {{ $reservation->bungalow->name }}</p>
    <p>Periode: {{ $reservation->start_date }} - {{ $reservation->end_date }}</p>
    <p>Totaal: &euro;{{ $reservation->total_cost }}</p>
</body>
</html>
