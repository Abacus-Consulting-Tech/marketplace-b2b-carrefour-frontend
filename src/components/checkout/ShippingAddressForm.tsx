"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, MapPin, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCustomer, type MercurCustomerAddress } from "@/lib/api/mercur-store-client";

interface ShippingAddress {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  province?: string;
  postal_code: string;
  country_code: string;
  phone: string;
}

interface ShippingAddressFormProps {
  onComplete: (address: ShippingAddress) => void;
  initialData?: Partial<ShippingAddress>;
}

const europeanCountries = [
  { code: "es", name: "España" },
  { code: "fr", name: "Francia" },
  { code: "pt", name: "Portugal" },
  { code: "it", name: "Italia" },
  { code: "de", name: "Alemania" },
];

export default function ShippingAddressForm({
  onComplete,
  initialData = {},
}: ShippingAddressFormProps) {
  const [loading, setLoading] = useState(true);
  const [savedAddresses, setSavedAddresses] = useState<MercurCustomerAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  
  const [formData, setFormData] = useState<ShippingAddress>({
    email: initialData.email || "",
    first_name: initialData.first_name || "",
    last_name: initialData.last_name || "",
    address_1: initialData.address_1 || "",
    address_2: initialData.address_2 || "",
    city: initialData.city || "",
    province: initialData.province || "",
    postal_code: initialData.postal_code || "",
    country_code: initialData.country_code || "es",
    phone: initialData.phone || "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});

  useEffect(() => {
    loadSavedAddresses();
  }, []);

  const loadSavedAddresses = async () => {
    try {
      const customer = await getCustomer();
      if (customer.shipping_addresses && customer.shipping_addresses.length > 0) {
        setSavedAddresses(customer.shipping_addresses);
        setSelectedAddressId(customer.shipping_addresses[0].id);
      } else {
        setShowNewAddressForm(true);
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
      // If error (e.g., not authenticated), show new address form
      setShowNewAddressForm(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ShippingAddress, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!formData.email) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.first_name) newErrors.first_name = "El nombre es obligatorio";
    if (!formData.last_name) newErrors.last_name = "Los apellidos son obligatorios";
    if (!formData.address_1) newErrors.address_1 = "La dirección es obligatoria";
    if (!formData.city) newErrors.city = "La ciudad es obligatoria";
    if (!formData.postal_code) newErrors.postal_code = "El código postal es obligatorio";
    if (!formData.country_code) newErrors.country_code = "El país es obligatorio";
    if (!formData.phone) newErrors.phone = "El teléfono es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If using saved address
    if (selectedAddressId !== "new" && !showNewAddressForm) {
      const savedAddress = savedAddresses.find((addr) => addr.id === selectedAddressId);
      if (savedAddress) {
        onComplete({
          id: savedAddress.id,
          email: formData.email || "",
          first_name: savedAddress.first_name || "",
          last_name: savedAddress.last_name || "",
          address_1: savedAddress.address_1 || "",
          address_2: savedAddress.address_2 || "",
          city: savedAddress.city || "",
          province: savedAddress.province || "",
          postal_code: savedAddress.postal_code || "",
          country_code: savedAddress.country_code || "es",
          phone: savedAddress.phone || "",
        });
      }
      return;
    }

    // If creating new address, validate and submit
    if (validateForm()) {
      onComplete(formData);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Cargando direcciones...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Saved Addresses Selector */}
      {savedAddresses.length > 0 && !showNewAddressForm && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Selecciona una dirección de envío</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setShowNewAddressForm(true);
                setSelectedAddressId("new");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva dirección
            </Button>
          </div>

          <RadioGroup value={selectedAddressId} onValueChange={setSelectedAddressId}>
            {savedAddresses.map((address) => (
              <Card
                key={address.id}
                className={`cursor-pointer transition-all ${
                  selectedAddressId === address.id ? "border-blue-500 bg-blue-50" : ""
                }`}
                onClick={() => setSelectedAddressId(address.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        {address.metadata?.store_name && (
                          <span className="font-semibold">{address.metadata.store_name}</span>
                        )}
                        {address.metadata?.store_code && (
                          <span className="text-sm text-gray-500">({address.metadata.store_code})</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>
                          {address.first_name} {address.last_name}
                        </p>
                        <p>{address.address_1}</p>
                        {address.address_2 && <p>{address.address_2}</p>}
                        <p>
                          {address.postal_code} {address.city}
                          {address.province && `, ${address.province}`}
                        </p>
                        <p className="uppercase">{address.country_code}</p>
                        {address.phone && <p>{address.phone}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </RadioGroup>

          {/* Email field (always needed) */}
          <div>
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="tu@email.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          <Button type="submit" className="w-full">
            Continuar al Método de Envío
          </Button>
        </div>
      )}

      {/* New Address Form */}
      {(showNewAddressForm || savedAddresses.length === 0) && (
        <>
          {savedAddresses.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-semibold">Nueva dirección de envío</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowNewAddressForm(false);
                  setSelectedAddressId(savedAddresses[0]?.id || "new");
                }}
              >
                Cancelar
              </Button>
            </div>
          )}

          {/* Email */}
          <div>
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="tu@email.com"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleChange("first_name", e.target.value)}
                placeholder="Juan"
                className={errors.first_name ? "border-red-500" : ""}
              />
              {errors.first_name && (
                <p className="text-sm text-red-500 mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="last_name">
                Apellidos <span className="text-red-500">*</span>
              </Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleChange("last_name", e.target.value)}
                placeholder="Pérez García"
                className={errors.last_name ? "border-red-500" : ""}
              />
              {errors.last_name && (
                <p className="text-sm text-red-500 mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <Label htmlFor="address_1">
              Dirección <span className="text-red-500">*</span>
            </Label>
            <Input
              id="address_1"
              value={formData.address_1}
              onChange={(e) => handleChange("address_1", e.target.value)}
              placeholder="Calle Mayor, 123"
              className={errors.address_1 ? "border-red-500" : ""}
            />
            {errors.address_1 && <p className="text-sm text-red-500 mt-1">{errors.address_1}</p>}
          </div>

          <div>
            <Label htmlFor="address_2">Dirección 2 (opcional)</Label>
            <Input
              id="address_2"
              value={formData.address_2}
              onChange={(e) => handleChange("address_2", e.target.value)}
              placeholder="Piso, puerta, etc."
            />
          </div>

          {/* City, Province, Postal Code */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">
                Ciudad <span className="text-red-500">*</span>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange("city", e.target.value)}
                placeholder="Madrid"
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city}</p>}
            </div>

            <div>
              <Label htmlFor="province">Provincia</Label>
              <Input
                id="province"
                value={formData.province}
                onChange={(e) => handleChange("province", e.target.value)}
                placeholder="Madrid"
              />
            </div>

            <div>
              <Label htmlFor="postal_code">
                Código Postal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="postal_code"
                value={formData.postal_code}
                onChange={(e) => handleChange("postal_code", e.target.value)}
                placeholder="28001"
                className={errors.postal_code ? "border-red-500" : ""}
              />
              {errors.postal_code && (
                <p className="text-sm text-red-500 mt-1">{errors.postal_code}</p>
              )}
            </div>
          </div>

          {/* Country */}
          <div>
            <Label htmlFor="country_code">
              País <span className="text-red-500">*</span>
            </Label>
            <Select value={formData.country_code} onValueChange={(value) => handleChange("country_code", value)}>
              <SelectTrigger className={errors.country_code ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecciona un país" />
              </SelectTrigger>
              <SelectContent>
                {europeanCountries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country_code && (
              <p className="text-sm text-red-500 mt-1">{errors.country_code}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">
              Teléfono <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+34 600 000 000"
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Continuar al Método de Envío
          </Button>
        </>
      )}
    </form>
  );
}
