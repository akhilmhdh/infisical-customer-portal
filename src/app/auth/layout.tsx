
export default function Layout ({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <div>Hello there</div>
            {children}
        </section>
    );
}