/* eslint-disable @typescript-eslint/no-explicit-any */
import { PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import React, { JSX, useEffect, useState } from "react";
import { type SharedData } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from '@/api';

export const Dashboard = (): JSX.Element => {
  const { auth } = usePage<SharedData>().props;
  const [reservations, setReservations] = useState<any[]>([]);
  const [discountCodes, setDiscountCodes] = useState<any[]>([]);
  const [flexiblePriceOptions, setFlexiblePriceOptions] = useState<any[]>([]);
  const [bungalows, setBungalows] = useState<any[]>([]);
  const [dynamicPricing, setDynamicPricing] = useState(false);
  const [newBungalow, setNewBungalow] = useState({
    name: '',
    imageFile: null as File | null,
    price: '',
    persons: '',
    bedrooms: '',
    description: '',
    imagesFiles: [] as File[]
  });
  const [showForm, setShowForm] = useState(false);
  const [amenities, setAmenities] = useState<any[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  // const [guests, setGuests] = useState<any[]>([]);

  useEffect(() => {
    api.get('/reservations').then(res => setReservations(res.data)).catch(console.error);
    api.get('/discount-codes').then(res => setDiscountCodes(res.data)).catch(console.error);
    api.get('/flexible-price-options').then(res => setFlexiblePriceOptions(res.data)).catch(console.error);
    api.get('/bungalows').then(res => setBungalows(res.data)).catch(console.error);
    api.get('/amenities').then(res => setAmenities(res.data)).catch(console.error);
    api.get('/settings/dynamic-pricing').then(res => setDynamicPricing(res.data.dynamic_pricing)).catch(console.error);
    // api.get('/guests').then(res => setGuests(res.data)).catch(console.error);
  }, []);

  const recentReservations = reservations
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3);

  function formatDutchDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long'
    }).format(date);
  }

  const calculateReport = () => {
    const confirmedReservations = reservations.filter(reserve => reserve.status === "confirmed");

    const confirmedCount = confirmedReservations.length;
    const profit = confirmedReservations.reduce(
      (sum: number, a: { total_cost: any }) => sum + Number(a.total_cost),
      0
    );

    return { confirmedCount, profit };
  };

  return (
    <>
      <Head title="Dashboard" />
      <div className="bg-neutral-50 flex flex-row justify-center w-full">
        <div className="bg-neutral-50 w-[1440px] relative py-16">
          {/* Header */}
          <header className="flex items-center justify-between px-4 md:px-40">
            <h1 className="font-['Inter',Helvetica] text-xl font-semibold text-[#009416] md:text-[32px]">Vakantiepark de Zeebries</h1>
            {auth.user ? (
              <Link href={route('dashboard')}>
                <img className="h-[35px] w-[35px] object-cover md:h-[45px] md:w-[45px]" alt="User account" src="/icons8-user-96-1.png" />
              </Link>
            ) : (
              <Link href={route('login')}>
                <img className="h-[35px] w-[35px] object-cover md:h-[45px] md:w-[45px]" alt="User account" src="/icons8-user-96-1.png" />
              </Link>
            )}
            <Button onClick={async () => {
              const newVal = !dynamicPricing;
              await api.put('/settings/dynamic-pricing', { dynamic_pricing: newVal });
              setDynamicPricing(newVal);
            }} className="ml-4">
              {dynamicPricing ? 'Dynamic On' : 'Dynamic Off'}
            </Button>
          </header>

          {/* Dashboard Title */}
          <div className="mt-16 px-40">
            <h2 className="font-semibold text-black text-[32px] underline">
              Dashboard
            </h2>
          </div>

          {/* Reporting Section */}
          <section className="mt-6 px-40">
            <h3 className="font-semibold text-black text-xl mb-4">
              Rapportage (Hudige maand)
            </h3>
            <div className="flex gap-10">
              <Card className="w-[230px] h-[230px] bg-[#00a508] rounded-[25px] border-none">
                <CardContent className="flex flex-col items-center justify-center h-full p-0">
                  <p className="opacity-60 font-semibold text-white text-xl">
                    Omzet
                  </p>
                  <p className="font-semibold text-white text-[40px] mt-4">
                    {calculateReport().profit}
                  </p>
                </CardContent>
              </Card>
              <Card className="w-[230px] h-[230px] bg-[#196dff] rounded-[25px] border-none">
                <CardContent className="flex flex-col items-center justify-center h-full p-0">
                  <p className="opacity-60 font-semibold text-white text-xl">
                    Boekingen
                  </p>
                  <p className="font-semibold text-white text-[40px] mt-4">{calculateReport().confirmedCount}</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Bungalows Section */}
          <section className="mt-16 px-40">
            <h3 className="font-semibold text-black text-xl mb-4">Bungalows</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-black text-sm">Naam</TableHead>
                  <TableHead className="font-semibold text-black text-sm">Prijs</TableHead>
                  <TableHead className="font-semibold text-black text-sm">Personen</TableHead>
                  <TableHead className="font-semibold text-black text-sm">Slaapkamers</TableHead>
                  <TableHead className="font-semibold text-black text-sm">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bungalows.map((b, idx) => (
                  <TableRow key={idx} className="h-[81px] bg-white rounded-[10px]">
                    <TableCell className="opacity-60 font-normal text-black text-2xl">{b.name}</TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">{b.price}</TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">{b.persons}</TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">{b.bedrooms}</TableCell>
                    <TableCell>
                      <Button size="icon" onClick={async () => {
                        await api.delete(`/bungalows/${b.id}`);
                        const res = await api.get('/bungalows');
                        setBungalows(res.data);
                      }} className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700">
                        <TrashIcon className="w-4 h-4 text-white" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center mt-8">
              <Button size="icon" onClick={() => setShowForm(!showForm)} className="w-12 h-12 rounded-3xl bg-[#00a508] hover:bg-[#009407]">
                <PlusIcon className="w-6 h-6 text-white" />
              </Button>
            </div>

            {showForm && (
              <div className="mt-4 space-y-2 text-black">
                <input className="border p-2 w-full" placeholder="Naam" value={newBungalow.name} onChange={e => setNewBungalow({ ...newBungalow, name: e.target.value })} />
                <input type="file" className="border p-2 w-full" onChange={e => setNewBungalow({ ...newBungalow, imageFile: e.target.files ? e.target.files[0] : null })} />
                <input className="border p-2 w-full" placeholder="Prijs" value={newBungalow.price} onChange={e => setNewBungalow({ ...newBungalow, price: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Personen" value={newBungalow.persons} onChange={e => setNewBungalow({ ...newBungalow, persons: e.target.value })} />
                <input className="border p-2 w-full" placeholder="Slaapkamers" value={newBungalow.bedrooms} onChange={e => setNewBungalow({ ...newBungalow, bedrooms: e.target.value })} />
                <textarea className="border p-2 w-full" placeholder="Beschrijving" value={newBungalow.description} onChange={e => setNewBungalow({ ...newBungalow, description: e.target.value })} />
                <input type="file" multiple className="border p-2 w-full" onChange={e => setNewBungalow({ ...newBungalow, imagesFiles: e.target.files ? Array.from(e.target.files) : [] })} />
                <div className="flex flex-wrap gap-2">
                  {amenities.map(am => (
                    <label key={am.id} className="flex items-center space-x-2">
                      <input type="checkbox" checked={selectedAmenities.includes(am.id)} onChange={() => {
                        setSelectedAmenities(prev => prev.includes(am.id) ? prev.filter(a => a !== am.id) : [...prev, am.id]);
                      }} />
                      <span>{am.label}</span>
                    </label>
                  ))}
                </div>
                <Button
                  onClick={async () => {
                    const form = new FormData();
                    form.append('name', newBungalow.name);
                    if (newBungalow.imageFile) form.append('image', newBungalow.imageFile);
                    form.append('price', newBungalow.price);
                    form.append('persons', newBungalow.persons);
                    form.append('bedrooms', newBungalow.bedrooms);
                    form.append('description', newBungalow.description);
                    newBungalow.imagesFiles.forEach(f => form.append('images[]', f));
                    selectedAmenities.forEach(id => form.append('amenities[]', String(id)));
                    await api.post('/bungalows', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                    const res = await api.get('/bungalows');
                    setBungalows(res.data);
                    setNewBungalow({ name: '', imageFile: null, price: '', persons: '', bedrooms: '', description: '', imagesFiles: [] });
                    setSelectedAmenities([]);
                    setShowForm(false);
                  }}
                  className="bg-[#009416] text-white"
                >
                  Opslaan
                </Button>
              </div>
            )}
          </section>

          {/* Recent Bookings Section */}
          <section className="mt-16 px-40">
            <h3 className="font-semibold text-black text-xl mb-4">
              Recente boekingen
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-black text-sm">
                    Datum
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm">
                    Naam
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm">
                    Ordernummer
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm">
                    In/uitcheck
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm">
                    Prijs
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm text-right pr-20">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentReservations.map((reservation, index) => (
                  <TableRow
                    key={index}
                    className="h-[81px] bg-white rounded-[10px]"
                  >
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {new Date(reservation.created_at).toLocaleDateString('en-GB')}
                    </TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {reservation.guest.name}
                    </TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {reservation.id}
                    </TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {formatDutchDate(reservation.start_date)} / {formatDutchDate(reservation.end_date)}
                    </TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {reservation.total_cost}
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <Badge
                        className="w-[120px] h-12 rounded-[25px] flex items-center justify-center"
                        style={{
                          backgroundColor: reservation.status === 'pending' ? '#ff9800' : (reservation.status === 'confirmed' ? '#00a508' : '#a50500')
                        }}
                      >
                        <span className="font-medium text-white text-sm">
                          {reservation.status}
                        </span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center mt-8">
              <Link href={route('reservations')} className="font-semibold text-black text-xl">
                Alle boekingen &gt;
              </Link>
            </div>
          </section>

          {/* Discount Codes Section */}
          <section className="mt-16 px-40">
            <h3 className="font-semibold text-black text-xl mb-4">
              Kortingscode
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-black text-sm">
                    Datum
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm">
                    Code
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm">
                    Korting
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm text-right pr-12">
                    Bewerken
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discountCodes.map((code, index) => (
                  <TableRow
                    key={index}
                    className="h-[81px] bg-white rounded-[10px]"
                  >
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {new Date(code.created_at).toLocaleDateString('en-GB')}
                    </TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {code.code}
                    </TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {code.percentage}%
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          onClick={async () => {
                            const codeVal = prompt('Code', code.code);
                            if (!codeVal) return;
                            const nameVal = prompt('Name', code.name);
                            if (!nameVal) return;
                            const perc = prompt('Percentage', String(code.percentage));
                            if (!perc) return;
                            await api.put(`/discount-codes/${code.id}`, { code: codeVal, name: nameVal, percentage: Number(perc) });
                            const res = await api.get('/discount-codes');
                            setDiscountCodes(res.data);
                          }}
                          className="w-12 h-12 rounded-3xl bg-[#ff9800] hover:bg-[#e68a00]"
                        >
                          <PencilIcon className="w-[18px] h-[18px] text-white" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={async () => {
                            await api.delete(`/discount-codes/${code.id}`);
                            const res = await api.get('/discount-codes');
                            setDiscountCodes(res.data);
                          }}
                          className="w-12 h-12 rounded-3xl bg-[#a50500] hover:bg-[#940500]"
                        >
                          <TrashIcon className="w-5 h-5 text-white" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center mt-8">
              <Button
                size="icon"
                onClick={async () => {
                  const codeVal = prompt('Code');
                  if (!codeVal) return;
                  const nameVal = prompt('Name');
                  if (!nameVal) return;
                  const perc = prompt('Percentage');
                  if (!perc) return;
                  await api.post('/discount-codes', { code: codeVal, name: nameVal, percentage: Number(perc) });
                  const res = await api.get('/discount-codes');
                  setDiscountCodes(res.data);
                }}
                className="w-12 h-12 rounded-3xl bg-[#00a508] hover:bg-[#009407]"
              >
                <PlusIcon className="w-6 h-6 text-white" />
              </Button>
            </div>
          </section>

          {/* Flexible Pricing Options Section */}
          <section className="mt-16 px-40">
            <h3 className="font-semibold text-black text-xl mb-4">
              Flexibele prijsopties
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-black text-sm">
                    Periode
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm">
                    Naam
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm">
                    Korting
                  </TableHead>
                  <TableHead className="font-semibold text-black text-sm text-right pr-12">
                    Bewerken
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flexiblePriceOptions.map((option, index) => (
                  <TableRow
                    key={index}
                    className="h-[81px] bg-white rounded-[10px]"
                  >
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {option.start_date} / {option.end_date}
                    </TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {option.bungalow.name}
                    </TableCell>
                    <TableCell className="opacity-60 font-normal text-black text-2xl">
                      {option.price_modifier}%
                    </TableCell>
                    <TableCell className="flex justify-end">
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          onClick={async () => {
                            const modifier = prompt('Modifier', String(option.price_modifier));
                            if (!modifier) return;
                            const start = prompt('Start date', option.start_date);
                            if (!start) return;
                            const end = prompt('End date', option.end_date);
                            if (!end) return;
                            await api.put(`/flexible-price-options/${option.id}`, { price_modifier: Number(modifier), start_date: start, end_date: end });
                            const res = await api.get('/flexible-price-options');
                            setFlexiblePriceOptions(res.data);
                          }}
                          className="w-12 h-12 rounded-3xl bg-[#ff9800] hover:bg-[#e68a00]"
                        >
                          <PencilIcon className="w-[18px] h-[18px] text-white" />
                        </Button>
                        <Button
                          size="icon"
                          onClick={async () => {
                            await api.delete(`/flexible-price-options/${option.id}`);
                            const res = await api.get('/flexible-price-options');
                            setFlexiblePriceOptions(res.data);
                          }}
                          className="w-12 h-12 rounded-3xl bg-[#a50500] hover:bg-[#940500]"
                        >
                          <TrashIcon className="w-5 h-5 text-white" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-center mt-8">
              <Button
                size="icon"
                onClick={async () => {
                  const bungalowId = prompt('Bungalow ID');
                  if (!bungalowId) return;
                  const modifier = prompt('Modifier');
                  if (!modifier) return;
                  const start = prompt('Start date (YYYY-MM-DD)');
                  if (!start) return;
                  const end = prompt('End date (YYYY-MM-DD)');
                  if (!end) return;
                  await api.post('/flexible-price-options', { bungalow_id: Number(bungalowId), price_modifier: Number(modifier), start_date: start, end_date: end });
                  const res = await api.get('/flexible-price-options');
                  setFlexiblePriceOptions(res.data);
                }}
                className="w-12 h-12 rounded-3xl bg-[#00a508] hover:bg-[#009407]"
              >
                <PlusIcon className="w-6 h-6 text-white" />
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
