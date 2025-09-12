"use client";

import { usePage, router } from "@inertiajs/react";
import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea"; // <- untuk admin_notes
import { Eye, Download, Check, X, Search } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";

// 1. Interface pakai status payments
interface PaymentData {
    id: number;
    team_name: string;
    competition_category: string;
    bank_name: string;
    account_number: string;
    account_holder: string;
    sender_account_number: string;
    sender_account_holder: string;
    amount: number;
    payment_proof_path: string;
    status: "pending" | "verified" | "rejected";
    admin_notes?: string;
}

interface PageProps {
    payments: PaymentData[];
    stats: {
        pending: number;
        verified: number;
        rejected: number;
    };
    filters: { search: string };
    [key: string]: unknown; // Add index signature to satisfy Inertia's PageProps constraint
}

export default function PaymentIndex() {
    const { payments, stats, filters } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Dialog konfirmasi + notes untuk reject
    const [dialog, setDialog] = useState<{
        open: boolean;
        type: "approve" | "reject" | null;
        id: number | null;
        teamName: string;
        notes: string;
    }>({ open: false, type: null, id: null, teamName: "", notes: "" });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);

    const handleSearch = (v: string) => {
        setSearchTerm(v);
        router.get(
            route("admin.payments.index"),
            { search: v },
            { preserveState: true }
        );
    };

    const openDialog = (
        type: "approve" | "reject",
        id: number,
        teamName: string
    ) => {
        setDialog({ open: true, type, id, teamName, notes: "" });
    };
    const closeDialog = () =>
        setDialog({
            open: false,
            type: null,
            id: null,
            teamName: "",
            notes: "",
        });

    const confirm = () => {
        if (!dialog.type || !dialog.id) return;
        const url = route(
            dialog.type === "approve"
                ? "admin.payments.approve"
                : "admin.payments.reject",
            dialog.id
        );
        const data =
            dialog.type === "reject" ? { admin_notes: dialog.notes } : {};
        router.post(url, data, { onFinish: closeDialog });
    };

    const badgeColor = (st: string) => {
        switch (st) {
            case "pending":
                return "bg-amber-100 text-amber-800";
            case "verified":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">
                    Manajemen Pembayaran Semifinal
                </h2>

                {/* Statistik */}
                <div className="flex items-center gap-3">
                    <Badge className={badgeColor("pending")}>
                        {stats.pending} Pending
                    </Badge>
                    <Badge className={badgeColor("verified")}>
                        {stats.verified} Terverifikasi
                    </Badge>
                    <Badge className={badgeColor("rejected")}>
                        {stats.rejected} Ditolak
                    </Badge>
                </div>

                {/* Search */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 -translate-y-1/2" />
                    <Input
                        placeholder="Cari tim, bank, atau pengirim..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Tabel */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tim</TableHead>
                            <TableHead>Kategori</TableHead>
                            <TableHead>Bank</TableHead>
                            <TableHead>Rek. Tujuan</TableHead>
                            <TableHead>Rek. Pengirim</TableHead>
                            <TableHead>Jumlah</TableHead>
                            <TableHead>Bukti</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments.map((p) => (
                            <TableRow key={p.id} className="hover:bg-gray-50">
                                <TableCell>{p.team_name}</TableCell>
                                <TableCell>{p.competition_category}</TableCell>
                                <TableCell>{p.bank_name}</TableCell>
                                <TableCell className="font-mono">
                                    {p.account_number}
                                </TableCell>
                                <TableCell className="font-mono">
                                    {p.sender_account_number}
                                </TableCell>
                                <TableCell>
                                    {formatCurrency(p.amount)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setSelectedImage(
                                                    p.payment_proof_path
                                                )
                                            }
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                router.post(
                                                    route(
                                                        "admin.payments.download",
                                                        p.id
                                                    )
                                                )
                                            }
                                        >
                                            <Download className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge className={badgeColor(p.status)}>
                                        {p.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {p.status === "pending" && (
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    openDialog(
                                                        "approve",
                                                        p.id,
                                                        p.team_name
                                                    )
                                                }
                                            >
                                                <Check />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    openDialog(
                                                        "reject",
                                                        p.id,
                                                        p.team_name
                                                    )
                                                }
                                            >
                                                <X />
                                            </Button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Lightbox bukti */}
                {selectedImage && (
                    <Dialog open onOpenChange={() => setSelectedImage(null)}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bukti Pembayaran</DialogTitle>
                            </DialogHeader>
                            <img
                                src={selectedImage}
                                alt="Bukti"
                                className="w-full rounded"
                            />
                        </DialogContent>
                    </Dialog>
                )}

                {/* Dialog approve / reject */}
                <Dialog open={dialog.open} onOpenChange={closeDialog}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {dialog.type === "approve"
                                    ? "Setujui Pembayaran"
                                    : "Tolak Pembayaran"}
                            </DialogTitle>
                            <DialogDescription>
                                Tim:{" "}
                                <span className="font-semibold">
                                    {dialog.teamName}
                                </span>
                            </DialogDescription>
                        </DialogHeader>

                        {dialog.type === "reject" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium">
                                    Alasan penolakan (opsional)
                                </label>
                                <Textarea
                                    value={dialog.notes}
                                    onChange={(e) =>
                                        setDialog({
                                            ...dialog,
                                            notes: e.target.value,
                                        })
                                    }
                                    placeholder="Contoh: bukti transfer tidak jelas"
                                />
                            </div>
                        )}

                        <DialogFooter>
                            <Button variant="outline" onClick={closeDialog}>
                                Batal
                            </Button>
                            <Button
                                onClick={confirm}
                                variant={
                                    dialog.type === "approve"
                                        ? "default"
                                        : "destructive"
                                }
                            >
                                {dialog.type === "approve"
                                    ? "Setujui"
                                    : "Tolak"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}

