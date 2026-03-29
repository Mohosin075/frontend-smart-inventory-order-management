"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, X, Star, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetSubscriptionPlansQuery, useUpdateSubscriptionPlanMutation } from "@/redux/features/dashboard/dashboardApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface PlanFeature {
  id: string;
  text: string;
}

interface Plan {
  id: string;
  name: string;
  billingCycle: string;
  price: string;
  isPopular: boolean;
  features: PlanFeature[];
  description?: string;
}

export default function SubscriptionEditPage() {
  const router = useRouter();
  const { data: plansData, isLoading, isError } = useGetSubscriptionPlansQuery(undefined);
  const [updatePlanMutation, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation();
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    if (plansData?.success && Array.isArray(plansData.data) && plans.length === 0) {
      const mappedPlans = plansData.data.map((p: any) => ({
        id: p._id,
        name: p.name,
        billingCycle: p.interval === 'year' ? 'Yearly Billing' : 'Monthly Billing',
        price: p.price.toString(),
        isPopular: p.isPopular || false,
        description: p.description || (p.interval === 'year' ? `$${(p.price / 12).toFixed(2)}/month when billed annually` : ""),
        features: p.features.map((f: string, idx: number) => ({ id: idx.toString(), text: f }))
      }));
      
      // Defer the state update to prevent "cascading renders" warning
      const timer = setTimeout(() => {
        setPlans(mappedPlans);
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [plansData, plans.length]);

  const updatePlan = (planId: string, field: keyof Plan, value: any) => {
    setPlans(prevPlans => prevPlans.map(plan => 
      plan.id === planId ? { ...plan, [field]: value } : plan
    ));
  };

  const updateFeature = (planId: string, featureId: string, text: string) => {
    setPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        features: plan.features.map(f => f.id === featureId ? { ...f, text } : f)
      };
    }));
  };

  const addFeature = (planId: string) => {
    setPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        features: [...plan.features, { id: Math.random().toString(), text: "New feature" }]
      };
    }));
  };

  const removeFeature = (planId: string, featureId: string) => {
    setPlans(prevPlans => prevPlans.map(plan => {
      if (plan.id !== planId) return plan;
      return {
        ...plan,
        features: plan.features.filter(f => f.id !== featureId)
      };
    }));
  };

  const handleSave = async () => {
    // Basic validation
    const invalidPricePlan = plans.find(plan => isNaN(parseFloat(plan.price)));
    if (invalidPricePlan) {
      toast.error(`Invalid price for ${invalidPricePlan.name}`);
      return;
    }

    try {
      const updatePromises = plans.map(plan => {
        const body = {
          name: plan.name,
          price: parseFloat(plan.price),
          isPopular: plan.isPopular,
          features: plan.features.map(f => f.text),
          description: plan.description
        };
        return updatePlanMutation({ id: plan.id, body }).unwrap();
      });

      await Promise.all(updatePromises);
      toast.success("All plans updated successfully");
      router.push("/subscription");
    } catch (err: any) {
      console.error("Failed to update plans:", err);
      const errorMessage = err?.data?.message || "Failed to update some plans. Please try again.";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-destructive font-medium">Error loading subscription plans.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-serif text-foreground uppercase tracking-widest">EDIT SUBSCRIPTION PLANS</h1>
          <p className="text-muted-foreground mt-1">Update pricing and features</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full"
          onClick={() => router.push("/subscription")}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Edit Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="font-serif text-xl uppercase tracking-wider text-foreground">{plan.name}</CardTitle>
                  <CardDescription className="mt-1">{plan.billingCycle}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {plan.isPopular ? (
                    <Badge className="bg-[#F48FB1] hover:bg-[#F48FB1]/90 text-white gap-1 px-3 py-1 rounded-full border-none">
                      <Star className="w-3 h-3 fill-current" /> Popular
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full px-3 py-1 border-none cursor-pointer" onClick={() => updatePlan(plan.id, 'isPopular', true)}>
                      Set Popular
                    </Badge>
                  )}
                  {plan.isPopular && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0 rounded-full text-muted-foreground"
                      onClick={() => updatePlan(plan.id, 'isPopular', false)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label className="text-sm text-foreground/70">Price (USD)</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</div>
                  <Input 
                    value={plan.price}
                    onChange={(e) => updatePlan(plan.id, 'price', e.target.value)}
                    className="pl-7 bg-[#FDE8ED] border-none text-foreground font-medium h-10"
                  />
                </div>
                {plan.description && (
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Label className="font-serif text-foreground">Features</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-auto p-0 text-[#F48FB1] hover:text-[#F48FB1]/80 hover:bg-transparent text-xs"
                  onClick={() => addFeature(plan.id)}
                >
                  + Add Feature
                </Button>
              </div>
              
              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature.id} className="flex gap-2 items-center group">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <Input 
                      value={feature.text}
                      onChange={(e) => updateFeature(plan.id, feature.id, e.target.value)}
                      className="flex-1 bg-[#FDE8ED] border-none h-9 text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFeature(plan.id, feature.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Preview Section */}
      <div className="pt-8">
        <h2 className="text-lg font-serif text-foreground mb-6">Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="border-none shadow-sm bg-white overflow-hidden h-full">
              <CardHeader className="pb-4">
                 <div className="flex justify-between items-start">
                    <CardTitle className="font-serif text-xl uppercase tracking-wider text-foreground">{plan.name}</CardTitle>
                    {plan.isPopular && (
                        <Badge className="bg-[#F48FB1] hover:bg-[#F48FB1]/90 text-white gap-1 px-3 py-1 rounded-full border-none">
                            <Star className="w-3 h-3 fill-current" /> Most Popular
                        </Badge>
                    )}
                 </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-serif text-[#F48FB1] font-medium">${plan.price}</span>
                  <span className="text-muted-foreground">/{plan.billingCycle.includes("Yearly") ? "yr" : "mo"}</span>
                </div>
                {plan.description && (
                  <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature.id} className="flex gap-3 items-start">
                      <div className="mt-1">
                        <Check className="w-4 h-4 text-green-500" />
                      </div>
                      <span className="text-sm text-foreground/80">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t flex justify-center gap-4 z-50 md:pl-64">
        <div className="w-full max-w-4xl flex gap-4">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl h-12 border-gray-200" 
              onClick={() => router.push("/subscription")}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 rounded-xl h-12 bg-[#F48FB1] hover:bg-[#F48FB1]/90 text-white" 
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
        </div>
      </div>
    </div>
  );
}
