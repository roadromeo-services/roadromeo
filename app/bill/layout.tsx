export default function BillLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <style>{`
                header { display: none !important; }
                footer { display: none !important; }
                main { padding-top: 0 !important; }
                .fixed:not(.bill-page):not(.bill-page *) { display: none !important; }
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        margin: 0;
                        padding: 0;
                    }
                    main { padding: 0 !important; }
                    .bill-page {
                        padding: 0 !important;
                        background: white !important;
                    }
                    .bill-card {
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        max-width: 100% !important;
                    }
                    .bill-no-print { display: none !important; }
                }
            `}</style>
            {children}
        </>
    );
}
