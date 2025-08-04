import React, { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Head } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Modal from "@/Components/Modal";
import RegistrationExistsModal from "@/Components/RegistrationExistsModal";

interface CompetitionCategory {
    id: number;
    name: string;
    description?: string;
    full_name?: string;
}

interface AuthUser {
    id: number;
    name: string;
    email: string;
}

interface TeamRegistration {
    id: number;
    registration_number: string;
    tim_name: string;
    asal_universitas: string;
    prodi_fakultas: string;
    leader_name: string;
    leader_email: string;
    leader_phone: string;
    status: string;
    created_at: string;
}

interface Props {
    category: CompetitionCategory;
    existingRegistration?: TeamRegistration;
    auth: {
        user: AuthUser;
    };
}

interface FormData {
    tim_name: string;
    asal_universitas: string;
    prodi_fakultas: string;
    leader_name: string;
    leader_nim: string;
    leader_email: string;
    leader_phone: string;
    member1_name: string;
    member1_nim: string;
    member1_email: string;
    member1_phone: string;
    member2_name: string;
    member2_nim: string;
    member2_email: string;
    member2_phone: string;
    member3_name: string;
    member3_nim: string;
    member3_email: string;
    member3_phone: string;
    link_berkas: string;
}

export default function BCCRegistration({
    category,
    existingRegistration,
    auth,
}: Props) {
    const [currentStep, setCurrentStep] = useState(1);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showExistingModal, setShowExistingModal] = useState(false);
    const [stepValidationErrors, setStepValidationErrors] = useState<string[]>(
        []
    );
    const [validatedSteps, setValidatedSteps] = useState<number[]>([]);
    const totalSteps = 6;

    // Show existing registration modal if user already registered
    useEffect(() => {
        if (existingRegistration) {
            setShowExistingModal(true);
        }
    }, [existingRegistration]);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        tim_name: "",
        asal_universitas: "",
        prodi_fakultas: "",
        leader_name: auth.user?.name || "",
        leader_nim: "",
        leader_email: auth.user?.email || "",
        leader_phone: "",
        member1_name: "",
        member1_nim: "",
        member1_email: "",
        member1_phone: "",
        member2_name: "",
        member2_nim: "",
        member2_email: "",
        member2_phone: "",
        member3_name: "",
        member3_nim: "",
        member3_email: "",
        member3_phone: "",
        link_berkas: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if user already has existing registration
        if (existingRegistration) {
            setShowExistingModal(true);
            return;
        }

        // Validasi final semua step sebelum submit
        let allErrors: string[] = [];
        for (let step = 1; step <= totalSteps; step++) {
            const stepErrors = validateStep(step);
            allErrors = [...allErrors, ...stepErrors];
        }

        if (allErrors.length > 0) {
            setStepValidationErrors(allErrors);
            setShowErrorModal(true);
            return;
        }

        post(route("competition.bcc.register.store"));
    };

    // Validasi per step
    const validateStep = (step: number): string[] => {
        const errors: string[] = [];

        switch (step) {
            case 1: // Informasi Tim
                if (!data.tim_name.trim()) {
                    errors.push("Nama tim harus diisi");
                } else if (data.tim_name.length < 3) {
                    errors.push("Nama tim minimal 3 karakter");
                }

                if (!data.asal_universitas.trim()) {
                    errors.push("Asal universitas harus diisi");
                } else if (data.asal_universitas.length < 5) {
                    errors.push("Asal universitas minimal 5 karakter");
                }

                if (!data.prodi_fakultas.trim()) {
                    errors.push("Program studi/fakultas harus diisi");
                } else if (data.prodi_fakultas.length < 3) {
                    errors.push("Program studi/fakultas minimal 3 karakter");
                }
                break;

            case 2: // Ketua Tim
                if (!data.leader_name.trim()) {
                    errors.push("Nama ketua tim harus diisi");
                } else if (data.leader_name.length < 3) {
                    errors.push("Nama ketua tim minimal 3 karakter");
                }

                if (!data.leader_nim.trim()) {
                    errors.push("NIM ketua tim harus diisi");
                } else if (data.leader_nim.length < 5) {
                    errors.push("NIM ketua tim minimal 5 karakter");
                }

                if (!data.leader_email.trim()) {
                    errors.push("Email ketua tim harus diisi");
                } else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.leader_email)
                ) {
                    errors.push("Format email ketua tim tidak valid");
                }

                if (!data.leader_phone.trim()) {
                    errors.push("Nomor telepon ketua tim harus diisi");
                } else if (data.leader_phone.length < 10) {
                    errors.push("Nomor telepon ketua tim minimal 10 digit");
                }
                break;

            case 3: // Anggota 1
                if (!data.member1_name.trim()) {
                    errors.push("Nama anggota 1 harus diisi");
                } else if (data.member1_name.length < 3) {
                    errors.push("Nama anggota 1 minimal 3 karakter");
                }

                if (!data.member1_nim.trim()) {
                    errors.push("NIM anggota 1 harus diisi");
                } else if (data.member1_nim.length < 5) {
                    errors.push("NIM anggota 1 minimal 5 karakter");
                } else if (data.member1_nim === data.leader_nim) {
                    errors.push(
                        "NIM anggota 1 tidak boleh sama dengan NIM ketua"
                    );
                }

                if (!data.member1_email.trim()) {
                    errors.push("Email anggota 1 harus diisi");
                } else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.member1_email)
                ) {
                    errors.push("Format email anggota 1 tidak valid");
                } else if (data.member1_email === data.leader_email) {
                    errors.push(
                        "Email anggota 1 tidak boleh sama dengan email ketua"
                    );
                }

                if (!data.member1_phone.trim()) {
                    errors.push("Nomor telepon anggota 1 harus diisi");
                } else if (data.member1_phone.length < 10) {
                    errors.push("Nomor telepon anggota 1 minimal 10 digit");
                } else if (data.member1_phone === data.leader_phone) {
                    errors.push(
                        "Nomor telepon anggota 1 tidak boleh sama dengan ketua"
                    );
                }
                break;

            case 4: // Anggota 2
                if (!data.member2_name.trim()) {
                    errors.push("Nama anggota 2 harus diisi");
                } else if (data.member2_name.length < 3) {
                    errors.push("Nama anggota 2 minimal 3 karakter");
                }

                if (!data.member2_nim.trim()) {
                    errors.push("NIM anggota 2 harus diisi");
                } else if (data.member2_nim.length < 5) {
                    errors.push("NIM anggota 2 minimal 5 karakter");
                } else if (
                    data.member2_nim === data.leader_nim ||
                    data.member2_nim === data.member1_nim
                ) {
                    errors.push(
                        "NIM anggota 2 tidak boleh sama dengan NIM ketua atau anggota 1"
                    );
                }

                if (!data.member2_email.trim()) {
                    errors.push("Email anggota 2 harus diisi");
                } else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.member2_email)
                ) {
                    errors.push("Format email anggota 2 tidak valid");
                } else if (
                    data.member2_email === data.leader_email ||
                    data.member2_email === data.member1_email
                ) {
                    errors.push(
                        "Email anggota 2 tidak boleh sama dengan email ketua atau anggota 1"
                    );
                }

                if (!data.member2_phone.trim()) {
                    errors.push("Nomor telepon anggota 2 harus diisi");
                } else if (data.member2_phone.length < 10) {
                    errors.push("Nomor telepon anggota 2 minimal 10 digit");
                } else if (
                    data.member2_phone === data.leader_phone ||
                    data.member2_phone === data.member1_phone
                ) {
                    errors.push(
                        "Nomor telepon anggota 2 tidak boleh sama dengan ketua atau anggota 1"
                    );
                }
                break;

            case 5: // Anggota 3
                if (!data.member3_name.trim()) {
                    errors.push("Nama anggota 3 harus diisi");
                } else if (data.member3_name.length < 3) {
                    errors.push("Nama anggota 3 minimal 3 karakter");
                }

                if (!data.member3_nim.trim()) {
                    errors.push("NIM anggota 3 harus diisi");
                } else if (data.member3_nim.length < 5) {
                    errors.push("NIM anggota 3 minimal 5 karakter");
                } else if (
                    data.member3_nim === data.leader_nim ||
                    data.member3_nim === data.member1_nim ||
                    data.member3_nim === data.member2_nim
                ) {
                    errors.push(
                        "NIM anggota 3 tidak boleh sama dengan NIM ketua, anggota 1, atau anggota 2"
                    );
                }

                if (!data.member3_email.trim()) {
                    errors.push("Email anggota 3 harus diisi");
                } else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.member3_email)
                ) {
                    errors.push("Format email anggota 3 tidak valid");
                } else if (
                    data.member3_email === data.leader_email ||
                    data.member3_email === data.member1_email ||
                    data.member3_email === data.member2_email
                ) {
                    errors.push(
                        "Email anggota 3 tidak boleh sama dengan email ketua, anggota 1, atau anggota 2"
                    );
                }

                if (!data.member3_phone.trim()) {
                    errors.push("Nomor telepon anggota 3 harus diisi");
                } else if (data.member3_phone.length < 10) {
                    errors.push("Nomor telepon anggota 3 minimal 10 digit");
                } else if (
                    data.member3_phone === data.leader_phone ||
                    data.member3_phone === data.member1_phone ||
                    data.member3_phone === data.member2_phone
                ) {
                    errors.push(
                        "Nomor telepon anggota 3 tidak boleh sama dengan ketua, anggota 1, atau anggota 2"
                    );
                }
                break;

            case 6: // Dokumen
                if (!data.link_berkas.trim()) {
                    errors.push("Link berkas persyaratan harus diisi");
                } else if (!/^https?:\/\/.+/.test(data.link_berkas)) {
                    errors.push(
                        "Format URL link berkas tidak valid (harus dimulai dengan http:// atau https://)"
                    );
                }
                break;
        }

        return errors;
    };

    const nextStep = () => {
        // Validasi step saat ini sebelum lanjut
        const validationErrors = validateStep(currentStep);

        if (validationErrors.length > 0) {
            setStepValidationErrors(validationErrors);
            setShowErrorModal(true);
            return;
        }

        // Tandai step sebagai tervalidasi
        if (!validatedSteps.includes(currentStep)) {
            setValidatedSteps([...validatedSteps, currentStep]);
        }

        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-primary">
                            Informasi Tim
                        </h2>

                        <div className="mb-4">
                            <InputLabel htmlFor="tim_name" value="Nama Tim *" />
                            <TextInput
                                id="tim_name"
                                name="tim_name"
                                value={data.tim_name}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("tim_name", e.target.value)
                                }
                                placeholder="Masukkan nama tim yang unik"
                                required
                            />
                            <InputError
                                message={errors.tim_name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="asal_universitas"
                                value="Asal Universitas *"
                            />
                            <TextInput
                                id="asal_universitas"
                                name="asal_universitas"
                                value={data.asal_universitas}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("asal_universitas", e.target.value)
                                }
                                placeholder="Contoh: Universitas Indonesia"
                                required
                            />
                            <InputError
                                message={errors.asal_universitas}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="prodi_fakultas"
                                value="Program Studi / Fakultas *"
                            />
                            <TextInput
                                id="prodi_fakultas"
                                name="prodi_fakultas"
                                value={data.prodi_fakultas}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("prodi_fakultas", e.target.value)
                                }
                                placeholder="Contoh: Teknik Informatika / FASILKOM"
                                required
                            />
                            <InputError
                                message={errors.prodi_fakultas}
                                className="mt-2"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-secondary">
                            Ketua Tim
                        </h2>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="leader_name"
                                value="Nama Lengkap *"
                            />
                            <TextInput
                                id="leader_name"
                                name="leader_name"
                                value={data.leader_name}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("leader_name", e.target.value)
                                }
                                placeholder="Nama lengkap ketua tim"
                                required
                            />
                            <InputError
                                message={errors.leader_name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="leader_nim" value="NIM *" />
                            <TextInput
                                id="leader_nim"
                                name="leader_nim"
                                value={data.leader_nim}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("leader_nim", e.target.value)
                                }
                                placeholder="Nomor Induk Mahasiswa"
                                required
                            />
                            <InputError
                                message={errors.leader_nim}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="leader_email"
                                value="Email *"
                            />
                            <TextInput
                                id="leader_email"
                                name="leader_email"
                                type="email"
                                value={data.leader_email}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("leader_email", e.target.value)
                                }
                                placeholder="email@example.com"
                                required
                            />
                            <InputError
                                message={errors.leader_email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="leader_phone"
                                value="Nomor Telepon *"
                            />
                            <TextInput
                                id="leader_phone"
                                name="leader_phone"
                                type="tel"
                                value={data.leader_phone}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("leader_phone", e.target.value)
                                }
                                placeholder="08xxxxxxxxxx"
                                required
                            />
                            <InputError
                                message={errors.leader_phone}
                                className="mt-2"
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-primary">
                            Anggota 1
                        </h2>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="member1_name"
                                value="Nama Lengkap *"
                            />
                            <TextInput
                                id="member1_name"
                                name="member1_name"
                                value={data.member1_name}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member1_name", e.target.value)
                                }
                                placeholder="Nama lengkap anggota 1"
                                required
                            />
                            <InputError
                                message={errors.member1_name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="member1_nim" value="NIM *" />
                            <TextInput
                                id="member1_nim"
                                name="member1_nim"
                                value={data.member1_nim}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member1_nim", e.target.value)
                                }
                                placeholder="Nomor Induk Mahasiswa"
                                required
                            />
                            <InputError
                                message={errors.member1_nim}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="member1_email"
                                value="Email *"
                            />
                            <TextInput
                                id="member1_email"
                                name="member1_email"
                                type="email"
                                value={data.member1_email}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member1_email", e.target.value)
                                }
                                placeholder="email@example.com"
                                required
                            />
                            <InputError
                                message={errors.member1_email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="member1_phone"
                                value="Nomor Telepon *"
                            />
                            <TextInput
                                id="member1_phone"
                                name="member1_phone"
                                type="tel"
                                value={data.member1_phone}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member1_phone", e.target.value)
                                }
                                placeholder="08xxxxxxxxxx"
                                required
                            />
                            <InputError
                                message={errors.member1_phone}
                                className="mt-2"
                            />
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-secondary">
                            Anggota 2
                        </h2>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="member2_name"
                                value="Nama Lengkap *"
                            />
                            <TextInput
                                id="member2_name"
                                name="member2_name"
                                value={data.member2_name}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member2_name", e.target.value)
                                }
                                placeholder="Nama lengkap anggota 2"
                                required
                            />
                            <InputError
                                message={errors.member2_name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="member2_nim" value="NIM *" />
                            <TextInput
                                id="member2_nim"
                                name="member2_nim"
                                value={data.member2_nim}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member2_nim", e.target.value)
                                }
                                placeholder="Nomor Induk Mahasiswa"
                                required
                            />
                            <InputError
                                message={errors.member2_nim}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="member2_email"
                                value="Email *"
                            />
                            <TextInput
                                id="member2_email"
                                name="member2_email"
                                type="email"
                                value={data.member2_email}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member2_email", e.target.value)
                                }
                                placeholder="email@example.com"
                                required
                            />
                            <InputError
                                message={errors.member2_email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="member2_phone"
                                value="Nomor Telepon *"
                            />
                            <TextInput
                                id="member2_phone"
                                name="member2_phone"
                                type="tel"
                                value={data.member2_phone}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member2_phone", e.target.value)
                                }
                                placeholder="08xxxxxxxxxx"
                                required
                            />
                            <InputError
                                message={errors.member2_phone}
                                className="mt-2"
                            />
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-primary">
                            Anggota 3
                        </h2>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="member3_name"
                                value="Nama Lengkap *"
                            />
                            <TextInput
                                id="member3_name"
                                name="member3_name"
                                value={data.member3_name}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member3_name", e.target.value)
                                }
                                placeholder="Nama lengkap anggota 3"
                                required
                            />
                            <InputError
                                message={errors.member3_name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel htmlFor="member3_nim" value="NIM *" />
                            <TextInput
                                id="member3_nim"
                                name="member3_nim"
                                value={data.member3_nim}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member3_nim", e.target.value)
                                }
                                placeholder="Nomor Induk Mahasiswa"
                                required
                            />
                            <InputError
                                message={errors.member3_nim}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="member3_email"
                                value="Email *"
                            />
                            <TextInput
                                id="member3_email"
                                name="member3_email"
                                type="email"
                                value={data.member3_email}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member3_email", e.target.value)
                                }
                                placeholder="email@example.com"
                                required
                            />
                            <InputError
                                message={errors.member3_email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="member3_phone"
                                value="Nomor Telepon *"
                            />
                            <TextInput
                                id="member3_phone"
                                name="member3_phone"
                                type="tel"
                                value={data.member3_phone}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("member3_phone", e.target.value)
                                }
                                placeholder="08xxxxxxxxxx"
                                required
                            />
                            <InputError
                                message={errors.member3_phone}
                                className="mt-2"
                            />
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-secondary">
                            Dokumen Persyaratan
                        </h2>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="link_berkas"
                                value="Link Berkas Persyaratan *"
                            />
                            <TextInput
                                id="link_berkas"
                                name="link_berkas"
                                type="url"
                                value={data.link_berkas}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("link_berkas", e.target.value)
                                }
                                placeholder="https://drive.google.com/... atau link lainnya"
                                required
                            />
                            <InputError
                                message={errors.link_berkas}
                                className="mt-2"
                            />
                        </div>

                        <div className="p-4 mt-4 border rounded-lg border-ibp-neutral bg-ibp-neutral/30">
                            <h3 className="mb-2 font-semibold text-blue-900">
                                Petunjuk Upload Berkas:
                            </h3>
                            <ul className="space-y-1 text-sm text-black/70">
                                <li>
                                    • Upload berkas ke Google Drive atau
                                    platform cloud lainnya
                                </li>
                                <li>
                                    • Pastikan link dapat diakses oleh tim
                                    panitia
                                </li>
                                <li>
                                    • Berkas harus dalam format PDF atau ZIP
                                </li>
                                <li>
                                    • Sertakan semua dokumen yang diperlukan
                                    dalam satu folder
                                </li>
                            </ul>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            <Head title={`Pendaftaran ${category.name} - IBP Academy`} />
            <div className="min-h-screen py-4 sm:py-8 bg-gradient-to-br from-neutral-200 to-white">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-start max-w-6xl gap-4 mx-auto">
                        {/* Back Button - Left side */}
                        <div className="flex-shrink-0 pt-2">
                            <button
                                onClick={() => window.history.back()}
                                className="flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 bg-white rounded-lg shadow-md text-ibp-primary hover:shadow-lg hover:bg-ibp-neutral/10"
                            >
                                <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                                Kembali
                            </button>
                        </div>

                        {/* Form Card */}
                        <div className="flex-1 max-w-4xl">
                            <div className="overflow-hidden bg-white rounded-lg shadow-xl">
                                {/* Header */}
                                <div className="relative px-4 py-6 overflow-hidden text-white sm:px-6 sm:py-8 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900">
                                    {/* Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute w-24 h-24 rounded-full sm:w-32 sm:h-32 -top-4 -right-4 bg-ibp-accent mix-blend-multiply filter blur-xl animate-pulse"></div>
                                        <div className="absolute w-20 h-20 delay-1000 rounded-full sm:w-24 sm:h-24 -bottom-4 -left-4 bg-ibp-secondary mix-blend-multiply filter blur-xl animate-pulse"></div>
                                    </div>
                                    {/* Logo and Title Container */}
                                    <div className="relative flex flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                        {/* Logo */}
                                        <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24">
                                            <img
                                                src="/image/logo/logo.png"
                                                alt="IBP Logo"
                                                className="h-18 w-18 sm:w-20 sm:h-20"
                                            />
                                        </div>

                                        {/* Title Content */}
                                        <div className="flex-1 text-center sm:text-left">
                                            <h1 className="text-2xl font-bold text-transparent sm:text-3xl bg-gradient-to-r from-white to-ibp-accent bg-clip-text">
                                                Pendaftaran {category.name}
                                            </h1>
                                            <p className="mt-2 text-sm sm:text-base text-ibp-white opacity-90">
                                                {category.full_name ||
                                                    category.description}
                                            </p>
                                            <div className="flex items-center justify-center mt-1 text-xs sm:justify-start sm:text-sm text-ibp-accent">
                                                <svg
                                                    className="w-3 h-3 mr-1 sm:w-4 sm:h-4"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                IBP Academy Competition 2024
                                            </div>
                                        </div>
                                    </div>{" "}
                                    {/* Progress Bar */}
                                    <div className="relative p-4 mt-8 rounded-lg bg-white/20 backdrop-blur-sm">
                                        <div className="flex justify-between mb-3 text-sm font-medium">
                                            <span className="text-ibp-accent">
                                                Langkah {currentStep} dari{" "}
                                                {totalSteps}
                                            </span>
                                            <span className="text-ibp-white">
                                                {Math.round(
                                                    (currentStep / totalSteps) *
                                                        100
                                                )}
                                                %
                                            </span>
                                        </div>

                                        {/* Progress Bar dengan indikator step */}
                                        <div className="flex mb-3 space-x-2">
                                            {Array.from(
                                                { length: totalSteps },
                                                (_, index) => (
                                                    <div
                                                        key={index + 1}
                                                        className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                                                            index + 1 ===
                                                            currentStep
                                                                ? "bg-ibp-accent shadow-lg shadow-accent/50" // Step saat ini
                                                                : validatedSteps.includes(
                                                                      index + 1
                                                                  )
                                                                ? "bg-ibp-secondary shadow-md shadow-ibp-secondary/30" // Step yang sudah tervalidasi
                                                                : index + 1 <
                                                                  currentStep
                                                                ? "bg-white opacity-80" // Step sebelumnya
                                                                : "bg-white/30" // Step yang belum dicapai
                                                        }`}
                                                    />
                                                )
                                            )}
                                        </div>

                                        {/* Progress Bar Utama */}
                                        <div className="w-full h-3 rounded-full shadow-inner bg-white/20">
                                            <div
                                                className="h-3 transition-all duration-500 rounded-full shadow-sm bg-gradient-to-r from-ibp-accent to-ibp-secondary"
                                                style={{
                                                    width: `${
                                                        (currentStep /
                                                            totalSteps) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>

                                        {/* Step Labels - Hidden on mobile for space */}
                                        <div className="justify-between hidden mt-2 text-xs sm:flex text-ibp-white/80">
                                            <span>Tim</span>
                                            <span>Ketua</span>
                                            <span>Anggota 1</span>
                                            <span>Anggota 2</span>
                                            <span>Anggota 3</span>
                                            <span>Dokumen</span>
                                        </div>

                                        {/* Legend - Responsive layout */}
                                        <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs sm:gap-4">
                                            <div className="flex items-center text-ibp-white/90">
                                                <div className="w-2 h-2 mr-1 rounded-full shadow-sm sm:w-3 sm:h-3 bg-ibp-secondary"></div>
                                                <span>Tervalidasi</span>
                                            </div>
                                            <div className="flex items-center text-ibp-white/90">
                                                <div className="w-2 h-2 mr-1 rounded-full shadow-lg sm:w-3 sm:h-3 bg-ibp-accent shadow-ibp-accent/50"></div>
                                                <span>Saat ini</span>
                                            </div>
                                            <div className="flex items-center text-ibp-white/90">
                                                <div className="w-2 h-2 mr-1 rounded-full sm:w-3 sm:h-3 bg-ibp-white/30"></div>
                                                <span>Belum dicapai</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Existing Registration Banner */}
                                {existingRegistration && (
                                    <div className="px-4 py-4 m-6 border border-green-200 rounded-lg bg-green-50">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <svg
                                                    className="w-5 h-5 text-green-400"
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                            <div className="flex-1 ml-3">
                                                <h3 className="text-sm font-medium text-green-800">
                                                    Anda Sudah Terdaftar
                                                </h3>
                                                <div className="mt-1 text-sm text-green-700">
                                                    <p>
                                                        Tim{" "}
                                                        <strong>
                                                            {
                                                                existingRegistration.tim_name
                                                            }
                                                        </strong>{" "}
                                                        telah terdaftar dengan
                                                        nomor registrasi{" "}
                                                        <strong>
                                                            {
                                                                existingRegistration.registration_number
                                                            }
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowExistingModal(
                                                            true
                                                        )
                                                    }
                                                    className="text-sm font-medium text-green-800 hover:text-green-900"
                                                >
                                                    Lihat Detail →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* General Error */}
                                {(errors as any)?.general && (
                                    <div className="p-4 m-6 border-l-4 border-red-400 bg-red-50">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <p className="text-sm text-red-700">
                                                    {(errors as any).general}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Form Content */}
                                <div className="relative">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="relative p-4 sm:p-6 bg-gradient-to-br from-white to-ibp-white/50"
                                    >
                                        {renderStep()}

                                        {/* Navigation Buttons */}
                                        <div className="flex flex-col justify-between gap-4 pt-6 mt-8 border-t sm:flex-row border-ibp-neutral">
                                            <button
                                                type="button"
                                                onClick={prevStep}
                                                disabled={currentStep === 1}
                                                className={`order-2 sm:order-1 px-4 sm:px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                                                    currentStep === 1
                                                        ? "bg-ibp-neutral text-ibp-black/40 cursor-not-allowed"
                                                        : "bg-ibp-neutral text-ibp-black hover:bg-ibp-neutral/80 hover:shadow-md"
                                                }`}
                                            >
                                                ← Sebelumnya
                                            </button>

                                            {currentStep < totalSteps ? (
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="order-1 px-4 py-3 font-medium transition-all duration-200 rounded-lg sm:order-2 sm:px-6 text-ibp-white bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-900/90 hover:to-blue-600/90 hover:shadow-lg shadow-blue-900/25"
                                                >
                                                    Selanjutnya →
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        processing ||
                                                        !!existingRegistration
                                                    }
                                                    className={`order-1 sm:order-2 px-4 sm:px-6 py-3 rounded-lg font-medium text-ibp-white transition-all duration-200 ${
                                                        processing ||
                                                        existingRegistration
                                                            ? "bg-ibp-neutral cursor-not-allowed"
                                                            : "bg-gradient-to-r from-orange-300 to-orange-500 hover:from-orange-300/90 hover:to-orange-500/90 hover:shadow-lg shadow-orange-300/25"
                                                    }`}
                                                >
                                                    {processing
                                                        ? "Mendaftar..."
                                                        : existingRegistration
                                                        ? "Sudah Terdaftar"
                                                        : "Daftar BCC"}
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Modal Error Validasi */}
                        <Modal
                            show={showErrorModal}
                            onClose={() => setShowErrorModal(false)}
                            maxWidth="md"
                        >
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center mb-4">
                                    <div className="flex items-center justify-center w-10 h-10 mx-auto bg-red-100 rounded-full sm:w-12 sm:h-12">
                                        <svg
                                            className="w-5 h-5 text-red-600 sm:w-6 sm:h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
                                            ></path>
                                        </svg>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <h3 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
                                        {currentStep === totalSteps &&
                                        stepValidationErrors.length > 0
                                            ? "Data Belum Lengkap untuk Submit"
                                            : "Data Belum Lengkap"}
                                    </h3>

                                    <div className="mb-6 text-left">
                                        <p className="mb-3 text-xs text-gray-600 sm:text-sm">
                                            {currentStep === totalSteps &&
                                            stepValidationErrors.length > 0
                                                ? "Silakan lengkapi semua data yang diperlukan sebelum mengirim pendaftaran:"
                                                : "Silakan lengkapi data berikut sebelum melanjutkan ke step berikutnya:"}
                                        </p>
                                        <ul className="space-y-2">
                                            {stepValidationErrors.map(
                                                (error, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-start"
                                                    >
                                                        <span className="flex-shrink-0 w-2 h-2 mt-2 bg-red-500 rounded-full"></span>
                                                        <span className="ml-3 text-xs text-red-700 sm:text-sm">
                                                            {error}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    </div>

                                    <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowErrorModal(false)
                                            }
                                            className="px-4 py-2 rounded-lg sm:px-6 text-ibp-white bg-ibp-primary hover:bg-ibp-primary/90 focus:outline-none focus:ring-2 focus:ring-ibp-primary/50 focus:ring-offset-2"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Modal>

                        {/* Registration Exists Modal */}
                        {existingRegistration && (
                            <RegistrationExistsModal
                                show={showExistingModal}
                                onClose={() => setShowExistingModal(false)}
                                registration={existingRegistration}
                                category={category}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
