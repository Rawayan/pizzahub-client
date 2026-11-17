
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SetupTest() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>PizzaHub UI System</CardTitle>
        <CardDescription>
          Your frontend foundation is ready.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Next.js, Tailwind CSS and ShadCN UI are configured.
        </p>

        <Button className="w-full">
          Setup Successful
        </Button>
      </CardContent>
    </Card>
  );
}
