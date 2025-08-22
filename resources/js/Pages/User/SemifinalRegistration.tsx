import { useForm } from "@inertiajs/react";
import type React from "react";
import { useState } from "react";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import {
    Upload,
    CreditCard,
    Users,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
} from "lucide-react";

interface Props {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function SemifinalRegistration({ flash }: Props) {
    const [file, setFile] = useState<File | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<"success" | "error">("success");
    const [errorMessage, setErrorMessage] = useState("");

    const { data, setData, post, processing, errors } = useForm({
        teamName: "",
        paymentMethod: "",
        paymentProof: null as File | null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const maxSize = 10 * 1024 * 1024; // 10MB in bytes

            if (selectedFile.size > maxSize) {
                setErrorMessage(
                    "File size exceeds 10MB limit. Please choose a smaller file."
                );
                setModalType("error");
                setShowModal(true);
                e.target.value = ""; // Clear the input
                return;
            }

            const allowedTypes = [
                "image/jpeg",
                "image/jpg",
                "image/png",
                "application/pdf",
            ];

            if (!allowedTypes.includes(selectedFile.type)) {
                setErrorMessage(
                    "Invalid file type. Please upload JPG, PNG, or PDF files only."
                );
                setModalType("error");
                setShowModal(true);
                e.target.value = ""; // Clear the input
                return;
            }

            setFile(selectedFile);
            setData("paymentProof", selectedFile);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.teamName.trim()) {
            setErrorMessage("Team name is required.");
            setModalType("error");
            setShowModal(true);
            return;
        }

        if (!data.paymentMethod.trim()) {
            setErrorMessage("Payment method is required.");
            setModalType("error");
            setShowModal(true);
            return;
        }

        if (!data.paymentProof) {
            setErrorMessage("Payment proof is required.");
            setModalType("error");
            setShowModal(true);
            return;
        }

        post(route("semifinal.registration.store"), {
            onSuccess: () => {
                setModalType("success");
                setShowModal(true);
            },
            onError: (errors) => {
                setErrorMessage(Object.values(errors).join("\n"));
                setModalType("error");
                setShowModal(true);
            },
        });
    };

    const handleBackToDashboard = () => {
        window.location.href = "/dashboard"; // Ganti dengan route dashboard Anda
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary mb-2">
                    Semifinal Registration
                </h1>
                <p className="text-lg text-accent">
                    Secure your team's spot by completing the form below
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Registration Form
                        </CardTitle>
                        <CardDescription>
                            Complete team details and upload payment proof
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                            encType="multipart/form-data"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="teamName">Team Name</Label>
                                <Input
                                    id="teamName"
                                    type="text"
                                    placeholder="Enter your team name"
                                    value={data.teamName}
                                    onChange={(e) =>
                                        setData("teamName", e.target.value)
                                    }
                                    required
                                    className="bg-input"
                                />
                                {errors.teamName && (
                                    <p className="text-red-500 text-sm">
                                        {errors.teamName}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentMethod">
                                    Payment Method
                                </Label>
                                <Textarea
                                    id="paymentMethod"
                                    placeholder="Example: BCA Bank Transfer, DANA E-wallet, etc."
                                    value={data.paymentMethod}
                                    onChange={(e) =>
                                        setData("paymentMethod", e.target.value)
                                    }
                                    required
                                    className="bg-input min-h-[80px]"
                                />
                                {errors.paymentMethod && (
                                    <p className="text-red-500 text-sm">
                                        {errors.paymentMethod}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="paymentProof">
                                    Upload Payment Proof
                                </Label>
                                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-card">
                                    <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                    <div className="space-y-2">
                                        <p className="text-sm text-foreground">
                                            Click to upload or drag & drop file
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Format: JPG, PNG, PDF (Max. 10MB)
                                        </p>
                                    </div>
                                    <Input
                                        id="paymentProof"
                                        name="paymentProof"
                                        type="file"
                                        accept="image/*,.pdf"
                                        onChange={handleFileChange}
                                        required
                                        className="mt-4"
                                    />
                                    {file && (
                                        <p className="mt-2 text-sm text-primary">
                                            Selected file: {file.name}
                                        </p>
                                    )}
                                    {errors.paymentProof && (
                                        <p className="text-red-500 text-sm">
                                            {errors.paymentProof}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={
                                    processing ||
                                    !data.teamName ||
                                    !data.paymentMethod ||
                                    !data.paymentProof
                                }
                            >
                                {processing
                                    ? "Processing..."
                                    : "Register for Semifinal"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Admin Account Information
                        </CardTitle>
                        <CardDescription>
                            Transfer registration fee to one of the following
                            accounts
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-muted rounded-lg">
                            <h3 className="font-semibold text-foreground mb-2">
                                BCA Bank
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                                Account Number:
                            </p>
                            <p className="font-mono text-lg font-bold text-primary">
                                1234567890
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                                Account Name:
                            </p>
                            <p className="font-semibold text-foreground">
                                Admin Tournament
                            </p>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                            <h3 className="font-semibold text-foreground mb-2">
                                Mandiri Bank
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                                Account Number:
                            </p>
                            <p className="font-mono text-lg font-bold text-primary">
                                0987654321
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                                Account Name:
                            </p>
                            <p className="font-semibold text-foreground">
                                Admin Tournament
                            </p>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                            <h3 className="font-semibold text-foreground mb-2">
                                DANA
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                                Phone Number:
                            </p>
                            <p className="font-mono text-lg font-bold text-primary">
                                081234567890
                            </p>
                            <p className="text-sm text-muted-foreground mb-1">
                                Account Name:
                            </p>
                            <p className="font-semibold text-foreground">
                                Admin Tournament
                            </p>
                        </div>

                        <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                            <h4 className="font-semibold text-accent mb-2">
                                Payment Instructions:
                            </h4>
                            <ul className="text-sm text-foreground space-y-1">
                                <li>
                                    • Registration fee:{" "}
                                    <strong>IDR 150,000</strong>
                                </li>
                                <li>• Transfer the exact amount as stated</li>
                                <li>
                                    • Take a screenshot of the transfer receipt
                                </li>
                                <li>
                                    • Upload the proof in the registration form
                                </li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-12 text-center">
                <p className="text-sm text-muted-foreground">
                    Need help? Contact admin at{" "}
                    <a
                        href="https://wa.me/6281234567890"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        WhatsApp: 081234567890
                    </a>
                </p>
            </div>

            <Dialog open={showModal} onOpenChange={setShowModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {modalType === "success" ? (
                                <>
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    Registration Successful!
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="h-5 w-5 text-red-500" />
                                    Registration Error
                                </>
                            )}
                        </DialogTitle>
                        <div className="text-left text-muted-foreground text-sm">
                            {modalType === "success" ? (
                                <div className="space-y-3">
                                    <div>
                                        Team <strong>{data.teamName}</strong>{" "}
                                        has been successfully registered for the
                                        semifinal.
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Your registration will be reviewed and
                                        verified by IBP Academy within 24 hours.
                                        You will receive a confirmation email
                                        once the verification is complete.
                                    </div>
                                </div>
                            ) : (
                                <div className="text-red-600">
                                    {errorMessage}
                                </div>
                            )}
                        </div>
                    </DialogHeader>
                    <div className="flex justify-end gap-2 mt-4">
                        {modalType === "success" ? (
                            <Button
                                onClick={handleBackToDashboard}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        ) : (
                            <Button
                                onClick={() => setShowModal(false)}
                                variant="outline"
                            >
                                Try Again
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
