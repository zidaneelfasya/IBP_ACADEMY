import { useState, useEffect } from "react";
import { Head, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";

interface CompetitionStage {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: "upcoming" | "ongoing" | "completed";
    participants: number;
}

interface Props {
    stages: CompetitionStage[];
}

export default function CompetitionStages({ stages: serverStages }: Props) {
    const [stages, setStages] = useState<CompetitionStage[]>(serverStages);
    const [editingStage, setEditingStage] = useState<CompetitionStage | null>(
        null
    );

     useEffect(() => {
         setStages(serverStages);
     }, [serverStages]);
     
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        start_date: "",
        end_date: "",
    });

    const openCreate = () => {
        setEditingStage(null);
        setFormData({ name: "", start_date: "", end_date: "" });
        setIsDialogOpen(true);
    };

    const openEdit = (stage: CompetitionStage) => {
        setEditingStage(stage);
        setFormData({
            name: stage.name,
            start_date: stage.startDate,
            end_date: stage.endDate,
        });
        setIsDialogOpen(true);
    };

    const handleSave = () => {
        if (editingStage) {
            router.put(
                route("admin.stages.update", editingStage.id),
                formData,
                {
                    onSuccess: () => {
                        router.reload();
                    },
                }
            );
        } else {
            router.post(route("admin.stages.store"), formData, {
                onSuccess: () => {
                    router.reload();
                },
            });
        }
        setIsDialogOpen(false);
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this stage?")) {
            router.delete(route("admin.stages.destroy", id), {
                onSuccess: () => {
                    router.reload();
                },
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="Competition Stages" />
            <div className="container mx-auto px-6 py-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Competition Stages</CardTitle>
                                <CardDescription>
                                    Manage stages and schedules
                                </CardDescription>
                            </div>
                            <Button onClick={openCreate}>Add Stage</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Start</TableHead>
                                    <TableHead>End</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stages.map((stage) => (
                                    <TableRow key={stage.id}>
                                        <TableCell>{stage.name}</TableCell>
                                        <TableCell>{stage.startDate}</TableCell>
                                        <TableCell>{stage.endDate}</TableCell>
                                        <TableCell>{stage.status}</TableCell>
                                        <TableCell>
                                            <div className="space-x-2">
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        openEdit(stage)
                                                    }
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        handleDelete(stage.id)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {editingStage ? "Edit Stage" : "Add Stage"}
                            </DialogTitle>
                            <DialogDescription>
                                {editingStage
                                    ? "Update stage details."
                                    : "Create a new stage."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label>Name</Label>
                                <Input
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label>Start Date</Label>
                                <Input
                                    type="date"
                                    value={formData.start_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            start_date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <Label>End Date</Label>
                                <Input
                                    type="date"
                                    value={formData.end_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            end_date: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                {editingStage ? "Update" : "Create"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
