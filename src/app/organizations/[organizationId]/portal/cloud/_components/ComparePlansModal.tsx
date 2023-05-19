import { Dialog } from '@headlessui/react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import {
    ComparePlansTabGroup
} from './ComparePlansTabGroup';

interface Props {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    organizationId: string;
}

export function ComparePlansModal({
    isOpen,
    setIsOpen,
    organizationId
}: Props) {
    return (
        <Dialog 
                open={isOpen} 
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                {/* <div className="fixed inset-0 overflow-y-auto"> */}
                    <div className="fixed inset-0 flex items-center justify-center">
                        <Dialog.Panel className="max-w-screen-xl w-full rounded-md bg-midnight-light shadow-md p-8">
                            <div className="flex justify-between items-center mb-8">
                                <Dialog.Title className="text-xl font-semibold text-white">
                                    Infisical Cloud Plans
                                </Dialog.Title>
                                <button 
                                    className="rounded-md inline-block py-3 px-4 text-white font-semibold"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <FontAwesomeIcon 
                                        icon={faXmark}
                                        size="lg"
                                    />
                                </button>
                            </div>
                            <ComparePlansTabGroup 
                                organizationId={organizationId}
                            />
                        </Dialog.Panel>
                    </div>
                {/* </div> */}
            </Dialog>
    );
}
{/* <Dialog 
                open={isOpen} 
                onClose={() => setIsOpen(false)}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center">
                    <Dialog.Panel className="max-w-screen-xl w-full rounded-md bg-midnight-light shadow-md p-8">
                        <div className="flex justify-between items-center mb-8">
                            <Dialog.Title className="text-xl font-semibold text-white">
                                Infisical Cloud Plans
                            </Dialog.Title>
                            <button 
                                className="rounded-md inline-block py-3 px-4 text-white font-semibold"
                                onClick={() => setIsOpen(false)}
                            >
                                <FontAwesomeIcon 
                                    icon={faXmark}
                                    size="lg"
                                />
                            </button>
                        </div>
                        <ComparePlansTabGroup />
                    </Dialog.Panel>
                </div>
            </Dialog> */}