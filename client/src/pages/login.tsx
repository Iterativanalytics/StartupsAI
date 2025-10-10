
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GoogleSignIn } from "@/components/GoogleSignIn";
import { Building, FileText, TrendingUp, Users } from "lucide-react";

export default function Login() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Welcome to IterativStartups</CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Your strategic documents platform for startup success
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <Building className="h-8 w-8 mx-auto text-blue-600" />
                <p className="text-sm text-gray-600">Business Plans</p>
              </div>
              <div className="space-y-2">
                <FileText className="h-8 w-8 mx-auto text-green-600" />
                <p className="text-sm text-gray-600">Proposals</p>
              </div>
              <div className="space-y-2">
                <TrendingUp className="h-8 w-8 mx-auto text-purple-600" />
                <p className="text-sm text-gray-600">Pitch Decks</p>
              </div>
              <div className="space-y-2">
                <Users className="h-8 w-8 mx-auto text-orange-600" />
                <p className="text-sm text-gray-600">Applications</p>
              </div>
            </div>

            <div className="space-y-4">
              <GoogleSignIn />
            </div>

            <p className="text-xs text-center text-gray-500">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
