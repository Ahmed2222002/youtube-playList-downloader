import { useEffect, useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { IoClose } from "react-icons/io5";
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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type FormValues = {
  type: "income" | "expense";
  amount: string;
  cause: string;
  date: Date | undefined;
  unknownDate: boolean;
  shares: number[];
};

export function AddTransactionDialog() {
  const { addTransaction, people } = useStore();
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<FormValues>();

  const unknownDate = useWatch({
    control,
    name: "unknownDate",
  });

  useEffect(() => {
    reset((values) => ({
      ...values,
      shares: people.map(() => 0),
    }));
  }, [people, reset]);

  const onSubmit = (data: FormValues) => {
    const sign = data.type === "income" ? 1 : -1;

    addTransaction({
      type: data.type,
      amount: formatAmount(Number(data.amount) * sign),
      cause: data.cause.trim(),
      date: data.unknownDate ? null : (data.date?.toISOString() ?? null),
      shares: data.shares.map((share) => formatAmount(Number(share) * sign)),
    });

    reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (nextOpen) {
          reset({
            type: "income",
            amount: "",
            cause: "",
            date: new Date(),
            unknownDate: false,
            shares: people.map(() => 0),
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="mb-6 cursor-pointer">
          + {t("addTransaction.addTransaction")}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl!">
        <DialogHeader className="flex items-center flex-row justify-between">
          <div className="space-y-2">
            <DialogTitle className="text-2xl">
              {t("addTransaction.newTransaction")}
            </DialogTitle>

            <DialogDescription className="text-gray-600">
              {t("addTransaction.description")}
            </DialogDescription>
          </div>

          <DialogClose>
            <IoClose className="size-6 hover:rotate-180 duration-300 cursor-pointer" />
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-4">
          {/* TYPE */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("addTransaction.type")}</Label>

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
                    <span>{t("addTransaction.income")}</span>
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
                    <span>{t("addTransaction.expense")}</span>
                  </label>
                </RadioGroup>
              )}
            />
          </div>

          {/* AMOUNT */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("addTransaction.amount")}</Label>

            <div className="col-span-3">
              <Input
                type="number"
                {...register("amount", {
                  required: t("addTransaction.validation.amountRequired"),
                  validate: (value) => {
                    const amount = Number(value);

                    if (value.includes("-")) {
                      return t("addTransaction.validation.noNegativeNumbers");
                    }

                    if (isNaN(amount) || amount <= 0) {
                      return t("addTransaction.validation.validAmount");
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

          {/* CAUSE */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("addTransaction.cause")}</Label>

            <div className="col-span-3">
              <Input
                {...register("cause", {
                  required: t("addTransaction.validation.causeRequired"),
                  validate: (value) =>
                    value.trim() !== "" ||
                    t("addTransaction.validation.causeRequired"),
                })}
              />

              {errors.cause && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.cause.message}
                </p>
              )}
            </div>
          </div>

          {/* SHARES */}
          <div className="space-y-3">
            <Label className="block">{t("addTransaction.splitAmount")}</Label>

            {people.map((person, index) => (
              <div key={index} className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm text-gray-900  ps-5">{person}</span>

                <div className="col-span-3">
                  <Input
                    type="number"
                    {...register(`shares.${index}`, {
                      valueAsNumber: true,
                      validate: (value) => {
                        if (String(value).includes("-")) {
                          return t(
                            "addTransaction.validation.noNegativeNumbers",
                          );
                        }

                        if (isNaN(value) || value < 0) {
                          return t("addTransaction.validation.shareNegative");
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
                            "addTransaction.validation.sharesMustEqualAmount",
                          );
                        }

                        return true;
                      },
                      onChange: () => {
                        trigger("shares");
                      },
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

          {/* DATE */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t("addTransaction.date")}</Label>

            <div className="col-span-3 flex items-center gap-3">
              <Controller
                control={control}
                name="date"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 px-8"
                        disabled={unknownDate}
                      >
                        <CalendarIcon className="size-4" />

                        {field.value
                          ? format(field.value, "PPP")
                          : t("addTransaction.pickDate")}
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
                {t("addTransaction.unknown")}
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">{t("addTransaction.saveTransaction")}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
