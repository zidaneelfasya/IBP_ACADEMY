import UserLayout from "@/Layouts/UserLayout";
import { Heart } from "lucide-react";

export default function CompetitionResultPage() {
    return (
        <UserLayout title="Dashboard">
            <div className="max-w-4xl mx-auto">
                <div className="text-center space-y-6 py-12">
                    <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                        <Heart className="w-12 h-12 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-primary text-balance">
                        Your Journey is Just Beginning!
                    </h1>
                    <p className="text-lg text-foreground font-medium">
                        You did not pass to the next round this time.
                    </p>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                        While you weren't selected this time, your participation
                        shows incredible courage and determination. Every great
                        success story includes moments like this.
                    </p>
                </div>
            </div>
        </UserLayout>
    );
}
