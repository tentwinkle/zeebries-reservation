import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { type SharedData } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import api from '@/api';

interface Bungalow {
  id: number;
  name: string;
  image: string;
  persons: number;
  bedrooms: number;
  price: number;
  description: string;
  images: string[];
}

export default function Home() {
  const { auth } = usePage<SharedData>().props;
  const [bungalows, setBungalows] = useState<Bungalow[]>([]);
  const [filtered, setFiltered] = useState<Bungalow[]>([]);
  const [search, setSearch] = useState('');
  const [persons, setPersons] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    api.get('/bungalows')
      .then(res => {
        const parsed = res.data.map((b: Bungalow) => ({
          ...b,
          images: typeof b.images === 'string' ? JSON.parse(b.images) : b.images
        }));
        setBungalows(parsed);
        setFiltered(parsed);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    let data = [...bungalows];
    if (search) data = data.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));
    if (persons) data = data.filter(b => b.persons >= parseInt(persons));
    if (price) data = data.filter(b => b.price <= parseFloat(price));
    setFiltered(data);
  }, [search, persons, price, bungalows]);

  return (
    <>
      <Head title="Home">
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>
      <main className="flex w-full flex-row justify-center bg-neutral-50">
        <div className="relative w-full max-w-[1440px] bg-neutral-50 py-8 md:py-16">
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
          </header>

          <section className="mt-8 flex justify-center px-4 md:mt-16">
            <Card className="relative h-[85px] w-full max-w-[795px] rounded-[65px] border-none bg-[#009416]">
              <CardContent className="flex h-full items-center justify-between p-6 pl-12">
                <div className="flex items-center space-x-6">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-white">In/ uitchecken</span>
                    <div className="rounded">
                      <input
                        type="text"
                        placeholder="Datum"
                        className="w-[100px] bg-transparent text-[14px] text-white placeholder-white/60 outline-none"
                      />
                    </div>
                  </div>

                  <Separator orientation="vertical" className="h-9 bg-white/50" />

                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-white">Wie</span>
                    <div className="rounded">
                      <input
                        type="number"
                        value={persons}
                        onChange={e => setPersons(e.target.value)}
                        placeholder="Aantal gasten"
                        className="w-[100px] bg-transparent text-[14px] text-white placeholder-white/60 outline-none"
                      />
                    </div>
                  </div>

                  <Separator orientation="vertical" className="h-9 bg-white/50" />

                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-white">Hoeveel</span>
                    <div className="rounded">
                      <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="Prijs"
                        className="w-[100px] bg-transparent text-[14px] text-white placeholder-white/60 outline-none"
                      />
                    </div>
                  </div>

                  <Separator orientation="vertical" className="h-9 bg-white/50" />

                  <div className="flex flex-col">
                    <span className="text-[14px] font-semibold text-white">Extra voorzieningen</span>
                    <div className="rounded">
                      <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Zoek"
                        className="w-[100px] bg-transparent text-[14px] text-white placeholder-white/60 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex h-[40px] w-[40px] items-start justify-center">
                  <SearchIcon className="h-[30px] w-[30px] text-white" />
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-12 px-4 md:mt-20 md:px-40">
            <h2 className="font-['Inter',Helvetica] text-2xl font-semibold text-black underline md:text-[32px]">Alle bungalows</h2>

            <div className="mt-6 grid grid-cols-1 gap-6 md:mt-10 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
              {filtered.map((bungalow) => (
                <Dialog key={bungalow.id}>
                  <DialogTrigger asChild>
                    <div className="mx-auto w-full max-w-[364px] cursor-pointer transition duration-300 hover:opacity-90">
                      <img className="aspect-square w-full object-cover" alt={`Bungalow ${bungalow.name}`} src={bungalow.image} />
                      <h3 className="mt-3 font-['Inter',Helvetica] text-base font-semibold text-black">Bungalow &quot;{bungalow.name}&quot;</h3>
                      <p className="mt-1 font-['Inter',Helvetica] text-sm font-semibold text-[#00000099]">
                        {bungalow.persons} Personen, {bungalow.bedrooms} Slaapkamers, + Extra Voorzieningen, Basisprijs per nacht {bungalow.price},-
                      </p>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="min-w-[1000px] border-none p-0 shadow-xl">
                    <div className="max-h-[100vh] overflow-y-auto bg-white p-6 md:p-10 rounded-2xl">
                      <h2 className="border-b-2 text-black pb-2 text-3xl font-bold">Bungalow &quot;{bungalow.name}&quot;</h2>

                      <div className="mt-4">
                        <p className="text-base leading-relaxed text-gray-700">{bungalow.description}</p>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                        <img
                          src={bungalow.images[0]}
                          alt={`Bungalow ${bungalow.name} foto 2`}
                          className="h-full w-full object-cover"
                        />
                        <img
                          src={bungalow.images[1]}
                          alt={`Bungalow ${bungalow.name} foto 3`}
                          className="h-full w-full object-cover"
                        />
                        <img
                          src={bungalow.images[2]}
                          alt={`Bungalow ${bungalow.name} foto 4`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="mt-6 flex items-end justify-end">
                        <Link href={route('create-reservation', { id: bungalow.id })}>
                          <Button
                            type="button"
                            className="rounded-full bg-[#009416] px-8 py-6 text-lg font-semibold text-white transition-all hover:bg-[#007812] hover:cursor-pointer"
                          >
                            Reserveren
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
