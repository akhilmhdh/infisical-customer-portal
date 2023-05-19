interface Props {
    value: string;
    onClick: () => void;
}

export function Button({
    value,
    onClick
}: Props) {
    return (
        <button 
            className="rounded-md border-1 border-slate-300 w-full inline-block py-3 px-4 text-white font-semibold"
            onClick={onClick}
        >
            {value}
        </button>
    );
}