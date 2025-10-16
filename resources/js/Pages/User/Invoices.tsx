import React from "react";
import UserLayout from "@/Layouts/UserLayout";
import { Head } from "@inertiajs/react";
import { Card, CardContent } from "@/Components/ui/card";

interface Payment {
    id: number;
    bank_name: string;
    account_number: string;
    account_holder: string;
    sender_account_number?: string;
    sender_account_holder?: string;
    amount: number;
    payment_proof_path?: string;
    status: "pending" | "verified" | "rejected";
    admin_notes?: string;
    verified_at?: string;
    created_at: string;
}

interface Team {
    id: number;
    tim_name: string;
    registration_number: string;
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
    competition_category: {
        id: number;
        name: string;
        full_name?: string;
    };
}

interface InvoicesProps {
    team: Team;
    payments: Payment[];
}

export default function Invoices({ team, payments }: InvoicesProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getInvoiceNumber = (payment: Payment) => {
        const date = new Date(payment.created_at);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return `INV-${year}${month}-${String(payment.id).padStart(4, "0")}`;
    };

    const getRegistrationFeeDescription = (amount: number) => {
        const rounded = Math.round(amount);

        if (rounded === 150000) {
            return "Semifinal Registration Batch-1";
        } else if (rounded === 170000) {
            return "Semifinal Registration Batch-2";
        } else {
            return "Semifinal Registration Fee";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "verified":
                return (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Verified
                    </span>
                );
            case "pending":
                return (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                    </span>
                );
            case "rejected":
                return (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                        Unknown
                    </span>
                );
        }
    };

    const getStatusBadgeForPrint = (status: string) => {
        switch (status) {
            case "verified":
                return `<span style="display: inline-flex; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; background-color: #dcfce7; color: #166534;">Verified</span>`;
            case "pending":
                return `<span style="display: inline-flex; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; background-color: #fef9c3; color: #854d0e;">Pending</span>`;
            case "rejected":
                return `<span style="display: inline-flex; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; background-color: #fee2e2; color: #991b1b;">Rejected</span>`;
            default:
                return `<span style="display: inline-flex; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 600; border-radius: 9999px; background-color: #f3f4f6; color: #374151;">Unknown</span>`;
        }
    };

    const handleDownloadInvoice = (payment: Payment) => {
        const printContent = generateInvoiceHTML(payment);
        const printWindow = window.open("", "_blank", "width=800,height=600");

        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();

            // Focus on the new window
            printWindow.focus();

            // Auto-print after content loads
            printWindow.onload = function () {
                setTimeout(() => {
                    printWindow.print();
                }, 500);
            };
        }
    };
    const generateInvoiceHTML = (payment: Payment) => {
        return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice ${getInvoiceNumber(payment)}</title>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                color: #374151;
                background: white;
                padding: 0;
                margin: 0;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .invoice-container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                position: relative;
            }
            
            .invoice-header {
                display: flex;
                justify-content: space-between;
                background: linear-gradient(135deg, #082e80 0%, #0a3b99 100%);
                color: white;
                padding: 24px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .invoice-title {
                font-size: 28px;
                font-weight: bold;
                margin-bottom: 8px;
            }
            
            .invoice-info {
                font-size: 14px;
                opacity: 0.9;
            }
            
            .invoice-company {
                text-align: right;
            }
            
            .company-logo {
                width: 80px;
                height: 80px;
                background: white;
                border-radius: 8px;
                margin-left: auto;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .company-logo img {
                width: 70px;
                height: 70px;
                object-fit: contain;
            }
            
            .bill-to {
                padding: 24px;
            }
            
            .section-title {
                font-size: 18px;
                font-weight: 600;
                color: #082e80;
                margin-bottom: 16px;
            }
            
            .bill-to-content {
                background: #f9fafb;
                padding: 16px;
                border-radius: 6px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

          .bill-to-section {
                padding: 24px;
            }
            
            .bill-to-title {
                font-size: 18px;
                font-weight: 600;
                color: #082e80;
                margin-bottom: 16px;
            }
            
            .bill-to-card {
                background: #f9fafb;
                padding: 16px;
                border-radius: 8px;
                border: 1px solid #e5e7eb;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .team-info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            
            .team-main-info h4 {
                font-weight: 600;
                color: #111827;
                margin-bottom: 8px;
                font-size: 16px;
            }
            
            .team-detail {
                font-size: 14px;
                color: #6b7280;
                line-height: 1.5;
            }
            
            .leader-info h5 {
                font-weight: 500;
                color: #374151;
                margin-bottom: 8px;
                font-size: 14px;
            }
            
            .leader-detail {
                font-size: 14px;
                color: #6b7280;
                line-height: 1.5;
            }
                
            
            .team-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 24px 0;
            }
            
            th {
                background: #f3f4f6;
                text-align: left;
                padding: 12px 16px;
                font-weight: 600;
                color: #374151;
                border-bottom: 1px solid #e5e7eb;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            td {
                padding: 12px 16px;
                border-bottom: 1px solid #e5e7eb;
            }
            
            .text-right {
                text-align: right;
            }
            
            .text-center {
                text-align: center;
            }
            
            .summary {
                display: flex;
                justify-content: flex-end;
                margin: 24px 0;
            }
            
            .summary-content {
                width: 256px;
            }
            
            .summary-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
            }
            
            .summary-total {
                border-top: 2px solid #082e80;
                padding-top: 12px;
                font-weight: bold;
                font-size: 16px;
                color: #082e80;
            }
            
            .payment-info {
                padding: 24px;
                border-top: 1px solid #e5e7eb;
            }
            
            .payment-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 24px;
            }
            
            .payment-card {
                background: #f9fafb;
                padding: 16px;
                border-radius: 6px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .admin-notes {
                background: #dbeafe;
                border: 1px solid #93c5fd;
                border-radius: 6px;
                padding: 16px;
                margin: 16px 24px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .invoice-footer {
                background: linear-gradient(135deg, #082e80 0%, #0a3b99 100%);
                color: white;
                text-align: center;
                padding: 16px;
                font-size: 14px;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            
            .verified-watermark {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 120px;
                font-weight: bold;
                color: #10b981;
                opacity: 0.1;
                pointer-events: none;
                z-index: 10;
            }
            
            /* Print-specific styles */
            @media print {
                body {
                    padding: 0 !important;
                    margin: 0 !important;
                    background: white !important;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                
                .invoice-container {
                    max-width: 100% !important;
                    margin: 0 !important;
                    box-shadow: none !important;
                    border: none !important;
                }
                
                .no-print {
                    display: none !important;
                }
                
                /* Ensure all backgrounds print correctly */
                .invoice-header,
                .invoice-footer {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    background: linear-gradient(135deg, #082e80 0%, #0a3b99 100%) !important;
                }
                    
                
                .bill-to-content,
                .payment-card,
                th {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    background: #f9fafb !important;
                }
                
                .admin-notes {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                    background: #dbeafe !important;
                }
            }
            
            @media (max-width: 768px) {
                body {
                    padding: 0;
                }
                
                .invoice-header {
                    padding: 16px;
                }
                
                .team-info {
                    grid-template-columns: 1fr;
                }
                
                .payment-grid {
                    grid-template-columns: 1fr;
                }
            }
        </style>
    </head>
    <body>
        <div class="invoice-container">
            ${
                payment.status === "verified"
                    ? '<div class="verified-watermark">VERIFIED</div>'
                    : ""
            }
            
            <div class="invoice-header">
                <div>
                    <div class="invoice-title">INVOICE</div>
                    <div class="invoice-info">
                        <div>Invoice No: ${getInvoiceNumber(payment)}</div>
                        <div>Date of Issue: ${formatDate(
                            payment.created_at
                        )}</div>
                        <div>Status: ${getStatusBadgeForPrint(
                            payment.status
                        )}</div>
                    </div>
                </div>
                <div class="invoice-company">
                    <div class="company-logo">
                        <img src="${
                            window.location.origin
                        }/image/logo/logo.png" alt="IBP Academy Logo" onerror="this.style.display='none'" />
                    </div>
                    <div class="company-name">IBP Academy</div>
                    <div class="invoice-info">Competition Platform</div>
                </div>
            </div>
            
            <div class="bill-to-section">
                <div class="bill-to-title">Bill To</div>
                <div class="bill-to-card">
                    <div class="team-info-grid">
                        <div class="team-main-info">
                            <h4>${team.tim_name}</h4>
                            <div class="team-detail">
                                <div>Registration No: ${
                                    team.registration_number
                                }</div>
                                <div>Category: ${
                                    team.competition_category.name
                                }</div>
                            </div>
                        </div>
                        <div class="leader-info">
                            <h5>Team Leader</h5>
                            <div class="leader-detail">
                                <div>${team.leader_name}</div>
                                <div>${team.leader_nim}</div>
                                <div>${team.leader_email}</div>
                                <div>${team.leader_phone}</div>
                                <div>${team.leader_univ} - ${
            team.leader_fakultas
        }</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Description</th>
                        <th class="text-center">Qty</th>
                        <th class="text-right">Rate</th>
                        <th class="text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td> 
                          <td>
                              <div>
                                  <div>${getRegistrationFeeDescription(payment.amount)}</div>
                                  <div style="font-size: 12px; color: #6b7280;">${
                                      team.competition_category.name
                                  } Competition</div>
                              </div>
                          </td>
                        <td class="text-center">1</td>
                        <td class="text-right">${formatCurrency(
                            payment.amount
                        )}</td>
                        <td class="text-right" style="font-weight: 600;">${formatCurrency(
                            payment.amount
                        )}</td>
                    </tr>
                </tbody>
            </table>
            
            <div class="summary">
                <div class="summary-content">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>${formatCurrency(payment.amount)}</span>
                    </div>

                    <div class="summary-row">
                        <span>Tax Rate</span>
                        <span>0.00%</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax</span>
                        <span>${formatCurrency(0)}</span>
                    </div>
                    <div class="summary-row summary-total">
                        <span>Total</span>
                        <span>${formatCurrency(payment.amount)}</span>
                    </div>
                </div>
            </div>
            
            <div class="payment-info">
                <div class="section-title">Payment Information</div>
                <div class="payment-grid">
                    <div>
                        <div style="font-weight: 500; margin-bottom: 8px;">Payment To</div>
                        <div class="payment-card">
                            <div style="font-weight: 600; margin-bottom: 4px;">${
                                payment.bank_name
                            }</div>
                            <div style="font-size: 14px; color: #6b7280;">Account: ${
                                payment.account_number
                            }</div>
                            <div style="font-size: 14px; color: #6b7280;">Name: ${
                                payment.account_holder
                            }</div>
                        </div>
                    </div>
                    ${
                        payment.sender_account_number
                            ? `
                    <div>
                        <div style="font-weight: 500; margin-bottom: 8px;">Payment From</div>
                        <div class="payment-card">
                            <div style="font-size: 14px; color: #6b7280;">Account: ${payment.sender_account_number}</div>
                            <div style="font-size: 14px; color: #6b7280;">Name: ${payment.sender_account_holder}</div>
                        </div>
                    </div>
                    `
                            : ""
                    }
                </div>
            </div>
            
            ${
                payment.admin_notes
                    ? `
            <div class="admin-notes">
                <div style="font-weight: 500; color: #1e40af; margin-bottom: 8px;">Admin Notes</div>
                <div style="font-size: 14px; color: #1e40af;">${payment.admin_notes}</div>
            </div>
            `
                    : ""
            }
            
            <div class="invoice-footer">
                Thank you for your participation in IBP Academy!
            </div>
        </div>
        
        <script>
            // Trigger print automatically
            window.onload = function() {
                setTimeout(function() {
                    window.print();
                }, 500);
            };
            
            // Close window after printing
            window.onafterprint = function() {
                setTimeout(function() {
                    window.close();
                }, 100);
            };
        </script>
    </body>
    </html>
    `;
    };

    return (
        <UserLayout title="Invoices">
            <Head title="Invoices - IBP Academy" />

            <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
                <div className="max-w-4xl mx-auto">
                    {/* Page Header */}
                    <div className="mb-4 sm:mb-8 no-print">
                        <h1 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">
                            Payment Invoices
                        </h1>
                        <p className="text-sm sm:text-base text-gray-600">
                            View and manage your payment invoices
                        </p>
                    </div>

                    {payments.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <p className="text-gray-500 text-lg">
                                    No payment invoices found.
                                </p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Your payment invoices will appear here once
                                    you make a payment.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4 sm:space-y-8">
                            {payments.map((payment) => (
                                <div key={payment.id} className="relative">
                                    {/* Download Button */}
                                    <div className="flex justify-end mb-2 no-print">
                                        <button
                                            onClick={() =>
                                                handleDownloadInvoice(payment)
                                            }
                                            className="bg-[#082e80] hover:bg-[#0a3b99] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg flex items-center gap-2 text-sm transition-colors"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                />
                                            </svg>
                                            Download Invoice
                                        </button>
                                    </div>

                                    {/* Preview Card */}
                                    <Card className="overflow-hidden shadow-lg relative">
                                        {payment.status === "verified" && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                                <div
                                                    className="text-green-500 font-bold transform rotate-12 opacity-10"
                                                    style={{
                                                        fontSize:
                                                            "clamp(3rem, 15vw, 8rem)",
                                                    }}
                                                >
                                                    VERIFIED
                                                </div>
                                            </div>
                                        )}

                                        <div className="bg-gradient-to-r from-[#082e80] to-[#0a3b99] text-white p-3 sm:p-6">
                                            {/* Header Section */}
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <h2 className="text-xl sm:text-3xl font-bold mb-2">
                                                        INVOICE
                                                    </h2>
                                                    <div className="space-y-1 text-xs sm:text-sm opacity-90">
                                                        <p>
                                                            Invoice No:{" "}
                                                            {getInvoiceNumber(
                                                                payment
                                                            )}
                                                        </p>
                                                        <p>
                                                            Date of Issue:{" "}
                                                            {formatDate(
                                                                payment.created_at
                                                            )}
                                                        </p>
                                                        <p className="flex items-center gap-2">
                                                            Status:{" "}
                                                            {getStatusBadge(
                                                                payment.status
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-center sm:text-right">
                                                    <div className="flex flex-col items-center sm:items-end">
                                                        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white rounded-lg p-1 mb-2">
                                                            <img
                                                                src="/image/logo/logo.png"
                                                                alt="IBP Academy Logo"
                                                                className="w-full h-full object-contain"
                                                            />
                                                        </div>
                                                        <h3 className="font-bold text-sm sm:text-lg">
                                                            IBP Academy
                                                        </h3>
                                                        <p className="text-xs sm:text-sm opacity-90">
                                                            Competition Platform
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <CardContent className="p-3 sm:p-6">
                                            {/* Bill To Section */}
                                            <div className="mb-6 sm:mb-8">
                                                <h3 className="text-base sm:text-lg font-semibold text-[#082e80] mb-3 sm:mb-4">
                                                    Bill To
                                                </h3>
                                                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                                                    <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                                {team.tim_name}
                                                            </h4>
                                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                                Registration No:{" "}
                                                                {
                                                                    team.registration_number
                                                                }
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                Category:{" "}
                                                                {
                                                                    team
                                                                        .competition_category
                                                                        .name
                                                                }
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <h5 className="font-medium text-gray-800 text-sm sm:text-base">
                                                                Team Leader
                                                            </h5>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                {
                                                                    team.leader_name
                                                                }
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                {
                                                                    team.leader_nim
                                                                }
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                {
                                                                    team.leader_email
                                                                }
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                {
                                                                    team.leader_phone
                                                                }
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                                                {
                                                                    team.leader_univ
                                                                }{" "}
                                                                -{" "}
                                                                {
                                                                    team.leader_fakultas
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Invoice Details Table */}
                                            <div className="mb-6 sm:mb-8">
                                                <div className="overflow-x-auto">
                                                    <table className="w-full border-collapse text-xs sm:text-sm">
                                                        <thead>
                                                            <tr className="bg-gray-100">
                                                                <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 border-b">
                                                                    Item
                                                                </th>
                                                                <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 border-b">
                                                                    Description
                                                                </th>
                                                                <th className="text-center p-2 sm:p-3 font-semibold text-gray-700 border-b">
                                                                    Qty
                                                                </th>
                                                                <th className="text-right p-2 sm:p-3 font-semibold text-gray-700 border-b">
                                                                    Rate
                                                                </th>
                                                                <th className="text-right p-2 sm:p-3 font-semibold text-gray-700 border-b">
                                                                    Amount
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr>
                                                                <td className="p-2 sm:p-3 border-b">
                                                                    1
                                                                </td>
                                                                <td className="p-2 sm:p-3 border-b">
                                                                    <div className="text-xs sm:text-sm">
                                                                        {getRegistrationFeeDescription(
                                                                            payment.amount
                                                                        )}
                                                                        <br />
                                                                        <span className="text-xs text-gray-500">
                                                                            {
                                                                                team
                                                                                    .competition_category
                                                                                    .name
                                                                            }{" "}
                                                                            Competition
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center p-2 sm:p-3 border-b">
                                                                    1
                                                                </td>
                                                                <td className="text-right p-2 sm:p-3 border-b">
                                                                    {formatCurrency(
                                                                        payment.amount
                                                                    )}
                                                                </td>
                                                                <td className="text-right p-2 sm:p-3 border-b font-semibold">
                                                                    {formatCurrency(
                                                                        payment.amount
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>

                                            {/* Summary Section */}
                                            <div className="flex justify-end">
                                                <div className="w-full sm:w-64">
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between py-2">
                                                            <span className="text-gray-600 text-sm">
                                                                Subtotal
                                                            </span>
                                                            <span className="font-semibold text-sm">
                                                                {formatCurrency(
                                                                    payment.amount
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="flex justify-between py-2">
                                                            <span className="text-gray-600 text-sm">
                                                                Tax Rate
                                                            </span>
                                                            <span className="font-semibold text-sm">
                                                                0.00%
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between py-2 border-t">
                                                            <span className="text-gray-600 text-sm">
                                                                Tax
                                                            </span>
                                                            <span className="font-semibold text-sm">
                                                                {formatCurrency(
                                                                    0
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between py-3 border-t-2 border-[#082e80]">
                                                            <span className="text-base sm:text-lg font-bold text-[#082e80]">
                                                                Total
                                                            </span>
                                                            <span className="text-base sm:text-lg font-bold text-[#082e80]">
                                                                {formatCurrency(
                                                                    payment.amount
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Payment Information */}
                                            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t">
                                                <h3 className="text-base sm:text-lg font-semibold text-[#082e80] mb-3 sm:mb-4">
                                                    Payment Information
                                                </h3>
                                                <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                                                    <div>
                                                        <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">
                                                            Payment To
                                                        </h4>
                                                        <div className="bg-gray-50 p-3 rounded">
                                                            <p className="font-semibold text-sm sm:text-base">
                                                                {
                                                                    payment.bank_name
                                                                }
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                Account:{" "}
                                                                {
                                                                    payment.account_number
                                                                }
                                                            </p>
                                                            <p className="text-xs sm:text-sm text-gray-600">
                                                                Name:{" "}
                                                                {
                                                                    payment.account_holder
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {payment.sender_account_number && (
                                                        <div>
                                                            <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">
                                                                Payment From
                                                            </h4>
                                                            <div className="bg-gray-50 p-3 rounded">
                                                                <p className="text-xs sm:text-sm text-gray-600">
                                                                    Account:{" "}
                                                                    {
                                                                        payment.sender_account_number
                                                                    }
                                                                </p>
                                                                <p className="text-xs sm:text-sm text-gray-600">
                                                                    Name:{" "}
                                                                    {
                                                                        payment.sender_account_holder
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Admin Notes */}
                                            {payment.admin_notes && (
                                                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <h4 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">
                                                        Admin Notes
                                                    </h4>
                                                    <p className="text-xs sm:text-sm text-blue-700">
                                                        {payment.admin_notes}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>

                                        {/* Footer */}
                                        <div className="bg-gradient-to-r from-[#082e80] to-[#0a3b99] text-white p-3 sm:p-4 text-center">
                                            <p className="text-xs sm:text-sm">
                                                Thank you for your participation
                                                in IBP Academy!
                                            </p>
                                        </div>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </UserLayout>
    );
}
