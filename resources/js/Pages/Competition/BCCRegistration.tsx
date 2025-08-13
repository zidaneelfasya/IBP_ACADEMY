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
    leader_name: string;
    leader_nim: string;
    leader_email: string;
    leader_phone: string;
    leader_univ: string;
    leader_fakultas: string;
    status: string;
    created_at: string;
}

interface Member {
    name: string;
    nim: string;
    email: string;
    phone: string;
    univ: string;
    fakultas: string;
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
    leader_name: string;
    leader_nim: string;
    leader_email: string;
    leader_phone: string;
    leader_univ: string;
    leader_fakultas: string;
    member1: Member;
    member2: Member;
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
    const totalSteps = 4;

    useEffect(() => {
        if (existingRegistration) {
            setShowExistingModal(true);
        }
    }, [existingRegistration]);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        tim_name: "",
        leader_name: auth.user?.name || "",
        leader_nim: "",
        leader_email: auth.user?.email || "",
        leader_phone: "",
        leader_univ: "",
        leader_fakultas: "",
        member1: {
            name: "",
            nim: "",
            email: "",
            phone: "",
            univ: "",
            fakultas: "",
        },
        member2: {
            name: "",
            nim: "",
            email: "",
            phone: "",
            univ: "",
            fakultas: "",
        },
        link_berkas: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (existingRegistration) {
            setShowExistingModal(true);
            return;
        }

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

