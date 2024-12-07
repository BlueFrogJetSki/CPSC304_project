export default function ContentLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (<> <div className="w-full h-10 flex justify-end items-center bg-blue-600">
        <a href="/auth/login" className="px-2 text-white hover:text-blue-800 transition">Login</a>
    </div>
        <div className="h-full w-full flex ">
            <nav className="w-fit h-full flex flex-col bg-blue-100 p-4 space-y-2 shadow-md">
                <a href="/content/conditions" className="text-blue-600 hover:text-white transition">Conditions</a>
                <a href="/content/devices" className="text-blue-600 hover:text-white transition">Devices</a>
                <a href="/content/healthentries" className="text-blue-600 hover:text-white transition">Health Entries</a>
                <a href="/content/program" className="text-blue-600 hover:text-white transition">Programs</a>
                <a href="/content/vitals" className="text-blue-600 hover:text-white transition">Vitals</a>
                <a href="/manage-user" className="text-blue-600 hover:text-white transition">Manage Users</a>
            </nav>
            <div className="w-full justify-center">{children}</div>
        </div></>)
}