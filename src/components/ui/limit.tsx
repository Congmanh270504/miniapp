import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, Zap } from "lucide-react";
const Limit = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <div className="container mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-6 text-[#320A6B] dark:text-[#3B38A0]">
          Limitations & Pricing
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Transparency is key. Here's what you should know about current
          limitations and our approach to pricing.
        </p>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:${
          children ? "grid-cols-3" : "grid-cols-2"
        } gap-8 max-w-6xl mx-auto`}
      >
        {/* Limitations Card */}
        <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-orange-500/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
              <Zap className="h-8 w-8 text-orange-500 group-hover:scale-110 transition-transform" />
            </div>
            <CardTitle className="text-2xl group-hover:text-orange-500 transition-colors">
              Current Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">File Size:</span>{" "}
                Maximum 50 MB per audio file upload and 10 MB per image upload
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Storage:</span>{" "}
                Limited by Pinata free tier
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  Performance:
                </span>{" "}
                Image loading may be slower during peak times
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Features:</span>{" "}
                Some advanced functionalities still in development
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Mobile:</span>{" "}
                Experience may vary across different devices
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Uploads:</span>{" "}
                The user can only upload up to{" "}
                <span className="font-medium  text-red-600">20</span> songs/user
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Card */}
        <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-green-500/30">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-4 rounded-full bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              <DollarSign className="h-8 w-8 text-green-500 group-hover:scale-110 transition-transform" />
            </div>
            <CardTitle className="text-2xl group-hover:text-green-500 transition-colors">
              Pricing Model
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-500 mb-2">FREE</div>
              <p className="text-muted-foreground">
                Currently completely free to use
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  No Hidden Costs:
                </span>{" "}
                All features available at no charge
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  Learning Project:
                </span>{" "}
                Built for educational and portfolio purposes
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  Future Plans:
                </span>{" "}
                May introduce premium features for sustainability
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  Open Source:
                </span>{" "}
                Code available for learning and contribution (soon)
              </p>
            </div>

            <div className="mt-6 p-4 bg-green-500/10 rounded-lg">
              <p className="text-sm text-center text-muted-foreground">
                💡 <span className="font-medium">Note:</span> This is a
                portfolio project to demonstrate modern web development skills
                and is not intended for commercial use.
              </p>
            </div>
          </CardContent>
        </Card>
        {children}
      </div>
    </div>
  );
};

export default Limit;
