"use client";

import { useForm } from "@inertiajs/react";
import { useState } from "react";
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
import { Upload, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

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
}

export default function SemifinalRegistration({
    team,
    bankOptions,
    fixedAmount,
}: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [errorMessage, setErrorMessage] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        team_id: team.id.toString(),
        bank_name: "",
        account_number: "",
        account_holder: "",
        amount: fixedAmount.toString(),
        payment_proof: null as File | null,
    });

    const handleBankChange = (value: string) => {
        if (value === "manual") {
            setData("bank_name", "");
            setData("account_number", "");
            setData("account_holder", "");
        } else {
            const bank = bankOptions.find((b) => b.id === value);
            if (bank) {
                setData("bank_name", bank.name);
                setData("account_number", bank.account_number);
                setData("account_holder", bank.account_holder);
            }
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            const max = 10 * 1024 * 1024;
            const allowed = ["image/jpeg", "image/png", "application/pdf"];

            if (f.size > max) {
                setErrorMessage("Max 10 MB.");
                setModalType("error");
                setShowModal(true);
                e.target.value = "";
                return;
            }
            if (!allowed.includes(f.type)) {
                setErrorMessage("Format JPG, PNG, PDF.");
                setModalType("error");
                setShowModal(true);
                e.target.value = "";
                return;
            }
            setFile(f);
            setData("payment_proof", f);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.bank_name || !data.account_number || !data.account_holder) {
            setErrorMessage("Complete bank details.");
            setModalType("error");
            setShowModal(true);
            return;
        }
        if (!data.payment_proof) {
            setErrorMessage("Upload proof.");
            setModalType("error");
            setShowModal(true);
            return;
        }

        post(route("semifinal.registration.store"), {
            onSuccess: () => {
                setModalType("success");
                setShowModal(true);
            },
            onError: (errs) => {
                setErrorMessage(Object.values(errs).join(" "));
                setModalType("error");
                setShowModal(true);
            },
            forceFormData: true,
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Semifinal Registration</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Team: {team.tim_name}</CardTitle>
                    <CardDescription>
                        Category: {team.competition_category.name}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Bank Select */}
                        <div>
                            <Label>Payment Method</Label>
                            <Select onValueChange={handleBankChange} required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose bank..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {bankOptions.map((b) => (
                                        <SelectItem key={b.id} value={b.id}>
                                            {b.name} - {b.account_number}
                                        </SelectItem>
                                    ))}
                                    <SelectItem value="manual">
                                        Manual / Other Bank
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Manual Input (jika manual) */}
                        {data.bank_name === "" && (
                            <>
                                <Input
                                    placeholder="Bank Name"
                                    value={data.bank_name}
                                    onChange={(e) =>
                                        setData("bank_name", e.target.value)
                                    }
                                />
                                <Input
                                    placeholder="Account Number"
                                    value={data.account_number}
                                    onChange={(e) =>
                                        setData(
                                            "account_number",
                                            e.target.value
                                        )
                                    }
                                />
                                <Input
                                    placeholder="Account Holder"
                                    value={data.account_holder}
                                    onChange={(e) =>
                                        setData(
                                            "account_holder",
                                            e.target.value
                                        )
                                    }
                                />
                            </>
                        )}

                        {/* Amount */}
                        <div>
                            <Label>Amount</Label>
                            <Input
                                value={`IDR ${fixedAmount.toLocaleString()}`}
                                readOnly
                            />
                        </div>

                        {/* Upload */}
                        <div>
                            <Label>Payment Proof</Label>
                            <Input
                                type="file"
                                accept="image/jpeg,image/png,application/pdf"
                                onChange={handleFileChange}
                            />
                            {file && (
                                <p className="text-sm mt-1">{file.name}</p>
                            )}
                        </div>

                        <Button type="submit" disabled={processing}>
                            {processing
                                ? "Processing..."
                                : "Register for Semifinal"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Modal */}
            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {modalType === "success" ? (
                                <>
                                    <CheckCircle className="inline mr-2 text-green-500" />
                                    Success
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="inline mr-2 text-red-500" />
                                    Error
                                </>
                            )}
                        </DialogTitle>
                        <p>{errorMessage}</p>
                    </DialogHeader>
                    <Button
                        onClick={() =>
                            modalType === "success"
                                ? (window.location.href = "/dashboard")
                                : setShowModal(false)
                        }
                    >
                        {modalType === "success"
                            ? "Back to Dashboard"
                            : "Try Again"}
                    </Button>
                </DialogContent>
            </Dialog>
        </div>
    );
}

