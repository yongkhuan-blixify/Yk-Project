import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/solid";

interface Props {
  open: boolean;
  title?: string;
  darkMode?: boolean;
  renderContent?: () => any;
  onClose?: () => any;
}

export default function CustomModal(props: Props) {
  const bgColor = props.darkMode ? "bg-gray-900" : "bg-white";
  const textColor = props.darkMode ? "text-white" : "text-gray-900";
  const iconColor = props.darkMode ? "text-white" : "text-primary-600";

  return (
    <Transition show={props.open}>
      <Dialog
        className="relative z-50"
        onClose={props.onClose ? props.onClose : () => {}}
      >
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div className={`fixed inset-0 z-50 w-screen overflow-y-auto`}>
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className={`${bgColor} px-4 pb-4 pt-5 sm:p-6 sm:pb-4`}>
                  <div className="">
                    <div className="">
                      {props.title && (
                        <div className="flex flex-row justify-between border-b border-gray-200 pb-4 w-full">
                          <DialogTitle
                            as="h3"
                            className={`text-lg leading-6 font-medium ${textColor}`}
                          >
                            {props.title}
                          </DialogTitle>

                          {props.onClose && (
                            <XMarkIcon
                              className={`h-5 w-5 cursor-pointer ${iconColor}`}
                              onClick={props.onClose}
                            />
                          )}
                        </div>
                      )}
                      <div className="mt-2">
                        {props.renderContent && props.renderContent()}
                      </div>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
