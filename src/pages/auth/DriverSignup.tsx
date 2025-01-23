import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Bike, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
});

const DriverSignup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
        },
      });
      
      if (signUpError) throw signUpError;

      toast.success("Account created successfully! Please check your email.");
      navigate("/auth");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-accent flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-lg" />
        
        <Button
          variant="ghost"
          className="absolute top-4 left-4"
          onClick={() => navigate("/auth")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="relative">
          <div className="flex items-center gap-3 justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Bike className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Become a Driver</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Join our delivery team today
              </p>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="(555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full relative overflow-hidden group"
                disabled={isLoading}
              >
                <span className="relative z-10">
                  {isLoading ? "Creating Account..." : "Create Account"}
                </span>
                <div className="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              onClick={() => navigate("/auth")}
              className="text-sm"
            >
              Already have an account? Sign in
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DriverSignup;