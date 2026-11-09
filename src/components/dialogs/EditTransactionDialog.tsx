import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { useForm, Controller, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { formatAmount } from "@/utils/helpers";
import { IoClose } from "react-icons/io5";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useState } from "react";

type FormValues = {
  type: "income" | "expense";
  amount: string;
  cause: string;
  date: Date | undefined;
  unknownDate: boolean;
  shares: number[];
};

export function EditTransactionDialog({ transaction }) {
  const { updateTransaction, people } = useStore();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const initialSign = transaction.type === "income" ? 1 : -1;

  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormValues>();

  const unknownDate = useWatch({
    control,
    name: "unknownDate",
  });

  const onSubmit = (data: FormValues) => {
    if (!transaction) return;

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

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          reset({
            type: transaction.type,
            amount: String(formatAmount(transaction.amount * initialSign)),
            cause: transaction.cause.trim(),
            date: transaction.date ? new Date(transaction.date) : undefined,
            unknownDate: !transaction.date,
            shares: transaction.shares.map((share) =>
              formatAmount(share * initialSign),
            ),
          });
        }
      }}
    >
      <DialogTrigger
        asChild
        className="bg-transparent hover:bg-gray-200 p-1 rounded-sm size-7 cursor-pointer group hover:text-blue-600 duration-300"
      >
        <FiEdit className="size-3" />
      </DialogTrigger>

      <DialogContent className="max-w-2xl!">
        <DialogHeader className="flex items-center flex-row justify-between">
          <div className="space-y-2">
            <DialogTitle className="text-2xl">
              {t("editTransaction.title")}
            </DialogTitle>

            <DialogDescription className="text-gray-600">
              {t("editTransaction.description")}
            </DialogDescription>
          </div>

          <DialogClose>
            <IoClose className="size-6 hover:rotate-180 duration-300 cursor-pointer" />
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("editTransaction.type")}</Label>

            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex col-span-3 items-center gap-4 rtl:justify-end"
                >
                  <label
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-4 py-1.5 cursor-pointer transition-colors",
                      field.value === "income"
                        ? "border-green-600 bg-green-50 text-green-700"
                        : "border-gray-300",
                    )}
                  >
                    <RadioGroupItem
                      value="income"
                      className="border-green-500 text-green-600 border-2"
                    />
                    <span>{t("editTransaction.income")}</span>
                  </label>

                  <label
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-4 py-1.5 cursor-pointer transition-colors",
                      field.value === "expense"
                        ? "border-red-600 bg-red-50 text-red-700"
                        : "border-gray-300",
                    )}
                  >
                    <RadioGroupItem
                      value="expense"
                      className="border-red-500 text-red-600 border-2"
                    />
                    <span>{t("editTransaction.expense")}</span>
                  </label>
                </RadioGroup>
              )}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("editTransaction.amount")}</Label>

            <div className="col-span-3">
              <Input
                {...register("amount", {
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
                })}
              />

              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("editTransaction.cause")}</Label>

            <div className="col-span-3">
              <Input
                {...register("cause", {
                  required: t("editTransaction.validation.causeRequired"),
                  validate: (value) =>
                    value.trim() !== "" ||
                    t("editTransaction.validation.causeRequired"),
                })}
              />

              {errors.cause && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cause.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="block">{t("editTransaction.splitAmount")}</Label>

            {people.map((person, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <span className="text-right text-sm text-zinc-600">
                  {person}
                </span>

                <div className="col-span-3">
                  <Input
                    type="number"
                    {...register(`shares.${index}`, {
                      valueAsNumber: true,
                      validate: (value) => {
                        if (String(value).includes("-")) {
                          return t(
                            "editTransaction.validation.noNegativeNumbers",
                          );
                        }

                        if (isNaN(value) || value < 0) {
                          return t("editTransaction.validation.shareNegative");
                        }

                        const amount = Number(getValues("amount"));
                        const shares = getValues("shares") || [];
                        const totalShares = shares.reduce(
                          (sum, n) => sum + (Number(n) || 0),
                          0,
                        );

                        if (
                          amount > 0 &&
                          Number(amount.toFixed(2)) !==
                            Number(totalShares.toFixed(2))
                        ) {
                          return t(
                            "editTransaction.validation.sharesMustEqualAmount",
                          );
                        }

                        return true;
                      },
                      onChange: () => trigger("shares"),
                    })}
                  />

                  {errors.shares?.[index] && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.shares[index]?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("editTransaction.date")}</Label>

            <div className="col-span-3 flex items-center gap-3">
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-60 justify-start")}
                        disabled={unknownDate}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value
                          ? format(field.value, "PPP")
                          : t("editTransaction.pickDate")}
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent className="p-0">
                      <Calendar
                        className="w-full"
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />

              <label className="flex items-center text-nowrap gap-2 text-sm cursor-pointer">
                <Input
                  type="checkbox"
                  className="accent-black"
                  {...register("unknownDate")}
                  onChange={(e) => {
                    setValue("unknownDate", e.target.checked);

                    if (e.target.checked) {
                      setValue("date", undefined);
                    }
                  }}
                />
                {t("editTransaction.unknown")}
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">{t("editTransaction.saveChanges")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
