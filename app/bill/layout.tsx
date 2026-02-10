export default function BillLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <style>{`
                header, footer { display: none !important; }
                main { padding-top: 0 !important; }
                .floating-buttons, [class*="FloatingButtons"], button[class*="fixed"] { display: none !important; }
                @media print {
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                }
            `}</style>
            {children}
        </>
    );
}
