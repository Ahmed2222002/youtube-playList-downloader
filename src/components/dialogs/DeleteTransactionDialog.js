import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { useStore } from "@/store";
import { IoTrashOutline } from "react-icons/io5";
export function DeleteTransactionDialog({ transactionName, id }) {
    const { deleteTransaction } = useStore();
    const { t } = useTranslation();
    return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { className: "bg-transparent hover:bg-gray-200 duration-200 p-1 rounded-sm size-7 cursor-pointer hover:text-red-600", children: _jsx(IoTrashOutline, { className: "size-5" }) }), _jsxs(DialogContent, { className: "max-w-lg!", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: t("deleteTransaction.title") }), _jsx(DialogDescription, { children: t("deleteTransaction.description", {
                                    name: transactionName,
                                }) })] }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { children: _jsx(Button, { children: t("deleteTransaction.cancel") }) }), _jsx(DialogClose, { children: _jsx(Button, { variant: "delete", onClick: () => deleteTransaction(id), children: t("deleteTransaction.delete") }) })] })] })] }));
}