    const nextStep = () => {
        // Validate current step before proceeding
        const stepErrors = validateStep(currentStep);

        if (stepErrors.length > 0) {
            setStepValidationErrors(stepErrors);
            setShowErrorModal(true);
            return;
        }

        // Mark current step as validated
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

    const handleMemberChange = (
        member: "member1" | "member2",
        field: keyof Member,
        value: string
    ) => {
        setData(member, {
            ...data[member],
            [field]: value,
        });
    };

    const validateStep = (step: number): string[] => {
        const errors: string[] = [];

        switch (step) {
            case 1: // Team Information
                if (!data.tim_name.trim()) {
                    errors.push("Team name must be filled");
                } else if (data.tim_name.length < 3) {
                    errors.push("Team name must be at least 3 characters");
                }
                break;

            case 2: // Team Leader
                if (!data.leader_name.trim()) {
                    errors.push("Leader name must be filled");
                } else if (data.leader_name.length < 3) {
                    errors.push("Leader name must be at least 3 characters");
                }

                if (!data.leader_nim.trim()) {
                    errors.push("Leader NIM must be filled");
                } else if (data.leader_nim.length < 5) {
                    errors.push("Leader NIM must be at least 5 characters");
                }

                if (!data.leader_email.trim()) {
                    errors.push("Leader email must be filled");
                } else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.leader_email)
                ) {
                    errors.push("Invalid leader email format");
                }

                if (!data.leader_phone.trim()) {
                    errors.push("Leader phone number must be filled");
                } else if (data.leader_phone.length < 10) {
                    errors.push(
                        "Leader phone number must be at least 10 digits"
                    );
                }

                if (!data.leader_univ.trim()) {
                    errors.push("Leader university must be filled");
                } else if (data.leader_univ.length < 5) {
                    errors.push(
                        "Leader university must be at least 5 characters"
                    );
                }

                if (!data.leader_fakultas.trim()) {
                    errors.push("Leader faculty must be filled");
                } else if (data.leader_fakultas.length < 3) {
                    errors.push("Leader faculty must be at least 3 characters");
                }
                break;

            case 3: // Team Members
                // Member 1 validation
                if (!data.member1.name.trim()) {
                    errors.push("Member 1 name must be filled");
                } else if (data.member1.name.length < 3) {
                    errors.push("Member 1 name must be at least 3 characters");
                }

                if (!data.member1.nim.trim()) {
                    errors.push("Member 1 NIM must be filled");
                } else if (data.member1.nim.length < 5) {
                    errors.push("Member 1 NIM must be at least 5 characters");
                } else if (data.member1.nim === data.leader_nim) {
                    errors.push("Member 1 NIM cannot be same as leader");
                }

                if (!data.member1.email.trim()) {
                    errors.push("Member 1 email must be filled");
                } else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.member1.email)
                ) {
                    errors.push("Invalid member 1 email format");
                } else if (data.member1.email === data.leader_email) {
                    errors.push("Member 1 email cannot be same as leader");
                }

                if (!data.member1.phone.trim()) {
                    errors.push("Member 1 phone number must be filled");
                } else if (data.member1.phone.length < 10) {
                    errors.push(
                        "Member 1 phone number must be at least 10 digits"
                    );
                } else if (data.member1.phone === data.leader_phone) {
                    errors.push("Member 1 phone cannot be same as leader");
                }

                if (!data.member1.univ.trim()) {
                    errors.push("Member 1 university must be filled");
                } else if (data.member1.univ.length < 5) {
                    errors.push(
                        "Member 1 university must be at least 5 characters"
                    );
                }

                if (!data.member1.fakultas.trim()) {
                    errors.push("Member 1 faculty must be filled");
                } else if (data.member1.fakultas.length < 3) {
                    errors.push(
                        "Member 1 faculty must be at least 3 characters"
                    );
                }

                // Member 2 validation
                if (!data.member2.name.trim()) {
                    errors.push("Member 2 name must be filled");
                } else if (data.member2.name.length < 3) {
                    errors.push("Member 2 name must be at least 3 characters");
                }

                if (!data.member2.nim.trim()) {
                    errors.push("Member 2 NIM must be filled");
                } else if (data.member2.nim.length < 5) {
                    errors.push("Member 2 NIM must be at least 5 characters");
                } else if (data.member2.nim === data.leader_nim) {
                    errors.push("Member 2 NIM cannot be same as leader");
                } else if (data.member2.nim === data.member1.nim) {
                    errors.push("Member 2 NIM cannot be same as member 1");
                }

                if (!data.member2.email.trim()) {
                    errors.push("Member 2 email must be filled");
                } else if (
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.member2.email)
                ) {
                    errors.push("Invalid member 2 email format");
                } else if (data.member2.email === data.leader_email) {
                    errors.push("Member 2 email cannot be same as leader");
                } else if (data.member2.email === data.member1.email) {
                    errors.push("Member 2 email cannot be same as member 1");
                }

                if (!data.member2.phone.trim()) {
                    errors.push("Member 2 phone number must be filled");
                } else if (data.member2.phone.length < 10) {
                    errors.push(
                        "Member 2 phone number must be at least 10 digits"
                    );
                } else if (data.member2.phone === data.leader_phone) {
                    errors.push("Member 2 phone cannot be same as leader");
                } else if (data.member2.phone === data.member1.phone) {
                    errors.push("Member 2 phone cannot be same as member 1");
                }

                if (!data.member2.univ.trim()) {
                    errors.push("Member 2 university must be filled");
                } else if (data.member2.univ.length < 5) {
                    errors.push(
                        "Member 2 university must be at least 5 characters"
                    );
                }

                if (!data.member2.fakultas.trim()) {
                    errors.push("Member 2 faculty must be filled");
                } else if (data.member2.fakultas.length < 3) {
                    errors.push(
                        "Member 2 faculty must be at least 3 characters"
                    );
                }
                break;

            case 4: // Documents
                if (!data.link_berkas.trim()) {
                    errors.push("Document link must be filled");
                } else if (!/^https?:\/\/.+/.test(data.link_berkas)) {
                    errors.push(
                        "Invalid document URL format (must start with http:// or https://)"
                    );
                }
                break;
        }

        return errors;
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-primary">
                            Team Information
                        </h2>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="tim_name"
                                value="Team Name *"
                            />
                            <TextInput
                                id="tim_name"
                                name="tim_name"
                                value={data.tim_name}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("tim_name", e.target.value)
                                }
                                placeholder="Enter a unique team name"
                                required
                            />
                            <InputError
                                message={errors.tim_name}
                                className="mt-2"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-secondary">
                            Team Leader
                        </h2>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="leader_name"
                                value="Full Name *"
                            />
                            <TextInput
                                id="leader_name"
                                name="leader_name"
                                value={data.leader_name}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("leader_name", e.target.value)
                                }
                                placeholder="Team leader's full name"
                                required
                            />
                            <InputError
                                message={errors.leader_name}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="leader_nim"
                                value="Student ID *"
                            />
                            <TextInput
                                id="leader_nim"
                                name="leader_nim"
                                value={data.leader_nim}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("leader_nim", e.target.value)
                                }
                                placeholder="Student identification number"
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
                                value="Phone Number *"
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

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="leader_univ"
                                value="University *"
                            />
                            <TextInput
                                id="leader_univ"
                                name="leader_univ"
                                value={data.leader_univ}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("leader_univ", e.target.value)
                                }
                                placeholder="Leader's university"
                                required
                            />
                            <InputError
                                message={(errors as any).leader_univ}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4">
                            <InputLabel
                                htmlFor="leader_fakultas"
                                value="Faculty *"
                            />
                            <TextInput
                                id="leader_fakultas"
                                name="leader_fakultas"
                                value={data.leader_fakultas}
                                className="block w-full mt-1"
                                onChange={(e) =>
                                    setData("leader_fakultas", e.target.value)
                                }
                                placeholder="Leader's faculty"
                                required
                            />
                            <InputError
                                message={(errors as any).leader_fakultas}
                                className="mt-2"
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-primary">
                            Team Members
                        </h2>

                        <p className="mb-6 text-sm text-gray-600">
                            Please complete the data for both team members.
                        </p>

                        {/* Member 1 */}
                        <div className="mb-8">
                            <h3 className="mb-4 text-lg font-medium text-ibp-secondary">
                                Member 1
                            </h3>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="member1_name"
                                    value="Full Name *"
                                />
                                <TextInput
                                    id="member1_name"
                                    name="member1_name"
                                    value={data.member1.name}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member1",
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Member's full name"
                                    required
                                />
                                <InputError
                                    message={(errors as any)["member1.name"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="member1_nim"
                                    value="Student ID *"
                                />
                                <TextInput
                                    id="member1_nim"
                                    name="member1_nim"
                                    value={data.member1.nim}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member1",
                                            "nim",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Student identification number"
                                    required
                                />
                                <InputError
                                    message={(errors as any)["member1.nim"]}
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
                                    value={data.member1.email}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member1",
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="email@example.com"
                                    required
                                />
                                <InputError
                                    message={(errors as any)["member1.email"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="member1_phone"
                                    value="Phone Number *"
                                />
                                <TextInput
                                    id="member1_phone"
                                    name="member1_phone"
                                    type="tel"
                                    value={data.member1.phone}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member1",
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="08xxxxxxxxxx"
                                    required
                                />
                                <InputError
                                    message={(errors as any)["member1.phone"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="member1_univ"
                                    value="University *"
                                />
                                <TextInput
                                    id="member1_univ"
                                    name="member1_univ"
                                    value={data.member1.univ}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member1",
                                            "univ",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Member's university"
                                    required
                                />
                                <InputError
                                    message={(errors as any)["member1.univ"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="member1_fakultas"
                                    value="Faculty *"
                                />
                                <TextInput
                                    id="member1_fakultas"
                                    name="member1_fakultas"
                                    value={data.member1.fakultas}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member1",
                                            "fakultas",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Member's faculty"
                                    required
                                />
                                <InputError
                                    message={
                                        (errors as any)["member1.fakultas"]
                                    }
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* Member 2 */}
                        <div className="mb-8">
                            <h3 className="mb-4 text-lg font-medium text-ibp-secondary">
                                Member 2
                            </h3>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="member2_name"
                                    value="Full Name *"
                                />
                                <TextInput
                                    id="member2_name"
                                    name="member2_name"
                                    value={data.member2.name}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member2",
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Member's full name"
                                    required
                                />
                                <InputError
                                    message={(errors as any)["member2.name"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="member2_nim"
                                    value="Student ID *"
                                />
                                <TextInput
                                    id="member2_nim"
                                    name="member2_nim"
                                    value={data.member2.nim}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member2",
                                            "nim",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Student identification number"
                                    required
                                />
                                <InputError
                                    message={(errors as any)["member2.nim"]}
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
                                    value={data.member2.email}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member2",
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="email@example.com"
                                    required
                                />
                                <InputError
                                    message={(errors as any)["member2.email"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="member2_phone"
                                    value="Phone Number *"
                                />
                                <TextInput
                                    id="member2_phone"
                                    name="member2_phone"
                                    type="tel"
                                    value={data.member2.phone}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member2",
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="08xxxxxxxxxx"
                                    required
                                />
                                <InputError
                                    message={(errors as any)["member2.phone"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="member2_univ"
                                    value="University *"
                                />
                                <TextInput
                                    id="member2_univ"
                                    name="member2_univ"
                                    value={data.member2.univ}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member2",
                                            "univ",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Member's university"
                                    required
                                />
                                <InputError
                                    message={(errors as any)["member2.univ"]}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mb-4">
                                <InputLabel
                                    htmlFor="member2_fakultas"
                                    value="Faculty *"
                                />
                                <TextInput
                                    id="member2_fakultas"
                                    name="member2_fakultas"
                                    value={data.member2.fakultas}
                                    className="block w-full mt-1"
                                    onChange={(e) =>
                                        handleMemberChange(
                                            "member2",
                                            "fakultas",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Member's faculty"
                                    required
                                />
                                <InputError
                                    message={
                                        (errors as any)["member2.fakultas"]
                                    }
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div>
                        <h2 className="mb-4 text-xl font-semibold text-ibp-secondary">
                            Requirements Documents
                        </h2>

                        <div className="mb-6 p-4 border rounded-lg bg-blue-50 border-blue-200">
                            <h3 className="mb-3 font-medium text-blue-800">
                                Download Twibbon
                            </h3>
                            <p className="mb-3 text-sm text-blue-700">
                                Please download the competition twibbon to use
                                on your social media.
                            </p>
                            <a
                                href="https://drive.google.com/uc?export=download&id=1SrKwNzLZuPtwj0kcgsRoryw9WuLpKxTS"
                                download="Twibbon_BCC_IBP_Academy_2025.jpg"
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
                                value="Required Documents Link *"
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
                                placeholder="https://drive.google.com/... or other link"
                                required
                            />
                            <InputError
                                message={errors.link_berkas}
                                className="mt-2"
                            />
                        </div>

                        <div className="p-4 mt-4 border rounded-lg border-ibp-neutral bg-ibp-neutral/30">
                            <h3 className="mb-2 font-semibold text-blue-900">
                                Document Upload Instructions:
                            </h3>
                            <ul className="space-y-1 text-sm text-black/70">
                                <li>
                                    • Student ID Card (KTM): PDF format only
                                </li>
                                <li>
                                    • Formal photo: JPG, PNG, or JPEG formats
                                </li>
                                <li>
                                    • Twibbon screenshot: JPG, PNG, or JPEG
                                    formats
                                </li>
                                <li>
                                    • Instagram follow screenshot: JPG, PNG, or
                                    JPEG formats
                                </li>
                                <li>• Upload documents to Google Drive</li>
                                <li>
                                    • Ensure the link is accessible to the
                                    committee
                                </li>
                                <li>
                                    • Combine multiple files into a single
                                    folder if needed
                                </li>
                                 <li>
                                    • For Twibbon Caption, please visit:{" "}
                                    <a
                                        href="https://drive.google.com/drive/folders/1JCV9lxHaA6OAP1pl8pUy7oR5WMM-8Bo2?usp=drive_link"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline hover:text-blue-800 transition-colors"
                                    >
                                        View Caption
                                    </a>
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
            <Head title={`${category.name} Registration - IBP Academy`} />
            <div className="min-h-screen py-4 sm:py-8 bg-gradient-to-br from-neutral-200 to-white">
                <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                    {/* Floating Back Button - Mobile Only */}
                    <button
                        onClick={() => window.history.back()}
                        className="fixed z-50 flex items-center justify-center w-12 h-12 text-white transition-all duration-200 rounded-full shadow-lg md:hidden top-6 left-4 bg-gradient-to-r from-blue-900 to-blue-600 hover:shadow-xl hover:scale-105"
                    >
                        <svg
                            className="w-5 h-5"
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
                    </button>

                    <div className="flex items-start max-w-6xl gap-4 mx-auto">
                        {/* Back Button - Desktop Only */}
                        <div className="flex-shrink-0 pt-2 hidden md:block">
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
                                Back
                            </button>
                        </div>

                        {/* Form Card */}
                        <div className="flex-1 max-w-4xl ">
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
                                                {category.name} Registration
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
                                                IBP Academy Competition 2025
                                            </div>
                                        </div>
                                    </div>{" "}
                                    {/* Progress Bar */}
                                    <div className="relative p-4 mt-8 rounded-lg bg-white/20 backdrop-blur-sm">
                                        <div className="flex justify-between mb-3 text-sm font-medium">
                                            <span className="text-ibp-accent">
                                                Step {currentStep} of{" "}
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
                                                                ? "bg-ibp-accent shadow-lg shadow-accent/50" // Current step
                                                                : validatedSteps.includes(
                                                                      index + 1
                                                                  )
                                                                ? "bg-ibp-secondary shadow-md shadow-ibp-secondary/30" // Validated step
                                                                : index + 1 <
                                                                  currentStep
                                                                ? "bg-white opacity-80" // Previous step
                                                                : "bg-white/30" // Unreached step
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
                                            <span>Team</span>
                                            <span>Leader</span>
                                            <span>Members</span>
                                            <span>Documents</span>
                                        </div>

                                        {/* Legend - Responsive layout */}
                                        <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs sm:gap-4">
                                            <div className="flex items-center text-ibp-white/90">
                                                <div className="w-2 h-2 mr-1 rounded-full shadow-sm sm:w-3 sm:h-3 bg-ibp-secondary"></div>
                                                <span>Validated</span>
                                            </div>
                                            <div className="flex items-center text-ibp-white/90">
                                                <div className="w-2 h-2 mr-1 rounded-full shadow-lg sm:w-3 sm:h-3 bg-ibp-accent shadow-ibp-accent/50"></div>
                                                <span>Current</span>
                                            </div>
                                            <div className="flex items-center text-ibp-white/90">
                                                <div className="w-2 h-2 mr-1 rounded-full sm:w-3 sm:h-3 bg-ibp-white/30"></div>
                                                <span>Unreached</span>
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
                                                    You Are Already Registered
                                                </h3>
                                                <div className="mt-1 text-sm text-green-700">
                                                    <p>
                                                        Team{" "}
                                                        <strong>
                                                            {
                                                                existingRegistration.tim_name
                                                            }
                                                        </strong>{" "}
                                                        is already registered
                                                        with registration number{" "}
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
                                                    View Details →
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
                                                ← Previous
                                            </button>

                                            {currentStep < totalSteps ? (
                                                <button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="order-1 px-4 py-3 font-medium transition-all duration-200 rounded-lg sm:order-2 sm:px-6 text-ibp-white bg-gradient-to-r from-blue-900 to-blue-600 hover:from-blue-900/90 hover:to-blue-600/90 hover:shadow-lg shadow-blue-900/25"
                                                >
                                                    Next →
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
                                                        ? "Registering..."
                                                        : existingRegistration
                                                        ? "Already Registered"
                                                        : "Register for BCC"}
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
                                            ? "Incomplete Data for Submission"
                                            : "Incomplete Data"}
                                    </h3>

                                    <div className="mb-6 text-left">
                                        <p className="mb-3 text-xs text-gray-600 sm:text-sm">
                                            {currentStep === totalSteps &&
                                            stepValidationErrors.length > 0
                                                ? "Please complete all required data before submitting registration:"
                                                : "Please complete the following data before proceeding to the next step:"}
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
                                            Close
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
