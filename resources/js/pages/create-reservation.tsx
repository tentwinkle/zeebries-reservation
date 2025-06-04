import { Toaster, toast } from 'sonner';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select';
import { Head, usePage, Link } from '@inertiajs/react';
import { type SharedData } from '@/types';
import { CheckIcon } from 'lucide-react';
import api from '@/api';

interface Bungalow {
  id: number;
  name: string;
  price: number;
}

interface DiscountCode {
  id: number;
  code: string;
  percentage: number;
}

interface Amenity {
  name: string;
  label: string;
  price: number;
}

export default function CreateReserve() {
  const { auth } = usePage<SharedData>().props;

  const [bungalows, setBungalows] = useState<Bungalow[]>([]);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<Amenity[]>([]);
  const [selectedBungalow, setSelectedBungalow] = useState<Bungalow | null>(null);
  const [discountCode, setDiscountCode] = useState<string>('');
  const [discountValid, setDiscountValid] = useState(true);

  const [personalData, setPersonalData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    postalCode: '',
    phoneNumber: '',
  });

  const [reservationData, setReservationData] = useState({
    startDate: '',
    endDate: '',
    guests: 1,
    phone2: '',
    bungalowId: 0,
  });

  useEffect(() => {
    api.get('/bungalows').then(res => setBungalows(res.data)).catch(console.error);
    api.get('/discount-codes').then(res => setDiscountCodes(res.data)).catch(console.error);
    api.get('/amenities').then(res => setAmenities(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const selectedBungalowId = params.get('id');

    if (bungalows.length && selectedBungalowId) {
      const found = bungalows.find(b => b.id === parseInt(selectedBungalowId));
      console.log(found);
      if (found) {
        setSelectedBungalow(found);
        setReservationData(prev => ({ ...prev, bungalowId: found.id }));
      }
    }
  }, [bungalows]);

  const toggleAmenity = (amenity: Amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPersonalData(prev => ({ ...prev, [id]: value }));
  };

  const handleReservationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setReservationData(prev => ({ ...prev, [id]: value }));
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.trim();
    setDiscountCode(code);
    setDiscountValid(discountCodes.some(dc => dc.code === code));
  };

  const handleSubmit = async () => {
    if (!personalData.firstName || !personalData.lastName || !reservationData.startDate || !selectedBungalow) {
      toast.warning('Vul alle verplichte velden in.');
      return;
    }

    const guestPayload = {
      name: `${personalData.firstName} ${personalData.lastName}`,
      email: personalData.email,
      address: personalData.address,
      postal_code: personalData.postalCode,
      phone_number: personalData.phoneNumber,
    };

    try {
      const guestRes = await api.post('/guests', guestPayload);
      const guestId = guestRes.data.id;

      const reservationPayload = {
        start_date: reservationData.startDate,
        end_date: reservationData.endDate,
        discount_code_id: discountCodes.find(d => d.code === discountCode)?.id,
        bungalow_id: selectedBungalow.id,
        guest_id: guestId,
        total_cost: calculateTotal(),
      };

      await api.post('/reservations', reservationPayload);
      // Show success toast
      toast.success('Reservering succesvol!');
      setTimeout(() => {
        window.location.href = '/';
      }, 2500);
    } catch (err) {
      console.error('Reservering mislukt:', err);
      toast.error('Reservering mislukt. Probeer het opnieuw.');
    }
  };

  const calculateTotal = () => {
    const basePrice = Number(selectedBungalow?.price) || 0;
    const extras = selectedAmenities.reduce((sum, a) => sum + Number(a.price), 0);

    // Calculate number of nights
    const start = new Date(reservationData.startDate);
    const end = new Date(reservationData.endDate);
    const timeDiff = end.getTime() - start.getTime();
    const nights = timeDiff > 0 ? Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) : 0;

    const stayPrice = basePrice * nights;
    const total = stayPrice + extras;

    const discount = discountCodes.find(d => d.code === discountCode)?.percentage || 0;
    return discountValid ? total - (total * discount / 100) : total;
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <Head title="Vakantiepark" />
      <main className="flex w-full flex-row justify-center bg-neutral-50">
        <div className="relative w-full max-w-[1440px] py-8 md:py-16">
          {/* Header */}
          <header className="flex items-center justify-between px-4 md:px-40">
            <h1 className="text-xl font-semibold text-[#009416] md:text-[32px]">Vakantiepark de Zeebries</h1>
            <Link href={auth.user ? route('dashboard') : route('login')}>
              <img className="h-[35px] w-[35px] md:h-[45px] md:w-[45px]" alt="User" src="/icons8-user-96-1.png" />
            </Link>
          </header>

          <div className="space-y-10 px-4 md:px-40 mt-2">
            <h2 className="text-[32px] font-semibold text-black underline">Reseveren</h2>

            {/* Personal Info */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-black">Persoonlijke gegevens</h3>
              <div className="grid grid-cols-2 gap-4 text-black">
                <Input id="firstName" placeholder="Voornaam" value={personalData.firstName} onChange={handlePersonalChange} />
                <Input id="lastName" placeholder="Achternaam" value={personalData.lastName} onChange={handlePersonalChange} />
                <Input id="email" placeholder="E-mailadres" value={personalData.email} onChange={handlePersonalChange} />
                <Input id="address" placeholder="Adres" value={personalData.address} onChange={handlePersonalChange} />
                <Input id="postalCode" placeholder="Postcode" value={personalData.postalCode} onChange={handlePersonalChange} />
                <Input id="phoneNumber" placeholder="Telefoonnummer" value={personalData.phoneNumber} onChange={handlePersonalChange} />
              </div>
            </section>

            {/* Reservation */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-black">Reserveringsdetails</h3>
              <div className="grid grid-cols-2 gap-4 mb-4 text-black">
                <Input id="startDate" placeholder="Aankomst" type="date" value={reservationData.startDate} onChange={handleReservationChange} />
                <Input id="endDate" placeholder="Vertrek" type="date" value={reservationData.endDate} onChange={handleReservationChange} />
              </div>

              {/* Bungalows */}
              <Select
                value={selectedBungalow ? String(selectedBungalow.id) : ''}
                onValueChange={value => {
                  const bungalow = bungalows.find(b => b.id === parseInt(value));
                  if (bungalow) {
                    setSelectedBungalow(bungalow);
                    setReservationData(prev => ({ ...prev, bungalowId: bungalow.id }));
                  }
                }}
              >
                <SelectTrigger className="w-full rounded-[10px]  px-3 py-6 text-lg text-black">
                  <SelectValue placeholder="Kies een bungalow" />
                </SelectTrigger>
                <SelectContent>
                  {bungalows.map(bungalow => (
                    <SelectItem key={bungalow.id} value={String(bungalow.id)}>
                      {bungalow.name} – €{bungalow.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-4 mt-4 text-black">
                <Input id="guests" placeholder="Aantal gasten" type="number" min={1} value={reservationData.guests} onChange={handleReservationChange} />
                <Input id="phone2" placeholder="Telefoonnummer" value={reservationData.phone2} onChange={handleReservationChange} />
              </div>
            </section>

            {/* Amenities */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-black">Extra voorzieningen</h3>
              <div className="space-y-2 text-black">
                {amenities.map(amenity => (
                  <div key={amenity.name} className="flex items-center space-x-3 cursor-pointer" onClick={() => toggleAmenity(amenity)}>
                    <div className={`flex h-5 w-5 items-center justify-center rounded border-2 border-black ${selectedAmenities.includes(amenity) ? 'bg-black' : ''}`}>
                      {selectedAmenities.includes(amenity) && <CheckIcon className="h-3 w-3 text-white" />}
                    </div>
                    <Label className="text-xl">{amenity.label}, +{amenity.price},-</Label>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Methods */}
            <section>
              <h3 className="mb-4 text-xl font-semibold text-black">Betaalmogelijkheden</h3>
              <RadioGroup defaultValue="ideal">
                {['ideal', 'paypal', 'creditcard'].map(method => (
                  <div key={method} className="flex items-center space-x-3 text-black">
                    <div className="flex h-5 w-5 items-center justify-center rounded border-2 border-solid border-black" />
                    <Label htmlFor={method} className="text-xl">{method.charAt(0).toUpperCase() + method.slice(1)}</Label>
                  </div>
                ))}
              </RadioGroup>
            </section>

            {/* Discount Code */}
            <section>
              <h3 className="mb-2 text-xl font-medium text-black">Kortingscode</h3>
              <Input
                value={discountCode}
                onChange={handleDiscountChange}
                placeholder="21MEI"
                className={`w-full text-black ${!discountValid ? 'border border-red-500' : ''}`}
              />
              {!discountValid && <p className="text-sm text-red-500 mt-1">Ongeldige kortingscode</p>}
            </section>

            {/* Total Price */}
            <section>
              <h3 className="mb-4 text-xl font-medium text-black">Prijs</h3>
              <div className="flex items-center px-5 py-2 text-2xl text-black">
                Totaal: €{calculateTotal().toFixed(2)}
              </div>
            </section>

            {/* Pay Button */}
            <div className="flex justify-end">
              <Button onClick={handleSubmit} className="h-[70px] w-[213px] rounded-[35px] bg-[#009416] text-xl text-white hover:bg-[#007812] hover: cursor-pointer">
                Betalen
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
