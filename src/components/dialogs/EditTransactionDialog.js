import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { formatAmount } from "@/utils/helpers";
import { IoClose } from "react-icons/io5";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";
export function EditTransactionDialog({ transaction }) {
    const { updateTransaction, people } = useStore();
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const initialSign = transaction.type === "income" ? 1 : -1;
    const { register, handleSubmit, control, reset, getValues, setValue, trigger, formState: { errors }, } = useForm();
    const unknownDate = useWatch({
        control,
        name: "unknownDate",
    });
    const onSubmit = (data) => {
        if (!transaction)
            return;
        const sign = data.type === "income" ? 1 : -1;
        updateTransaction(transaction.id, {
            type: data.type,
            amount: formatAmount(Number(data.amount) * sign),
            cause: data.cause.trim(),
            date: data.unknownDate ? null : (data.date?.toISOString() ?? null),
            shares: data.shares.map((share) => formatAmount(Number(share) * sign)),
        });
        setOpen(false);
    };
    return (_jsxs(Dialog, { open: open, onOpenChange: (nextOpen) => {
            setOpen(nextOpen);
            if (nextOpen) {
                reset({
                    type: transaction.type,
                    amount: String(formatAmount(transaction.amount * initialSign)),
                    cause: transaction.cause.trim(),
                    date: transaction.date ? new Date(transaction.date) : undefined,
                    unknownDate: !transaction.date,
                    shares: transaction.shares.map((share) => formatAmount(share * initialSign)),
                });
            }
        }, children: [_jsx(DialogTrigger, { asChild: true, className: "bg-transparent hover:bg-gray-200 p-1 rounded-sm size-7 cursor-pointer group hover:text-blue-600 duration-300", children: _jsx(FiEdit, { className: "size-3" }) }), _jsxs(DialogContent, { className: "max-w-2xl!", children: [_jsxs(DialogHeader, { className: "flex items-center flex-row justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(DialogTitle, { className: "text-2xl", children: t("editTransaction.title") }), _jsx(DialogDescription, { className: "text-gray-600", children: t("editTransaction.description") })] }), _jsx(DialogClose, { children: _jsx(IoClose, { className: "size-6 hover:rotate-180 duration-300 cursor-pointer" }) })] }), _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5 py-4", children: [_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { className: "text-right", children: t("editTransaction.type") }), _jsx(Controller, { control: control, name: "type", render: ({ field }) => (_jsxs(RadioGroup, { value: field.value, onValueChange: field.onChange, className: "flex col-span-3 items-center gap-4 rtl:justify-end", children: [_jsxs("label", { className: cn("flex items-center gap-2 rounded-md border px-4 py-1.5 cursor-pointer transition-colors", field.value === "income"
                                                        ? "border-green-600 bg-green-50 text-green-700"
                                                        : "border-gray-300"), children: [_jsx(RadioGroupItem, { value: "income", className: "border-green-500 text-green-600 border-2" }), _jsx("span", { children: t("editTransaction.income") })] }), _jsxs("label", { className: cn("flex items-center gap-2 rounded-md border px-4 py-1.5 cursor-pointer transition-colors", field.value === "expense"
                                                        ? "border-red-600 bg-red-50 text-red-700"
                                                        : "border-gray-300"), children: [_jsx(RadioGroupItem, { value: "expense", className: "border-red-500 text-red-600 border-2" }), _jsx("span", { children: t("editTransaction.expense") })] })] })) })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { className: "text-right", children: t("editTransaction.amount") }), _jsxs("div", { className: "col-span-3", children: [_jsx(Input, { ...register("amount", {
                                                    required: t("editTransaction.validation.amountRequired"),
                                                    validate: (value) => {
                                                        const amount = Number(value);
                                                        if (value.includes("-")) {
                                                            return t("editTransaction.validation.noNegativeNumbers");
                                                        }
                                                        if (isNaN(amount) || amount <= 0) {
                                                            return t("editTransaction.validation.validAmount");
                                                        }
                                                        return true;
                                                    },
                                                }) }), errors.amount && (_jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.amount.message }))] })] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { className: "text-right", children: t("editTransaction.cause") }), _jsxs("div", { className: "col-span-3", children: [_jsx(Input, { ...register("cause", {
                                                    required: t("editTransaction.validation.causeRequired"),
                                                    validate: (value) => value.trim() !== "" ||
                                                        t("editTransaction.validation.causeRequired"),
                                                }) }), errors.cause && (_jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.cause.message }))] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx(Label, { className: "block", children: t("editTransaction.splitAmount") }), people.map((person, index) => (_jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx("span", { className: "text-right text-sm text-zinc-600", children: person }), _jsxs("div", { className: "col-span-3", children: [_jsx(Input, { type: "number", ...register(`shares.${index}`, {
                                                            valueAsNumber: true,
                                                            validate: (value) => {
                                                                if (String(value).includes("-")) {
                                                                    return t("editTransaction.validation.noNegativeNumbers");
                                                                }
                                                                if (isNaN(value) || value < 0) {
                                                                    return t("editTransaction.validation.shareNegative");
                                                                }
                                                                const amount = Number(getValues("amount"));
                                                                const shares = getValues("shares") || [];
                                                                const totalShares = shares.reduce((sum, n) => sum + (Number(n) || 0), 0);
                                                                if (amount > 0 &&
                                                                    Number(amount.toFixed(2)) !==
                                                                        Number(totalShares.toFixed(2))) {
                                                                    return t("editTransaction.validation.sharesMustEqualAmount");
                                                                }
                                                                return true;
                                                            },
                                                            onChange: () => trigger("shares"),
                                                        }) }), errors.shares?.[index] && (_jsx("p", { className: "text-sm text-red-500 mt-1", children: errors.shares[index]?.message }))] })] }, index)))] }), _jsxs("div", { className: "grid grid-cols-4 items-center gap-4", children: [_jsx(Label, { className: "text-right", children: t("editTransaction.date") }), _jsxs("div", { className: "col-span-3 flex items-center gap-3", children: [_jsx(Controller, { control: control, name: "date", render: ({ field }) => (_jsxs(Popover, { children: [_jsx(PopoverTrigger, { asChild: true, children: _jsxs(Button, { variant: "outline", className: cn("w-60 justify-start"), disabled: unknownDate, children: [_jsx(CalendarIcon, { className: "mr-2 h-4 w-4" }), field.value
                                                                        ? format(field.value, "PPP")
                                                                        : t("editTransaction.pickDate")] }) }), _jsx(PopoverContent, { className: "p-0", children: _jsx(Calendar, { className: "w-full", mode: "single", selected: field.value, onSelect: field.onChange }) })] })) }), _jsxs("label", { className: "flex items-center text-nowrap gap-2 text-sm cursor-pointer", children: [_jsx(Input, { type: "checkbox", className: "accent-black", ...register("unknownDate"), onChange: (e) => {
                                                            setValue("unknownDate", e.target.checked);
                                                            if (e.target.checked) {
                                                                setValue("date", undefined);
                                                            }
                                                        } }), t("editTransaction.unknown")] })] })] }), _jsx(DialogFooter, { children: _jsx(Button, { type: "submit", children: t("editTransaction.saveChanges") }) })] })] })] }));
}
