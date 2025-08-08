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

interface Member {
    name: string;
    nim: string;
    email: string;
    phone: string;
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
    members: Member[];
    link_berkas: string;
}

export default function BPCRegistration({
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
    const totalSteps = 4; // Reduced from 6 to 4 steps

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
        members: [
            {
                name: "",
                nim: "",
                email: "",
                phone: "",
            },
        ],
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

        post(route("competition.bpc.register.store"));
    };

    // Add new member form
    const addMember = () => {
        if (data.members.length < 3) { // Maximum 3 members (1 leader + 2 members)
            setData("members", [
                ...data.members,
                {
                    name: "",
                    nim: "",
                    email: "",
                    phone: "",
                },
            ]);
        }
    };

    // Remove member form
    const removeMember = (index: number) => {
        if (data.members.length > 1) {
            const newMembers = [...data.members];
            newMembers.splice(index, 1);
            setData("members", newMembers);
        }
    };

    // Handle member input change
    const handleMemberChange = (
        index: number,
        field: keyof Member,
        value: string
    ) => {
        const newMembers = [...data.members];
        newMembers[index][field] = value;
        setData("members", newMembers);
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

            case 3: // Anggota Tim
                // Validate each member
                data.members.forEach((member, index) => {
                    if (!member.name.trim()) {
                        errors.push(`Nama anggota ${index + 1} harus diisi`);
                    } else if (member.name.length < 3) {
                        errors.push(
                            `Nama anggota ${index + 1} minimal 3 karakter`
                        );
                    }

                    if (!member.nim.trim()) {
                        errors.push(`NIM anggota ${index + 1} harus diisi`);
                    } else if (member.nim.length < 5) {
                        errors.push(
                            `NIM anggota ${index + 1} minimal 5 karakter`
                        );
                    } else if (member.nim === data.leader_nim) {
                        errors.push(
                            `NIM anggota ${index + 1} tidak boleh sama dengan NIM ketua`
                        );
                    }

                    // Check for duplicate NIMs among members
                    data.members.forEach((otherMember, otherIndex) => {
                        if (
                            index !== otherIndex &&
                            member.nim &&
                            member.nim === otherMember.nim
                        ) {
                            errors.push(
                                `NIM anggota ${index + 1} tidak boleh sama dengan NIM anggota ${otherIndex + 1}`
                            );
                        }
                    });

                    if (!member.email.trim()) {
                        errors.push(
                            `Email anggota ${index + 1} harus diisi`
                        );
                    } else if (
                        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)
                    ) {
                        errors.push(
                            `Format email anggota ${index + 1} tidak valid`
                        );
                    } else if (member.email === data.leader_email) {
                        errors.push(
                            `Email anggota ${index + 1} tidak boleh sama dengan email ketua`
                        );
                    }

                    // Check for duplicate emails among members
                    data.members.forEach((otherMember, otherIndex) => {
                        if (
                            index !== otherIndex &&
                            member.email &&
                            member.email === otherMember.email
                        ) {
                            errors.push(
                                `Email anggota ${index + 1} tidak boleh sama dengan email anggota ${otherIndex + 1}`
                            );
                        }
                    });

                    if (!member.phone.trim()) {
                        errors.push(
                            `Nomor telepon anggota ${index + 1} harus diisi`
                        );
                    } else if (member.phone.length < 10) {
                        errors.push(
                            `Nomor telepon anggota ${index + 1} minimal 10 digit`
                        );
                    } else if (member.phone === data.leader_phone) {
                        errors.push(
                            `Nomor telepon anggota ${index + 1} tidak boleh sama dengan ketua`
                        );
                    }

                    // Check for duplicate phones among members
                    data.members.forEach((otherMember, otherIndex) => {
                        if (
                            index !== otherIndex &&
                            member.phone &&
                            member.phone === otherMember.phone
                        ) {
                            errors.push(
                                `Nomor telepon anggota ${index + 1} tidak boleh sama dengan nomor telepon anggota ${otherIndex + 1}`
                            );
                        }
                    });
                });
                break;

            case 4: // Dokumen
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
                            Anggota Tim
                        </h2>

                        <p className="mb-6 text-sm text-gray-600">
                            Tambahkan anggota tim Anda (maksimal 2 anggota).
                        </p>

                        {data.members.map((member, index) => (
                            <div key={index} className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-ibp-secondary">
                                        Anggota {index + 1}
                                    </h3>
                                    {index > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMember(index)}
                                            className="px-3 py-1 text-sm text-red-600 transition-colors duration-200 bg-red-100 rounded-lg hover:bg-red-200"
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor={`member${index}_name`}
                                        value="Nama Lengkap *"
                                    />
                                    <TextInput
                                        id={`member${index}_name`}
                                        name={`member${index}_name`}
                                        value={member.name}
                                        className="block w-full mt-1"
                                        onChange={(e) =>
                                            handleMemberChange(
                                                index,
                                                "name",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nama lengkap anggota"
                                        required
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                `members.${index}.name`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor={`member${index}_nim`}
                                        value="NIM *"
                                    />
                                    <TextInput
                                        id={`member${index}_nim`}
                                        name={`member${index}_nim`}
                                        value={member.nim}
                                        className="block w-full mt-1"
                                        onChange={(e) =>
                                            handleMemberChange(
                                                index,
                                                "nim",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nomor Induk Mahasiswa"
                                        required
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                `members.${index}.nim`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor={`member${index}_email`}
                                        value="Email *"
                                    />
                                    <TextInput
                                        id={`member${index}_email`}
                                        name={`member${index}_email`}
                                        type="email"
                                        value={member.email}
                                        className="block w-full mt-1"
                                        onChange={(e) =>
                                            handleMemberChange(
                                                index,
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="email@example.com"
                                        required
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                `members.${index}.email`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>

                                <div className="mb-4">
                                    <InputLabel
                                        htmlFor={`member${index}_phone`}
                                        value="Nomor Telepon *"
                                    />
                                    <TextInput
                                        id={`member${index}_phone`}
                                        name={`member${index}_phone`}
                                        type="tel"
                                        value={member.phone}
                                        className="block w-full mt-1"
                                        onChange={(e) =>
                                            handleMemberChange(
                                                index,
                                                "phone",
                                                e.target.value
                                            )
                                        }
                                        placeholder="08xxxxxxxxxx"
                                        required
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                `members.${index}.phone`
                                            ]
                                        }
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        ))}

                        {data.members.length < 3 && (
                            <button
                                type="button"
                                onClick={addMember}
                                className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    />
                                </svg>
                                Tambah Anggota
                            </button>
                        )}
                    </div>
                );

            case 4:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-secondary">
                            Dokumen Persyaratan
                        </h2>

                        {/* Tambahkan bagian Twibbon Download di sini */}
                        <div className="mb-6 p-4 border rounded-lg bg-blue-50 border-blue-200">
                            <h3 className="mb-3 font-medium text-blue-800">
                                Download Twibbon
                            </h3>
                            <p className="mb-3 text-sm text-blue-700">
                                Please download the competition twibbon to use
                                on your social media.
                            </p>
                            <a
                                href="https://drive.google.com/uc?export=download&id=1Ce2DKzzPgmE3k9uhs7kjr9Wa5uO2YmcZ"
                                download="Twibbon_BCC_IBP_Academy_2024.jpg"
                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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
                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                    />
                                </svg>
                                Download Twibbon
                            </a>
                        </div>

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
                                            <span>Anggota</span>
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
                                                        : "Daftar BPC"}
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
