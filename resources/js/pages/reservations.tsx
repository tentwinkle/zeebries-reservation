/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { JSX, useEffect, useState } from "react";
import { type SharedData } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from '@/api';

export const Reservations = (): JSX.Element => {
  const { auth } = usePage<SharedData>().props;
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    api.get('/reservations').then(res => setReservations(res.data)).catch(console.error);
  }, []);

  function formatDutchDate(dateString: string) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'long'
    }).format(date);
  }

  return (
    <>
      <Head title="Reserveringen" />
      <div className="bg-neutral-50 flex flex-row justify-center w-full min-h-screen">
        <div className="bg-neutral-50 w-[1440px] relative py-16">
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

          <div className="py-2 px-40">
            <Link
              href={route('dashboard')}
              className="font-['Inter',Helvetica] font-normal text-[#009416] text-sm mb-4 block"
            >
              &lt; Terug
            </Link>

            <h2 className="font-['Inter',Helvetica] font-semibold text-black text-[32px] underline mb-16">
              Alle boekingen
            </h2>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-['Inter',Helvetica] font-semibold text-black text-sm">
                    Datum
                  </TableHead>
                  <TableHead className="font-['Inter',Helvetica] font-semibold text-black text-sm">
                    Naam
                  </TableHead>
                  <TableHead className="font-['Inter',Helvetica] font-semibold text-black text-sm">
                    Ordernummer
                  </TableHead>
                  <TableHead className="font-['Inter',Helvetica] font-semibold text-black text-sm">
                    In/uitcheck
                  </TableHead>
                  <TableHead className="font-['Inter',Helvetica] font-semibold text-black text-sm">
                    Prijs
                  </TableHead>
                  <TableHead className="font-['Inter',Helvetica] font-semibold text-black text-sm">
                    Status
                  </TableHead>
                  <TableHead className="font-['Inter',Helvetica] font-semibold text-black text-sm">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation, index) => (
                  <TableRow
                    key={index}
                    className="bg-white rounded-[10px] h-[81px] mb-3"
                  >
                    <TableCell className="opacity-60 font-['Inter',Helvetica] font-normal text-black text-2xl">
                      {new Date(reservation.created_at).toLocaleDateString('en-GB')}
                    </TableCell>
                    <TableCell className="opacity-60 font-['Inter',Helvetica] font-normal text-black text-2xl">
                      {reservation.guest.name}
                    </TableCell>
                    <TableCell className="opacity-60 font-['Inter',Helvetica] font-normal text-black text-2xl">
                      {reservation.id}
                    </TableCell>
                    <TableCell className="opacity-60 font-['Inter',Helvetica] font-normal text-black text-2xl">
                      {formatDutchDate(reservation.start_date)} / {formatDutchDate(reservation.end_date)}
                    </TableCell>
                    <TableCell className="opacity-60 font-['Inter',Helvetica] font-normal text-black text-2xl">
                      {reservation.total_cost}
                    </TableCell>
                    <TableCell>
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
                    <TableCell className="space-x-2">
                      <Button size="sm" onClick={async () => {
                        await api.put(`/reservations/${reservation.id}`, { status: 'confirmed' });
                        const res = await api.get('/reservations');
                        setReservations(res.data);
                      }}>Bevestig</Button>
                      <Button size="sm" onClick={async () => {
                        await api.put(`/reservations/${reservation.id}/cancel`);
                        const res = await api.get('/reservations');
                        setReservations(res.data);
                      }} className="bg-red-600 hover:bg-red-700 text-white">Annuleer</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Reservations;
