"use client";

import { useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    Clock,
    CheckSquare,
} from "lucide-react";
import { Progress } from "@/Components/ui/progress";

interface Props {
    team: {
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
    };
    bankOptions: Array<{
        id: string;
        name: string;
        account_number: string;
        account_holder: string;
    }>;
    fixedAmount: number;
    paymentExists: boolean;
    paymentStatus?: string;
    semifinalStatus?: string; // Add semifinal status
}

export default function SemifinalRegistration({
    team,
    bankOptions,
    fixedAmount,
    paymentExists,
    paymentStatus,
    semifinalStatus, // Receive semifinal status
}: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMsg, setModalMsg] = useState("");
    const [modalSuccess, setModalSuccess] = useState(true);
    const [selectedBank, setSelectedBank] = useState<string>("");

    const { data, setData, post, processing, errors } = useForm({
        team_id: team.id.toString(),
        bank_name: "",
        account_number: "",
        account_holder: "",
        sender_account_number: "",
        sender_account_holder: "",
        amount: fixedAmount,
        payment_proof: null as File | null,
    });

    useEffect(() => {
        // If there's already a payment or semifinal progress, show appropriate modal
        if (paymentExists || semifinalStatus) {
            let message = "";

            if (semifinalStatus === "not_started") {
                message =
                    "Your payment is being verified by admin. Please wait for further confirmation.";
            } else if (semifinalStatus === "in_progress") {
                message =
                    "Your team has successfully registered for the semifinal round.";
            } else if (paymentStatus === "pending") {
                message =
                    "Your payment is being verified by admin. Please wait for further confirmation.";
            } else if (paymentStatus === "approved") {
                message =
                    "Your team has successfully registered for the semifinal round.";
            }

            setModalMsg(message);
            setModalSuccess(true);
            setModalOpen(true);
        }
    }, [paymentExists, paymentStatus, semifinalStatus]);

    const handleBankChange = (value: string) => {
        setSelectedBank(value);
        const bank = bankOptions.find((b) => b.id === value);
        if (bank) {
            setData({
                ...data,
                bank_name: bank.name,
                account_number: bank.account_number,
                account_holder: bank.account_holder,
            });
        }
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        const max = 10 * 1024 * 1024;
        const allowed = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "application/pdf",
        ];

        if (f.size > max || !allowed.includes(f.type)) {
            setModalMsg("File max 10 MB, format JPG/PNG/PDF.");
            setModalSuccess(false);
            setModalOpen(true);
            e.target.value = "";
            return;
        }

        setFile(f);
        setData("payment_proof", f);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !data.bank_name ||
            !data.account_number ||
            !data.account_holder ||
            !data.sender_account_number ||
            !data.sender_account_holder
        ) {
            setModalMsg(
                "Please complete all bank and sender account information."
            );
            setModalSuccess(false);
            setModalOpen(true);
            return;
        }

        if (!data.payment_proof) {
            setModalMsg("Please upload payment proof.");
            setModalSuccess(false);
            setModalOpen(true);
            return;
        }

        post(route("semifinal.registration.store"), {
            onSuccess: () => {
                setModalMsg(
                    "Semifinal registration successful! Waiting for admin verification."
                );
                setModalSuccess(true);
                setModalOpen(true);
            },
            onError: (errs) => {
                // Handle errors from Laravel validation
                const errorMessage =
                    typeof errs === "string"
                        ? errs
                        : Object.values(errs).join(" ");
                setModalMsg(errorMessage);
                setModalSuccess(false);
                setModalOpen(true);
            },
            forceFormData: true,
        });
    };

    const MemberCard = ({
        title,
        name,
        nim,
        email,
        phone,
        univ,
        fakultas,
    }: any) =>
        name ? (
            <div className="p-3 bg-muted rounded-md">
                <h4 className="font-semibold text-primary">{title}</h4>
                <p>
                    {name} ({nim})
                </p>
                <p className="text-sm">
                    {univ} - {fakultas}
                </p>
                <p className="text-sm">
                    {email} | {phone}
                </p>
            </div>
        ) : null;

    // If there's already a payment or semifinal progress, show status
    if (paymentExists || semifinalStatus) {
        let statusText = "";
        let statusDescription = "";
        let icon = <Clock className="h-12 w-12" />;

        if (semifinalStatus === "not_started" || paymentStatus === "pending") {
            statusText = "Waiting for Payment Verification";
            statusDescription =
                "Your payment is being verified by admin. Please wait for further confirmation.";
        } else if (
            semifinalStatus === "in_progress" ||
            paymentStatus === "approved"
        ) {
            statusText = "Payment Verified";
            statusDescription =
                "Your payment has been verified. Your team is registered for the semifinal.";
            icon = <CheckSquare className="h-12 w-12" />;
        }

        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Button
                    variant="outline"
                    className="mb-6"
                    onClick={() => (window.location.href = "/dashboard/user")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <div
                        className={`rounded-full p-4 ${
                            semifinalStatus === "not_started" ||
                            paymentStatus === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-green-100 text-green-800"
                        }`}
                    >
                        {icon}
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">{statusText}</h1>
                        <p className="text-muted-foreground">
                            {statusDescription}
                        </p>
                    </div>

                    {(semifinalStatus === "not_started" ||
                        paymentStatus === "pending") && (
                        <div className="w-full max-w-md space-y-2">
                            <Progress value={50} className="h-2" />
                            <p className="text-sm text-muted-foreground">
                                Admin verification process
                            </p>
                        </div>
                    )}

                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Team Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>
                                <strong>Team Name:</strong> {team.tim_name}
                            </p>
                            <p>
                                <strong>Category:</strong>{" "}
                                {team.competition_category.name}
                            </p>
                            <p>
                                <strong>Status:</strong>
                                <span
                                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                                        semifinalStatus === "not_started" ||
                                        paymentStatus === "pending"
                                            ? "bg-amber-100 text-amber-800"
                                            : "bg-green-100 text-green-800"
                                    }`}
                                >
                                    {semifinalStatus === "not_started" ||
                                    paymentStatus === "pending"
                                        ? "Waiting Verification"
                                        : "Verified"}
                                </span>
                            </p>
                        </CardContent>
                    </Card>

                    <Button
                        onClick={() =>
                            (window.location.href = "/dashboard/user")
                        }
                    >
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Button
                variant="outline"
                className="mb-6"
                onClick={() => (window.location.href = "/dashboard/user")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>

            <h1 className="text-3xl font-bold mb-6">Semifinal Registration</h1>

            {/* TEAM DETAIL */}
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Team: {team.tim_name}</CardTitle>
                    <CardDescription>
                        Category: {team.competition_category.name}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Leader Info */}
                    <div className="p-3 bg-muted rounded-md">
                        <h4 className="font-semibold text-primary">Leader</h4>
                        <p>
                            {team.leader_name} ({team.leader_nim})
                        </p>
                        <p className="text-sm">
                            {team.leader_univ} - {team.leader_fakultas}
                        </p>
                        <p className="text-sm">
                            {team.leader_email} | {team.leader_phone}
                        </p>
                    </div>

                    <MemberCard
                        title="Member 1"
                        name={team.member1_name}
                        nim={team.member1_nim}
                        email={team.member1_email}
                        phone={team.member1_phone}
                        univ={team.member1_univ}
                        fakultas={team.member1_fakultas}
                    />
                    <MemberCard
                        title="Member 2"
                        name={team.member2_name}
                        nim={team.member2_nim}
                        email={team.member2_email}
                        phone={team.member2_phone}
                        univ={team.member2_univ}
                        fakultas={team.member2_fakultas}
                    />
                </CardContent>
            </Card>

            {/* PAYMENT FORM */}
            <Card>
                <CardHeader>
                    <CardTitle>Payment Form</CardTitle>
                    <CardDescription>
                        Complete payment information to register for the
                        semifinal
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="bank">
                                Select Destination Bank
                            </Label>
                            <Select
                                onValueChange={handleBankChange}
                                value={selectedBank}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select destination bank..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {bankOptions.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name} - {b.account_number} (
                                            {b.account_holder})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {selectedBank && (
                            <div className="p-3 bg-muted rounded-md">
                                <h4 className="font-semibold">
                                    Destination Bank:
                                </h4>
                                <p>
                                    {data.bank_name} - {data.account_number}
                                </p>
                                <p>Account Holder: {data.account_holder}</p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="sender_account_number">
                                Sender Account Information
                            </Label>
                            <Input
                                placeholder="Your Account Number (sender)"
                                value={data.sender_account_number}
                                onChange={(e) =>
                                    setData(
                                        "sender_account_number",
                                        e.target.value
                                    )
                                }
                                required
                            />
                            <Input
                                placeholder="Your Account Holder Name"
                                value={data.sender_account_holder}
                                onChange={(e) =>
                                    setData(
                                        "sender_account_holder",
                                        e.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="amount">Transfer Amount</Label>
                            <Input
                                value={`IDR ${fixedAmount.toLocaleString()}`}
                                readOnly
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="payment_proof">Payment Proof</Label>
                            <Input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg,application/pdf"
                                onChange={handleFile}
                                required
                            />
                            <p className="text-sm text-muted-foreground">
                                Format: JPG, PNG, PDF (Max. 10MB)
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full"
                        >
                            {processing ? "Processing..." : "Register"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Modal */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {modalSuccess ? (
                                <CheckCircle className="text-green-500" />
                            ) : (
                                <AlertCircle className="text-red-500" />
                            )}
                            {modalSuccess ? "Success" : "Error"}
                        </DialogTitle>
                        <p className="mt-2">{modalMsg}</p>
                        <div className="mt-4 flex justify-end">
                            <Button
                                onClick={() =>
                                    modalSuccess
                                        ? (window.location.href =
                                              "/dashboard/user")
                                        : setModalOpen(false)
                                }
                            >
                                {modalSuccess ? "Back to Dashboard" : "Close"}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
