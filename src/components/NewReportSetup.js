import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from "@/store";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { Button } from "./ui/button";
const MAX_PEOPLE = 10;
export default function NumberOfPeople() {
    const { setPeople } = useStore();
    const { t } = useTranslation();
    const { register, control, handleSubmit, setValue, formState: { errors }, } = useForm({
        defaultValues: {
            count: 2,
            names: ["", ""],
        },
    });
    const count = useWatch({
        control,
        name: "count",
    });
    const names = useWatch({
        control,
        name: "names",
    });
    useEffect(() => {
        const limitedCount = Math.min(Math.max(Number(count) || 1, 1), MAX_PEOPLE);
        if (limitedCount !== count) {
            setValue("count", limitedCount);
        }
        const updatedNames = Array.from({ length: limitedCount }, (_, i) => names[i] || "");
        setValue("names", updatedNames);
    }, [count, names, setValue]);
    const onSubmit = (data) => {
        const finalPeople = data.names.map((name, index) => name.trim() || `Person ${index + 1}`);
        setPeople(finalPeople);
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-zinc-100 p-6", children: _jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "bg-white rounded-3xl shadow-lg p-8 w-full max-w-md border border-zinc-200", children: [_jsx("h1", { className: "text-2xl font-bold mb-4 text-zinc-800", children: t("setup.title") }), _jsx("p", { className: "text-sm text-zinc-500 mb-4", children: t("setup.description") }), _jsxs("div", { className: "mb-4", children: [_jsx("input", { type: "number", min: 1, max: MAX_PEOPLE, className: "w-full border rounded-xl px-4 py-2", ...register("count", {
                                required: true,
                                valueAsNumber: true,
                                min: {
                                    value: 1,
                                    message: t("setup.validation.minPeople"),
                                },
                                max: {
                                    value: MAX_PEOPLE,
                                    message: t("setup.validation.maxPeople", {
                                        max: MAX_PEOPLE,
                                    }),
                                },
                            }) }), errors.count && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.count.message })), _jsxs("p", { className: "text-xs text-zinc-500 mt-2", children: ["Max ", MAX_PEOPLE, " people"] })] }), _jsx("div", { className: "space-y-3 mb-4", children: Array.from({ length: count }).map((_, index) => (_jsxs("div", { children: [_jsx("input", { type: "text", placeholder: t("setup.personPlaceholder", {
                                    index: index + 1,
                                }), className: "w-full border rounded-xl px-4 py-2", ...register(`names.${index}`, {
                                    required: t("setup.validation.nameRequired"),
                                    minLength: {
                                        value: 2,
                                        message: t("setup.validation.nameTooShort"),
                                    },
                                }) }), errors.names?.[index] && (_jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.names[index]?.message }))] }, index))) }), _jsx(Button, { type: "submit", className: "w-full", children: t("setup.continue") })] }) }));
}
