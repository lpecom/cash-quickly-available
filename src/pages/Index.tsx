import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Welcome to Cash Quickly</h1>
        <p className="text-muted-foreground">Sign in to access your dashboard</p>
        <Button asChild>
          <Link to="/auth">Get Started</Link>
        </Button>
      </div>
    </div>
  );
};

export default Index;