import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const NewsletterSignup: React.FC = () => {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Stay Updated</h4>
      <div className="flex space-x-2">
        <Input
          type="email"
          placeholder="Enter your email"
          className="flex-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <Button
          size="sm"
          className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Subscribe
        </Button>
      </div>
    </div>
  );
};
