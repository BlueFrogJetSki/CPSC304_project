import "../globals.css"


export default function LoginLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="w-full h-full flex justify-center items-center">{children}</div>
    );  
}
