import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Page Not Found</CardTitle>
          <CardDescription className="text-center">
            The page you are looking for does not exist.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/" className="text-primary hover:underline">
            <Button className="w-full cursor-pointer">Back to Home</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
