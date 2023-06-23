// Button Component
interface Props {
    value: string;
    onClick: (v: string) => void;
}

function Button(props: Props) {
    return (
        
        <div className="grid text-center lg:mb-0 lg:text-center">
            <button
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                rel="noopener noreferrer"
                onClick={() => props.onClick(props.value)}
            >
                <h2 className={'text-2xl font-semibold'}>
                    {props.value}
                </h2>
            </button>
        </div>
    );
}

export default Button;
