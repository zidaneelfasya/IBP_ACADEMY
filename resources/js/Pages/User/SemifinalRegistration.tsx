"use client";

import type React from "react";

import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    CheckCircle,
    Clock,
    AlertCircle,
    ArrowLeft,
    Upload,
    Users,
    CreditCard,
    FileText,
} from "lucide-react";
import UserLayout from "@/Layouts/UserLayout";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { route } from "ziggy-js"; // Import route from ziggy-js

/* ----------  TYPES  ---------- */
interface Bank {
    id: string;
    name: string;
    account_number: string;
    account_holder: string;
}
interface Team {
    id: number;
    tim_name: string;
    competition_category: { name: string };
    leader_name: string;
    leader_nim: string;
    leader_email: string;
    leader_phone: string;
    leader_univ: string;
    leader_fakultas: string;
    member1_name?: string;
    member1_nim?: string;
    member1_email?: string;
    member1_phone?: string;
    member1_univ?: string;
    member1_fakultas?: string;
    member2_name?: string;
    member2_nim?: string;
    member2_email?: string;
    member2_phone?: string;
    member2_univ?: string;
    member2_fakultas?: string;
}

interface Props {
    team: Team;
    bankOptions: Bank[];
    fixedAmount: number;
    payment: {
        status: "pending" | "verified" | "rejected";
        admin_notes?: string;
    } | null;
    semifinalOpen: boolean;
}

/* ----------  EARLY-BLOCK STATUS  ---------- */
const StatusBlock = ({
    icon,
    title,
    desc,
    children,
    bgColor,
    iconColor,
}: any) => (
    <UserLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                        <div
                            className={`mx-auto mb-6 w-20 h-20 rounded-full ${bgColor} flex items-center justify-center shadow-lg`}
                        >
                            <div className={iconColor}>{icon}</div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            {title}
                        </h1>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {desc}
                        </p>
                        {children}
                        <Button
                            variant="outline"
                            className="mt-6 border-2 hover:bg-gray-50 transition-all duration-200 bg-transparent"
                            onClick={() =>
                                (window.location.href = "/user/dashboard")
                            }
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                            Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    </UserLayout>
);

/* ----------  MAIN COMPONENT  ---------- */
export default function SemifinalRegistration({
    team,
    bankOptions,
    fixedAmount,
    payment,
    semifinalOpen,
}: Props) {
    /* 1. PENDING ➜ tidak bisa upload */
    if (payment?.status === "pending")
        return (
            <StatusBlock
                icon={<Clock className="h-10 w-10" />}
                title="Payment Under Review"
                desc="Your payment proof is being reviewed by our admin team. We'll notify you once it's processed."
                bgColor="bg-amber-100"
                iconColor="text-amber-600"
            />
        );

    /* 2. VERIFIED ➜ tidak bisa upload */
    if (payment?.status === "verified")
        return (
            <StatusBlock
                icon={<CheckCircle className="h-10 w-10" />}
                title="Payment Verified"
                desc="Congratulations! You are successfully registered for the semifinal. Good luck with your competition!"
                bgColor="bg-emerald-100"
                iconColor="text-emerald-600"
            />
        );

    /* 3. REJECTED ➜ bisa re-upload */
    /* 4. BELUM BAYAR (null) ➜ bisa upload */

    /* ----------  FORM UNTUK REJECTED & NULL ---------- */
    return (
        <UploadForm
            {...{ team, bankOptions, fixedAmount, payment, semifinalOpen }}
        />
    );
}

