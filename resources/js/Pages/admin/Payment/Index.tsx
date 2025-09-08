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
import { Eye, Download, Check, X, Search } from "lucide-react";
import AdminLayout from "@/Layouts/AdminLayout";

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
    progress_status: "not_started" | "in_progress" | "rejected";
}

interface PageProps {
    payments: PaymentData[];
    stats: {
        need_review: number;
        in_progress: number;
        rejected: number;
    };
    filters: {
        search: string;
    };
    [key: string]: any;
}

export default function PaymentIndex() {
    const { payments, stats, filters } = usePage<PageProps>().props;
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [actionDialog, setActionDialog] = useState<{
        isOpen: boolean;
        type: "approve" | "reject" | null;
        paymentId: number | null;
        teamName: string | null;
    }>({
        isOpen: false,
        type: null,
        paymentId: null,
        teamName: null,
    });

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        router.get(
            route("admin.payments.index"),
            { search: value },
            { preserveState: true }
        );
    };

    const openActionDialog = (
        type: "approve" | "reject",
        id: number,
        teamName: string
    ) => {
        setActionDialog({
            isOpen: true,
            type,
            paymentId: id,
            teamName,
        });
    };

    const closeActionDialog = () => {
        setActionDialog({
            isOpen: false,
            type: null,
            paymentId: null,
            teamName: null,
        });
    };

    const handleConfirmAction = () => {
        if (actionDialog.type && actionDialog.paymentId) {
            const routeName =
                actionDialog.type === "approve"
                    ? "admin.payments.approve"
                    : "admin.payments.reject";

            router.post(route(routeName, actionDialog.paymentId));
            closeActionDialog();
        }
    };

    const badgeColor = (status: string) => {
        switch (status) {
            case "not_started":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
                return "bg-green-100 text-green-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getActionTitle = () => {
        if (actionDialog.type === "approve") {
            return "Konfirmasi Persetujuan Pembayaran";
        } else if (actionDialog.type === "reject") {
            return "Konfirmasi Penolakan Pembayaran";
        }
        return "";
    };

    const getActionDescription = () => {
        if (actionDialog.type === "approve") {
            return `Anda yakin ingin menyetujui pembayaran dari tim ${actionDialog.teamName}?`;
        } else if (actionDialog.type === "reject") {
            return `Anda yakin ingin menolak pembayaran dari tim ${actionDialog.teamName}?`;
        }
        return "";
    };

    return (
        <AdminLayout>
            <div className="p-6 space-y-4">
                <h2 className="text-2xl font-bold">
                    Manajemen Pembayaran Semifinal
                </h2>

                <div className="flex items-center gap-4">
                    <Badge className={badgeColor("not_started")}>
                        {stats.need_review} Perlu Review
                    </Badge>
                    <Badge className={badgeColor("in_progress")}>
                        {stats.in_progress} Dalam Proses
                    </Badge>
                    <Badge className={badgeColor("rejected")}>
                        {stats.rejected} Ditolak
                    </Badge>
                </div>

                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 w-4 h-4 text-gray-400 -translate-y-1/2" />
                    <Input
                        placeholder="Cari..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

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
                                    <Badge
                                        className={badgeColor(
                                            p.progress_status
                                        )}
                                    >
                                        {p.progress_status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {p.progress_status === "not_started" && (
                                        <div className="flex gap-1">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                    openActionDialog(
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
                                                    openActionDialog(
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

                {selectedImage && (
                    <Dialog
                        open={!!selectedImage}
                        onOpenChange={() => setSelectedImage(null)}
                    >
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Bukti Pembayaran</DialogTitle>
                            </DialogHeader>
                            <img
                                src={selectedImage}
                                alt="Bukti"
                                className="w-full"
                            />
                        </DialogContent>
                    </Dialog>
                )}

                {/* Dialog untuk konfirmasi aksi approve/reject */}
                <Dialog
                    open={actionDialog.isOpen}
                    onOpenChange={closeActionDialog}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{getActionTitle()}</DialogTitle>
                            <DialogDescription>
                                {getActionDescription()}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={closeActionDialog}
                            >
                                Batal
                            </Button>
                            <Button
                                onClick={handleConfirmAction}
                                variant={
                                    actionDialog.type === "approve"
                                        ? "default"
                                        : "destructive"
                                }
                            >
                                {actionDialog.type === "approve"
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
