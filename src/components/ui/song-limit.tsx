"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Frown, Music, Plus, Zap } from "lucide-react";
import Link from "next/link";
import { FaRegSadCry } from "react-icons/fa";
import Limit from "./limit";
export default function SongLimitPage() {
  const currentSongs = 20;
  const maxSongs = 20;
  const progressPercentage = (currentSongs / maxSongs) * 100;

  return (
    <div className="min-h-screen container mx-auto bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full space-y-6 max-w-7xl mx-auto">
        <Limit
          children={
            <Card className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 hover:border-orange-500/30">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 rounded-full bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                  <FaRegSadCry className="h-8 w-8 text-purple-500 animate-shake " />
                </div>
                <CardTitle className="text-2xl group-hover:text-purple-500 transition-colors flex items-center justify-center gap-2">
                  <Music className="w-6 h-6 text-purple-500 " />
                  Song Limit Reached
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Songs Created</span>
                    <span className="font-medium">
                      {currentSongs}/{maxSongs}
                    </span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    className="h-3"
                    indicatorColor="bg-red-600"
                  />
                </div>

                <div className="text-center space-y-3">
                  <p className="text-gray-700 leading-relaxed">
                    You've created{" "}
                    <span className="font-bold text-purple-600">
                      {currentSongs} songs
                    </span>{" "}
                    and reached your limit. Upgrade your plan to create more
                    amazing music!
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3"
                    disabled={true}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Upgrade to Create More
                  </Button>
                  <Link href="/you/tracks" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 bg-transparent"
                    >
                      View My Songs
                    </Button>
                  </Link>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 space-y-2 mt-auto ">
                  <h4 className="font-semibold text-purple-800 text-sm">
                    With a premium plan{" "}
                    <span className="font-bold"> (in features)</span> you'll
                    get:
                  </h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      Unlimited song creation
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      Advanced editing tools
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                      High-quality exports
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          }
        />
        {/* Footer */}
        <p className="text-center text-sm text-gray-500">
          Need help?{" "}
          <a href="#" className="text-purple-600 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
