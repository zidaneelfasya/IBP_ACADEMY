import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { XMarkIcon, ClockIcon } from "@heroicons/react/24/outline";

interface DeadlineExpiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    deadline?: string;
    currentTime?: string;
}

export default function DeadlineExpiredModal({
    isOpen,
    onClose,
    deadline,
    currentTime,
}: DeadlineExpiredModalProps) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <ClockIcon
                                                className="h-8 w-8 text-red-500"
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium leading-6 text-gray-900"
                                            >
                                                Registration Deadline Expired
                                            </Dialog.Title>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                        onClick={onClose}
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <ClockIcon
                                                    className="h-5 w-5 text-red-400"
                                                    aria-hidden="true"
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">
                                                    Sorry, the registration
                                                    period has ended
                                                </h3>
                                                <div className="mt-2 text-sm text-red-700">
                                                    <p>
                                                        Unfortunately, you can
                                                        no longer register for
                                                        this competition as the
                                                        deadline has passed.
                                                    </p>
                                                    {deadline && (
                                                        <div className="mt-3 space-y-1">
                                                            <p>
                                                                <strong>
                                                                    Registration
                                                                    Deadline:
                                                                </strong>{" "}
                                                                {deadline}
                                                            </p>
                                                            {currentTime && (
                                                                <p>
                                                                    <strong>
                                                                        Current
                                                                        Time:
                                                                    </strong>{" "}
                                                                    {
                                                                        currentTime
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-blue-800">
                                                    What can you do next?
                                                </h3>
                                                <div className="mt-2 text-sm text-blue-700">
                                                    <ul className="list-disc list-inside space-y-1">
                                                        <li>
                                                            Stay updated for
                                                            future competitions
                                                        </li>
                                                        <li>
                                                            Follow our social
                                                            media for
                                                            announcements
                                                        </li>
                                                        <li>
                                                            Contact our team if
                                                            you have questions
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                                        onClick={onClose}
                                    >
                                        I Understand
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 transition-colors"
                                        onClick={() => window.history.back()}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
