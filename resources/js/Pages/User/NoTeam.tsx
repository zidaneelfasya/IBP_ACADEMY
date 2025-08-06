import UserLayout from "@/Layouts/UserLayout";
import { Head, Link } from "@inertiajs/react";
import { GraduationCap, Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";

interface NoTeamProps {
    bpcRoute: string;
    bccRoute: string;
}

const competitionOptions = [
    {
        name: "Business Plan Competition (BPC)",
        description: "Register your team for the Business Plan Competition",
        route: "bpcRoute", // This will be replaced with actual prop
    },
    {
        name: "Business Case Competition (BCC)",
        description: "Register your team for the Business Case Competition",
        route: "bccRoute", // This will be replaced with actual prop
    },
];

export default function NoTeam({ bpcRoute, bccRoute }: NoTeamProps) {
    // Map the actual routes to our options
    const optionsWithRoutes = competitionOptions.map((option) => ({
        ...option,
        route: option.name.includes("BPC") ? bpcRoute : bccRoute,
    }));

    return (
        <UserLayout title="Team Registration">
            <Head title="Team Registration Required" />
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto p-4 space-y-6">
                    <div className="text-center py-6">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <GraduationCap className="h-6 w-6 text-blue-600" />
                            <h1 className="text-2xl font-bold text-gray-900">
                                Team Registration Dashboard
                            </h1>
                        </div>
                        <p className="text-gray-600">
                            You haven't registered a team yet
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                Register Your Team
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                {optionsWithRoutes.map((option) => (
                                    <Card key={option.name}>
                                        <CardHeader>
                                            <CardTitle>{option.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <p className="text-sm text-gray-600">
                                                {option.description}
                                            </p>
                                            <Button asChild className="w-full">
                                                <Link href={option.route}>
                                                    Register Now
                                                </Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </UserLayout>
    );
}
