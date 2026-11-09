import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog";
import { useStore } from "@/store";
import { useTranslation } from "react-i18next";
export function NewReportDialog() {
    const { resetLedger } = useStore();
    const { t } = useTranslation();
    return (_jsxs(Dialog, { children: [_jsx(DialogTrigger, { children: _jsx(Button, { children: t("newReport.trigger") }) }), _jsxs(DialogContent, { className: "max-w-lg!", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: t("newReport.title") }), _jsx(DialogDescription, { children: t("newReport.description") })] }), _jsxs(DialogFooter, { children: [_jsx(DialogClose, { children: _jsx(Button, { variant: "outline", children: t("newReport.cancel") }) }), _jsx(DialogClose, { children: _jsx(Button, { onClick: resetLedger, children: t("newReport.confirm") }) })] })] })] }));
}
