import { Head, useForm, Link, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { type SharedData } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login() {
    const { data, setData, post, processing, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Log in" />
            <main className="bg-neutral-50 flex flex-row justify-center w-full">
                <div className="bg-neutral-50 w-full max-w-[1440px] min-h-screen relative py-16">
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
                    <form className="border-none shadow-none mx-auto max-w-[567px] py-44" onSubmit={submit}>
                        <div className="p-0 space-y-4">
                            <div className="relative">
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="h-[68px] bg-[#238131] text-white text-xl rounded-[10px] pl-5 placeholder:text-white placeholder:opacity-60"
                                    placeholder="Gebruikersnaam"
                                />
                            </div>

                            <div className="relative">
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="h-[67px] bg-[#238131] text-white text-xl rounded-[10px] pl-5 placeholder:text-white placeholder:opacity-60"
                                    placeholder="Wachtwoord"
                                />
                            </div>

                            <Button className="w-full h-[68px] bg-[#00ba1b] hover:bg-[#00a818] text-white font-semibold text-xl rounded-[10px] hover:cursor-pointer" type="submit" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Inloggen
                            </Button>
                        </div>
                    </form>
                </div>
            </main >
        </>
    );
}
