"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  MapPin,
  Home,
  Building,
  MapPinned,
  Navigation,
  Globe,
  Pencil,
  Trash2,
  X,
  Check,
  Loader2,
  AlertCircle,
  Tag,
} from "lucide-react";
import { Address } from "@prisma/client";
import { addressSchema, AddressInput } from "@/lib/validations/address";
import {
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/actions/address";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AddressAutocomplete } from "./address-autocomplete";

const INDIAN_STATES = [
  { value: "AN", label: "Andaman and Nicobar Islands" },
  { value: "AP", label: "Andhra Pradesh" },
  { value: "AR", label: "Arunachal Pradesh" },
  { value: "AS", label: "Assam" },
  { value: "BR", label: "Bihar" },
  { value: "CH", label: "Chandigarh" },
  { value: "CT", label: "Chhattisgarh" },
  { value: "DN", label: "Dadra and Nagar Haveli and Daman and Diu" },
  { value: "DL", label: "Delhi" },
  { value: "GA", label: "Goa" },
  { value: "GJ", label: "Gujarat" },
  { value: "HR", label: "Haryana" },
  { value: "HP", label: "Himachal Pradesh" },
  { value: "JK", label: "Jammu and Kashmir" },
  { value: "JH", label: "Jharkhand" },
  { value: "KA", label: "Karnataka" },
  { value: "KL", label: "Kerala" },
  { value: "LA", label: "Ladakh" },
  { value: "LD", label: "Lakshadweep" },
  { value: "MP", label: "Madhya Pradesh" },
  { value: "MH", label: "Maharashtra" },
  { value: "MN", label: "Manipur" },
  { value: "ML", label: "Meghalaya" },
  { value: "MZ", label: "Mizoram" },
  { value: "NL", label: "Nagaland" },
  { value: "OR", label: "Odisha" },
  { value: "PY", label: "Puducherry" },
  { value: "PB", label: "Punjab" },
  { value: "RJ", label: "Rajasthan" },
  { value: "SK", label: "Sikkim" },
  { value: "TN", label: "Tamil Nadu" },
  { value: "TG", label: "Telangana" },
  { value: "TR", label: "Tripura" },
  { value: "UP", label: "Uttar Pradesh" },
  { value: "UT", label: "Uttarakhand" },
  { value: "WB", label: "West Bengal" },
] as const;

interface AddressManagerProps {
  addresses: Address[];
  error?: string;
  userProfile?: { name: string; phone: string };
}

export function AddressManager({ addresses: initialAddresses, error, userProfile }: AddressManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      name: userProfile?.name || "",
      phone: userProfile?.phone || "",
      line1: "",
      line2: undefined,
      suburb: "",
      state: "",
      postcode: "",
      country: "IN",
    },
  });

  const selectedState = watch("state");

  const openAddDialog = () => {
    setEditingAddress(null);
    reset({
      name: userProfile?.name || "",
      phone: userProfile?.phone || "",
      line1: "",
      line2: undefined,
      suburb: "",
      state: "",
      postcode: "",
      country: "IN",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (address: Address) => {
    setEditingAddress(address);
    reset({
      name: address.name || userProfile?.name || "",
      phone: address.phone || userProfile?.phone || "",
      line1: address.line1,
      line2: address.line2 || undefined,
      suburb: address.suburb,
      state: address.state,
      postcode: address.postcode,
      country: address.country || "IN",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: AddressInput) => {
    setIsLoading(true);
    try {
      if (editingAddress) {
        const result = await updateAddress(editingAddress.id, data);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        } else if (result.address) {
          setAddresses(
            addresses.map((a) => (a.id === editingAddress.id ? result.address : a))
          );
          toast({
            title: "Success",
            description: "Address updated successfully.",
            variant: "success",
          });
          setIsDialogOpen(false);
        }
      } else {
        const result = await createAddress(data);
        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
        } else if (result.address) {
          setAddresses([result.address, ...addresses]);
          toast({
            title: "Success",
            description: "Address added successfully.",
            variant: "success",
          });
          setIsDialogOpen(false);
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const result = await deleteAddress(id);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setAddresses(addresses.filter((a) => a.id !== id));
        toast({
          title: "Success",
          description: "Address deleted successfully.",
          variant: "success",
        });
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setDeleteConfirmId(null);
    }
  };

  const formatAddress = (address: Address) => {
    const parts = [
      address.line1,
      address.line2,
      `${address.suburb}, ${address.state} - ${address.postcode}`,
      address.country,
    ].filter(Boolean);
    return parts;
  };

  return (
    <main className="flex-1 min-w-0 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Addresses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your delivery addresses for faster checkout
          </p>
        </div>
        <Button onClick={openAddDialog} className="shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add New Address
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Error loading addresses</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <Card className="border-border shadow-sm">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <MapPin className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No addresses saved</h3>
            <p className="text-sm text-muted-foreground mb-5 max-w-sm">
              Add a delivery address to make checkout faster and easier
            </p>
            <Button onClick={openAddDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Address
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className="border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Home className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {(address.name || address.phone) && (
                      <div className="mb-1.5 flex flex-wrap gap-x-3 gap-y-0.5">
                        {address.name && <p className="text-sm font-semibold text-foreground">{address.name}</p>}
                        {address.phone && <p className="text-sm text-muted-foreground">{address.phone}</p>}
                      </div>
                    )}
                    <div className="space-y-0.5">
                      {formatAddress(address).map((line, i) => (
                        <p
                          key={i}
                          className={`text-sm ${i === 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(address)}
                    className="h-8 px-3"
                  >
                    <Pencil className="h-4 w-4 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirmId(address.id)}
                    className="h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {editingAddress ? "Edit Address" : "Add New Address"}
            </DialogTitle>
            <DialogDescription>
              {editingAddress
                ? "Update your delivery address details"
                : "Enter your delivery address details"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4 pt-4">
            {/* Name & Phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="addr-name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="addr-name"
                  placeholder="John Smith"
                  {...register("name")}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="addr-phone" className="text-sm font-medium">Phone</Label>
                <Input
                  id="addr-phone"
                  type="tel"
                  placeholder="98765 43210"
                  {...register("phone")}
                />
                {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Street Address Line 1 with Google Places Autocomplete */}
            <AddressAutocomplete
              value={watch("line1")}
              onChange={(value) => setValue("line1", value)}
              onAddressSelect={(address) => {
                setValue("line1", address.line1);
                if (address.line2) setValue("line2", address.line2);
                setValue("suburb", address.suburb);
                setValue("state", address.state);
                setValue("postcode", address.postcode);
                setValue("country", address.country);
              }}
              error={errors.line1?.message}
              disabled={isLoading}
            />

            {/* Street Address Line 2 */}
            <div className="space-y-2">
              <Label htmlFor="line2" className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                Apartment, Suite, Unit (Optional)
              </Label>
              <Input
                id="line2"
                type="text"
                placeholder="Apt 4B, Floor 2"
                {...register("line2")}
              />
              {errors.line2 && (
                <p className="text-sm text-destructive">{errors.line2.message}</p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                City
              </Label>
              <Input
                id="city"
                type="text"
                placeholder="Mumbai, Delhi, Bangalore..."
                {...register("suburb")}
              />
              {errors.suburb && (
                <p className="text-sm text-destructive">{errors.suburb.message}</p>
              )}
            </div>

            {/* State and PIN Code Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-muted-foreground" />
                  State
                </Label>
                <Select
                  value={selectedState}
                  onValueChange={(value) => setValue("state", value)}
                >
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && (
                  <p className="text-sm text-destructive">{errors.state.message}</p>
                )}
              </div>

              {/* PIN Code */}
              <div className="space-y-2">
                <Label htmlFor="postcode" className="text-sm font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  PIN Code
                </Label>
                <Input
                  id="postcode"
                  type="text"
                  placeholder="110001"
                  maxLength={6}
                  {...register("postcode")}
                />
                {errors.postcode && (
                  <p className="text-sm text-destructive">{errors.postcode.message}</p>
                )}
              </div>
            </div>

            {/* Country (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="country" className="text-sm font-medium flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Country
              </Label>
              <Input
                id="country"
                type="text"
                value="India"
                disabled
                className="bg-muted/50"
              />
            </div>

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    {editingAddress ? "Update Address" : "Save Address"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Address
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 pt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
