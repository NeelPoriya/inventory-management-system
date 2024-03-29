"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { DatePicker } from "../inward/components/DatePicker";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/lib/reactQueries/client";
import { Loader } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";

export default function InvoicePage() {
  const [invoiceInputs, setInvoiceInputs] = useState<{
    invoiceId: string;
    invoiceDate: string;
    clientId: string;
    startDate: Date;
    endDate: Date;
  }>({
    invoiceId: "",
    invoiceDate: "",
    startDate: new Date(),
    endDate: new Date(),
    clientId: "",
  });

  const {
    data: clients,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: getClients,
  });

  const handleSubmit = async (formData: FormData) => {
    try {
      if (
        !invoiceInputs.invoiceId ||
        !invoiceInputs.invoiceDate ||
        !invoiceInputs.startDate ||
        !invoiceInputs.endDate
      ) {
        throw new Error("All fields are required");
      }

      const response = await fetch("/api/invoice", {
        method: "POST",
        body: JSON.stringify({
          ...invoiceInputs,
          startDate: new Date(
            invoiceInputs.startDate.getTime() + 330 * 60 * 1000
          ),
          endDate: new Date(invoiceInputs.endDate.getTime() + 330 * 60 * 1000),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate invoice");
      }

      const data = await response.blob();
      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "invoice.pdf";
      a.click();
      toast.success("Invoice generated successfully");
    } catch (error) {
      console.error(error);
      toast.error(`${error}`);
    }
  };

  if (error) {
    return <div>{`${error}`}</div>;
  }

  if (isLoading) {
    return (
      <div className="py-8 max-w-5 mx-auto">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="text-xl font-bold">Download Invoice</div>
      <div className="py-4">
        <form
          action={handleSubmit}
          method="POST"
          className="flex flex-col gap-4 max-w-[400px]"
        >
          <div>
            <Label htmlFor="invoiceId" className="text-foreground">
              Invoice Number*
            </Label>
            <Input
              required
              type="text"
              id="invoiceId"
              placeholder="Invoice Number"
              onChange={(e) => {
                setInvoiceInputs((prev) => ({
                  ...prev,
                  invoiceId: e.target.value,
                }));
              }}
              value={invoiceInputs.invoiceId}
            />
          </div>
          <div>
            <Label htmlFor="invoiceDate" className="text-foreground">
              Invoice Date*
            </Label>
            <Input
              required
              type="text"
              id="invoiceDate"
              placeholder="Invoice Date"
              value={invoiceInputs.invoiceDate}
              onChange={(e) => {
                setInvoiceInputs((prev) => ({
                  ...prev,
                  invoiceDate: e.target.value,
                }));
              }}
            />
          </div>
          <div>
            <Label htmlFor="clientId" className="text-foreground">
              Client*
            </Label>
            <Select
              required={true}
              onValueChange={(value) => {
                setInvoiceInputs((prev) => ({
                  ...prev,
                  clientId: value,
                }));
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a client" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Clients</SelectLabel>
                  {clients?.map((client) => (
                    <SelectItem key={client._id} value={client._id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="name" className="text-right">
              Start Date*
            </Label>
            <DatePicker
              date={new Date(invoiceInputs.startDate)}
              setDate={(newDate) => {
                setInvoiceInputs((prev) => ({
                  ...prev,
                  startDate: newDate,
                }));
              }}
            />
          </div>
          <div>
            <Label htmlFor="name" className="text-right">
              End Date*
            </Label>
            <DatePicker
              date={new Date(invoiceInputs.endDate)}
              setDate={(newDate) => {
                setInvoiceInputs((prev) => ({
                  ...prev,
                  endDate: newDate,
                }));
              }}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Download Invoice</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