/* ----------  FORM COMPONENT (REJECTED / NULL) ---------- */
function UploadForm({
    team,
    bankOptions,
    fixedAmount,
    payment,
    semifinalOpen,
}: any) {
    const [file, setFile] = useState<File | null>(null);
    const [selectedBank, setSelectedBank] = useState<any>(null);

    const { data, setData, post, processing, reset } = useForm({
        team_id: team.id.toString(),
        bank_name: "",
        account_number: "",
        account_holder: "",
        sender_account_number: "",
        sender_account_holder: "",
        amount: fixedAmount,
        payment_proof: null as File | null,
    });

    const fmt = (v: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(v);

    const handleBank = (val: string) => {
        const b = bankOptions.find((i: any) => i.id === val);
        setSelectedBank(b);
        if (b)
            setData({
                ...data,
                bank_name: b.name,
                account_number: b.account_number,
                account_holder: b.account_holder,
            });
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        if (!f) return;
        const max = 10 * 1024 * 1024;
        const ok = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
        if (f.size > max || !ok.includes(f.type)) {
            alert("Max 10 MB, JPG/PNG/PDF only.");
            e.target.value = "";
            return;
        }
        setFile(f);
        setData("payment_proof", f);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (semifinalOpen) {
            alert("Semifinal already started.");
            return;
        }
        post(route("semifinal.registration.store"), {
            onSuccess: () => {
                reset();
                setFile(null);
                setSelectedBank(null);
            },
            forceFormData: true,
        });
    };

    return (
        <UserLayout>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="container mx-auto px-4 py-8 max-w-6xl">
                    <div className="mb-8">
                        <Button
                            variant="outline"
                            className="mb-6 border-2 hover:bg-white/80 transition-all duration-200 shadow-sm bg-transparent"
                            onClick={() =>
                                (window.location.href = "/user/dashboard")
                            }
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to
                            Dashboard
                        </Button>

                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                                Semifinal Registration
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Complete your payment to secure your spot in the
                                semifinal
                            </p>
                        </div>
                    </div>

                    {payment?.status === "rejected" && (
                        <div className="mb-8 rounded-xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-6 shadow-lg">
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                    <AlertCircle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-red-800 mb-1">
                                        Payment Rejected
                                    </h3>
                                    <p className="text-red-700">
                                        {payment.admin_notes ||
                                            "No reason given"}{" "}
                                        – you may re-upload your payment proof
                                        below.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-2">
                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                                <div className="flex items-center space-x-3">
                                    <Users className="h-6 w-6" />
                                    <div>
                                        <CardTitle className="text-xl">
                                            {team.tim_name}
                                        </CardTitle>
                                        <CardDescription className="text-blue-100">
                                            Category:{" "}
                                            {team.competition_category.name}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-4">
                                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <h4 className="font-semibold text-blue-900">
                                            Team Leader
                                        </h4>
                                    </div>
                                    <p className="font-medium text-gray-900">
                                        {team.leader_name}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {team.leader_univ} -{" "}
                                        {team.leader_fakultas}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {team.leader_email} |{" "}
                                        {team.leader_phone}
                                    </p>
                                </div>

                                {team.member1_name && (
                                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <h4 className="font-semibold text-green-900">
                                                Member 1
                                            </h4>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {team.member1_name}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {team.member1_univ} -{" "}
                                            {team.member1_fakultas}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {team.member1_email} |{" "}
                                            {team.member1_phone}
                                        </p>
                                    </div>
                                )}

                                {team.member2_name && (
                                    <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                            <h4 className="font-semibold text-purple-900">
                                                Member 2
                                            </h4>
                                        </div>
                                        <p className="font-medium text-gray-900">
                                            {team.member2_name}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {team.member2_univ} -{" "}
                                            {team.member2_fakultas}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {team.member2_email} |{" "}
                                            {team.member2_phone}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
                            <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
                                <div className="flex items-center space-x-3">
                                    <CreditCard className="h-6 w-6" />
                                    <div>
                                        <CardTitle className="text-xl">
                                            Payment Proof
                                        </CardTitle>
                                        <CardDescription className="text-emerald-100">
                                            Upload your transfer proof (max 10
                                            MB, JPG/PNG/PDF)
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <form onSubmit={submit} className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">
                                            Destination Bank
                                        </Label>
                                        <Select
                                            onValueChange={handleBank}
                                            value={selectedBank?.id || ""}
                                            required
                                        >
                                            <SelectTrigger className="border-2 focus:border-blue-500 transition-colors">
                                                <SelectValue placeholder="Select destination bank..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {bankOptions.map((b: any) => (
                                                    <SelectItem
                                                        key={b.id}
                                                        value={b.id}
                                                    >
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">
                                                                {b.name}
                                                            </span>
                                                            <span className="text-sm text-gray-500">
                                                                {
                                                                    b.account_number
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    b.account_holder
                                                                }
                                                            </span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-gray-700">
                                                Sender Account Number
                                            </Label>
                                            <Input
                                                placeholder="Your account number"
                                                value={
                                                    data.sender_account_number
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "sender_account_number",
                                                        e.target.value
                                                    )
                                                }
                                                className="border-2 focus:border-blue-500 transition-colors"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-gray-700">
                                                Sender Account Name
                                            </Label>
                                            <Input
                                                placeholder="Your account name"
                                                value={
                                                    data.sender_account_holder
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "sender_account_holder",
                                                        e.target.value
                                                    )
                                                }
                                                className="border-2 focus:border-blue-500 transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">
                                            Payment Amount
                                        </Label>
                                        <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                                            <div className="text-2xl font-bold text-green-700">
                                                {fmt(fixedAmount)}
                                            </div>
                                            <div className="text-sm text-green-600">
                                                Registration fee for semifinal
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-gray-700">
                                            Payment Proof
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.pdf"
                                                onChange={handleFile}
                                                className="border-2 border-dashed border-gray-300 hover:border-blue-400 focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                required
                                            />
                                            <FileText className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                                        </div>
                                        {file && (
                                            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="h-4 w-4 text-blue-600" />
                                                    <span className="text-sm text-blue-700 font-medium">
                                                        {file.name}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing || semifinalOpen}
                                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                                    >
                                        {processing ? (
                                            <div className="flex items-center space-x-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Uploading...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <Upload className="h-5 w-5" />
                                                <span>
                                                    Upload Payment Proof
                                                </span>
                                            </div>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
